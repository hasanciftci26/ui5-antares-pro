import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import ValidateException from "sap/ui/model/ValidateException";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Condition, IPropertyRef, ITimeObject, Operator, Settings } from "ui5/antares/pro/types/v2/validation/ValidationLogic.types";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import TimeValidation from "ui5/antares/pro/v2/validation/TimeValidation";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class ValidationLogic extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string", visibility: "public", defaultValue: "" },
            operator: { type: "string", visibility: "public", defaultValue: "EQ" },
            value1: { type: "any", visibility: "public" },
            value2: { type: "any", visibility: "public" },
            errorMessage: { type: "string", visibility: "public", defaultValue: "" },
            logicalOperator: { type: "string", visibility: "public", defaultValue: "And" },
            conditions: { type: "object[]", visibility: "public", defaultValue: [] },
            validator: { type: "function", visibility: "public" },
            useChildContext: { type: "boolean", visibility: "public", defaultValue: false }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public async evaluate(value: any) {
        const validator = this.getValidator();
        const parent = this.getParent() as ContentGenerator;

        if (validator) {
            BusyIndicator.show(0);

            const result = await Promise.resolve(validator.call(parent.getController(), value));
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

        const evaluation = this.evaluateSingleCondition(this.getOperator(), {
            context: value,
            value1: this.isPropertyRef(value1) ? this.getPropertyRefValue(value1) : value1,
            value2: this.isPropertyRef(value2) ? this.getPropertyRefValue(value2) : value2
        });

        if (!evaluation) {
            throw new ValidateException(this.getErrorMessage());
        }
    }

    private evaluateConditions() {
        if (!this.getConditions().length) {
            return true;
        }

        const evaluations: boolean[] = [];
        const context = this.getRelevantContext();

        for (const condition of this.getConditions()) {
            this.check(condition.propertyName);

            const contextValue = context.getProperty(this.getPropertyPath(condition.propertyName));
            const value1 = this.hasValue1(condition) ? condition.value1 : undefined;
            const value2 = this.hasValue2(condition) ? condition.value2 : undefined;
            const evaluation = this.evaluateSingleCondition(condition.operator, {
                context: contextValue,
                value1: this.isPropertyRef(value1) ? this.getPropertyRefValue(value1) : value1,
                value2: this.isPropertyRef(value2) ? this.getPropertyRefValue(value2) : value2
            });

            evaluations.push(evaluation);
        }

        if (this.getLogicalOperator() === "And") {
            return evaluations.every(evaluation => evaluation === true);
        } else {
            return evaluations.some(evaluation => evaluation === true);
        }
    }

    private check(propertyName: string) {
        const parent = this.getParent() as ContentGenerator;

        if (propertyName.includes("/")) {
            const navProperty = propertyName.split("/")[0];
            const childMetaContext = parent.getMetaContexts().find(meta => meta.getNavProperty()?.name === navProperty);

            if (!childMetaContext) {
                throw new Error(
                    "Property: " + propertyName +
                    " was not found. Make sure the navigation property is added in the navProperties property in the constructor " +
                    "or set with setNavProperties() method."
                );
            }

            this.checkChildEntity(propertyName, childMetaContext);
        } else {
            const parentMetaContext = parent.getParentMetaContext();
            this.checkParentEntity(propertyName, parentMetaContext);
        }
    }

    private checkParentEntity(propertyName: string, metaContext: MetaContext) {
        const property = metaContext.getProps().find(prop => prop.name === propertyName);

        if (!property) {
            throw new Error("Property: " + propertyName + " was not found in the Entity Set: " + metaContext.getEntitySet());
        }
    }

    private checkChildEntity(propertyName: string, metaContext: MetaContext) {
        const childPropertyName = propertyName.split("/")[1];
        const property = metaContext.getProps().find(prop => prop.name === childPropertyName);

        if (!property) {
            throw new Error("Property: " + childPropertyName + " was not found in the Entity Set: " + metaContext.getEntitySet());
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

    private evaluateSingleCondition(operator: Operator, values: { context: any; value1: any; value2: any; }): boolean {
        switch (operator) {
            case "NE":
                return this.getCorrectedValue(values.context) !== this.getCorrectedValue(values.value1);
            case "GE":
                return this.getCorrectedValue(values.context) >= this.getCorrectedValue(values.value1);
            case "GT":
                return this.getCorrectedValue(values.context) > this.getCorrectedValue(values.value1);
            case "LE":
                return this.getCorrectedValue(values.context) <= this.getCorrectedValue(values.value1);
            case "LT":
                return this.getCorrectedValue(values.context) < this.getCorrectedValue(values.value1);
            case "IsEmpty":
                return this.getCorrectedValue(values.context) == null || this.getCorrectedValue(values.context) === "";
            case "IsNotEmpty":
                return this.getCorrectedValue(values.context) != null && this.getCorrectedValue(values.context) !== "";
            case "Contains":
                return (values.context as string).includes(values.value1);
            case "NotContains":
                return (values.context as string).includes(values.value1) === false;
            case "StartsWith":
                return (values.context as string).startsWith(values.value1);
            case "NotStartsWith":
                return (values.context as string).startsWith(values.value1) === false;
            case "EndsWith":
                return (values.context as string).endsWith(values.value1);
            case "NotEndsWith":
                return (values.context as string).endsWith(values.value1) === false;
            case "BT":
                return this.getCorrectedValue(values.context) >= this.getCorrectedValue(values.value1) &&
                    this.getCorrectedValue(values.context) <= this.getCorrectedValue(values.value2);
            case "NB":
                return this.getCorrectedValue(values.context) > this.getCorrectedValue(values.value2) ||
                    this.getCorrectedValue(values.context) < this.getCorrectedValue(values.value1);
            case "In":
                return values.value1.includes(values.context);
            case "NotIn":
                return values.value1.includes(values.context) === false;
            default:
                return this.getCorrectedValue(values.context) === this.getCorrectedValue(values.value1);
        }
    }

    private getRelevantContext() {
        const parent = this.getParent() as ContentGenerator;

        if (this.getUseChildContext()) {
            return parent.getChildContext() || parent.getContext();
        } else {
            return parent.getContext();
        }
    }

    private getPropertyPath(propertyName: string) {
        if (this.getUseChildContext() && propertyName.includes("/")) {
            return propertyName.split("/")[1];
        } else {
            return propertyName;
        }
    }

    private hasValue1(condition: Condition): condition is Extract<Condition, { value1: unknown; }> {
        return "value1" in condition;
    }

    private hasValue2(condition: Condition): condition is Extract<Condition, { value2: unknown; }> {
        return "value2" in condition;
    }

    private isTimeObject(value: any): value is ITimeObject {
        return (
            typeof value === "object" &&
            value != null &&
            "ms" in value &&
            typeof value.ms === "number"
        );
    }

    private isPropertyRef(value: any): value is IPropertyRef {
        return (
            typeof value === "object" &&
            value != null &&
            "propertyName" in value &&
            typeof value.propertyName === "string"
        );
    }

    private getPropertyRefValue(propertyRef: IPropertyRef) {
        const context = this.getRelevantContext();
        return context.getProperty(this.getPropertyPath(propertyRef.propertyName));
    }
}