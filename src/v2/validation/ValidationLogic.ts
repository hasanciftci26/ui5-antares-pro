import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import ValidateException from "sap/ui/model/ValidateException";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Condition, Operator, PropertyRef, Settings, TimeObject } from "ui5/antares/pro/types/v2/validation/ValidationLogic.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import TimeValidation from "ui5/antares/pro/v2/validation/TimeValidation";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class ValidationLogic extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string" },
            operator: { type: "string" },
            value1: { type: "any" },
            value2: { type: "any" },
            errorMessage: { type: "string" },
            logicalOperator: { type: "string", defaultValue: "And" },
            conditions: { type: "object[]", defaultValue: [] },
            validator: { type: "function" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public async evaluate(value: any) {
        const validator = this.getValidator();
        const factory = this.getFactory();

        if (validator) {
            BusyIndicator.show(0);

            const result = await Promise.resolve(validator.call(factory.getController(), value));
            BusyIndicator.hide();

            if (!result) {
                throw new ValidateException(this.getErrorMessage());
            }

            return;
        }

        const valid = this.evaluateConditions();

        if (!valid) {
            return;
        }

        const value1 = this.getValue1();
        const value2 = this.getValue2();

        const evaluation = this.evaluateSingleCondition(
            this.getOperator(),
            value,
            this.isPropertyRef(value1) ? this.getPropertyRefValue(value1) : value1,
            this.isPropertyRef(value2) ? this.getPropertyRefValue(value2) : value2
        );

        if (!evaluation) {
            throw new ValidateException(this.getErrorMessage());
        }
    }

    private evaluateConditions() {
        if (!this.getConditions().length) {
            return true;
        }

        const evaluations: boolean[] = [];
        const context = this.getContext();

        for (const condition of this.getConditions()) {
            const contextValue = context.getProperty(this.getPropertyPath(condition.propertyName));
            const value1 = this.hasValue1(condition) ? condition.value1 : undefined;
            const value2 = this.hasValue2(condition) ? condition.value2 : undefined;

            const evaluation = this.evaluateSingleCondition(
                condition.operator,
                contextValue,
                this.isPropertyRef(value1) ? this.getPropertyRefValue(value1) : value1,
                this.isPropertyRef(value2) ? this.getPropertyRefValue(value2) : value2
            );

            evaluations.push(evaluation);
        }

        if (this.getLogicalOperator() === "And") {
            return evaluations.every(evaluation => evaluation === true);
        } else {
            return evaluations.some(evaluation => evaluation === true);
        }
    }

    private evaluateSingleCondition(operator: Operator, contextValue: any, value1: any, value2: any): boolean {
        switch (operator) {
            case "NE":
                return this.getCorrectedValue(contextValue) !== this.getCorrectedValue(value1);
            case "GE":
                return this.getCorrectedValue(contextValue) >= this.getCorrectedValue(value1);
            case "GT":
                return this.getCorrectedValue(contextValue) > this.getCorrectedValue(value1);
            case "LE":
                return this.getCorrectedValue(contextValue) <= this.getCorrectedValue(value1);
            case "LT":
                return this.getCorrectedValue(contextValue) < this.getCorrectedValue(value1);
            case "IsEmpty":
                return this.getCorrectedValue(contextValue) == null || this.getCorrectedValue(contextValue) === "";
            case "Contains":
                return (contextValue as string).includes(value1);
            case "NotContains":
                return (contextValue as string).includes(value1) === false;
            case "StartsWith":
                return (contextValue as string).startsWith(value1);
            case "NotStartsWith":
                return (contextValue as string).startsWith(value1) === false;
            case "EndsWith":
                return (contextValue as string).endsWith(value1);
            case "NotEndsWith":
                return (contextValue as string).endsWith(value1) === false;
            case "BT":
                return this.getCorrectedValue(contextValue) >= this.getCorrectedValue(value1) &&
                    this.getCorrectedValue(contextValue) <= this.getCorrectedValue(value2);
            case "NB":
                return this.getCorrectedValue(contextValue) > this.getCorrectedValue(value2) ||
                    this.getCorrectedValue(contextValue) < this.getCorrectedValue(value1);
            case "In":
                return value1.includes(contextValue);
            case "NotIn":
                return value1.includes(contextValue) === false;
            case "Regex":
                return (value1 as RegExp).test(contextValue as string);
            default:
                return this.getCorrectedValue(contextValue) === this.getCorrectedValue(value1);
        }
    }

    private getCorrectedValue(value: any) {
        if (value instanceof Date) {
            return value.getTime();
        } else if (value instanceof TimeValidation) {
            return value.getMilliseconds();
        } else if (this.isTimeObject(value)) {
            return value.ms;
        } else {
            return value;
        }
    }

    private getFactory() {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA<NavigationProperty>("ui5.antares.pro.v2.metadata.NavigationProperty")) {
            return parent.getOwnerParent();
        }

        return parent as Factory;
    }

    private getContext() {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA<NavigationProperty>("ui5.antares.pro.v2.metadata.NavigationProperty")) {
            return parent.getContext();
        }

        return (parent as Factory).getContext();
    }

    private getPropertyPath(property: string) {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA<NavigationProperty>("ui5.antares.pro.v2.metadata.NavigationProperty")) {
            if (parent.getMultiplicity() === "One") {
                return parent.getName() + "/" + property;
            } else {
                return property;
            }
        }

        return property;
    }

    private hasValue1(condition: Condition): condition is Extract<Condition, { value1: any; }> {
        return "value1" in condition;
    }

    private hasValue2(condition: Condition): condition is Extract<Condition, { value2: any; }> {
        return "value2" in condition;
    }

    private isTimeObject(value: any): value is TimeObject {
        return typeof value === "object" &&
            value != null &&
            "ms" in value &&
            typeof value.ms === "number";
    }

    private isPropertyRef(value: any): value is PropertyRef {
        return typeof value === "object" &&
            value != null &&
            "propertyName" in value &&
            typeof value.propertyName === "string";
    }

    private getPropertyRefValue(propertyRef: PropertyRef) {
        const context = this.getContext();
        return context.getProperty(this.getPropertyPath(propertyRef.propertyName));
    }
}