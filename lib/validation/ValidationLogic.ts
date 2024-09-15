import BaseObject from "sap/ui/base/Object";
import Controller from "sap/ui/core/mvc/Controller";
import { IValidationLogicSettings, ValidationOperator, ValidationValue } from "ui5/antares/pro/types/validation/ValidationLogic";
import { IEntityProperty, PropertyType } from "ui5/antares/pro/types/odata/v2/ODataMetadataReader";
import Context from "sap/ui/model/odata/v2/Context";

/**
 * @namespace ui5.antares.pro.validation
 */
export default class ValidationLogic extends BaseObject {
    private settings: IValidationLogicSettings;
    private context: Context;
    private defaultListener: Controller;
    private properties: IEntityProperty[];

    constructor(settings: IValidationLogicSettings) {
        super();
        this.settings = settings;
    }

    public async validate(context: Context, properties: IEntityProperty[], defaultListener: Controller): Promise<boolean> {
        if (this.settings.validator) {
            return Promise.resolve(this.settings.validator.call(this.settings.listener || defaultListener, context.getProperty(this.settings.propertyName)));
        }

        const propertyType = this.getPropertyType(this.settings.propertyName);
        this.context = context;
        this.properties = properties;
        this.defaultListener = defaultListener;

        this.validateType(propertyType, this.settings.value1!, this.settings.value2);
        this.validateOperatorCompatibility(this.settings.operator!, propertyType);

        switch (this.settings.operator!) {
            case "NE":
                return this.validateNE();
            default:
                return this.validateEQ();
        }
    }

    private async validateEQ(): Promise<boolean> {
        return true;
    }

    private async validateNE(): Promise<boolean> {
        return true;
    }

    private validateType(edmType: PropertyType, value1: ValidationValue, value2?: ValidationValue) {
        switch (edmType) {
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                this.validateDateType(value1, value2);
                break;
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Decimal":
            case "Edm.Double":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Single":
                this.validateNumberType(value1, value2);
                break;
            case "Edm.Boolean":
                this.validateBooleanType(value1, value2);
                break;
            case "Edm.Guid":
                this.validateGuidType(value1, value2);
                break;
            case "Edm.String":
                this.validateStringType(value1, value2);
                break;
            case "Edm.Int64":
                this.validateBigIntType(value1, value2);
                break;
        }
    }

    private validateDateType(value1: ValidationValue, value2?: ValidationValue) {
        if (!(value1 instanceof Date)) {
            throw new Error("value1 must be Date instance");
        }

        if (value2) {
            if (!(value2 instanceof Date)) {
                throw new Error("value2 must be Date instance");
            }
        }
    }

    private validateNumberType(value1: ValidationValue, value2?: ValidationValue) {
        if (typeof value1 !== "number") {
            throw new Error("value1 must be number");
        }

        if (value2) {
            if (typeof value2 !== "number") {
                throw new Error("value2 must be number");
            }
        }
    }

    private validateBooleanType(value1: ValidationValue, value2?: ValidationValue) {
        if (typeof value1 !== "boolean") {
            throw new Error("value1 must be boolean");
        }

        if (value2) {
            if (typeof value2 !== "boolean") {
                throw new Error("value2 must be boolean");
            }
        }
    }

    private validateGuidType(value1: ValidationValue, value2?: ValidationValue) {
        const regex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        if (typeof value1 !== "string") {
            throw new Error("value1 must be string");
        }

        if (!regex.test(value1)) {
            throw new Error("guid does not match format");
        }

        if (value2) {
            if (typeof value2 !== "string") {
                throw new Error("value2 must be string");
            }

            if (!regex.test(value2)) {
                throw new Error("guid does not match format");
            }
        }
    }

    private validateStringType(value1: ValidationValue, value2?: ValidationValue) {
        if (typeof value1 !== "string") {
            throw new Error("value1 must be string");
        }

        if (value2) {
            if (typeof value2 !== "string") {
                throw new Error("value2 must be string");
            }
        }
    }

    private validateBigIntType(value1: ValidationValue, value2?: ValidationValue) {
        if (typeof value1 !== "bigint") {
            throw new Error("value1 must be bigint");
        }

        if (value2) {
            if (typeof value2 !== "bigint") {
                throw new Error("value2 must be bigint");
            }
        }
    }

    private validateOperatorCompatibility(operator: ValidationOperator, edmType: PropertyType) {
        switch (operator) {
            case "Contains":
            case "NotContains":
            case "StartsWith":
            case "NotStartsWith":
            case "EndsWith":
            case "NotEndsWith":
                if (edmType !== "Edm.String") {
                    throw new Error("These operators can only be used with string type");
                }
                break;
            case "BT":
            case "NB":
            case "GE":
            case "GT":
            case "LE":
            case "LT":
                const supportedTypes = [
                    "Edm.Byte",
                    "Edm.SByte",
                    "Edm.Decimal",
                    "Edm.Double",
                    "Edm.Int16",
                    "Edm.Int32",
                    "Edm.Int64",
                    "Edm.Single",
                    "Edm.DateTime",
                    "Edm.DateTimeOffset"
                ];

                if (!supportedTypes.includes(edmType)) {
                    throw new Error("These operators can only be used with number and Date type");
                }
                break;
        }
    }

    public validateInitialSettings() {
        if (this.settings.validator) {
            return;
        }

        this.validateOperator();
        this.validateProperty();
        this.validateDependencies();
    }

    private validateOperator() {
        if (!this.settings.operator) {
            throw new Error("If no validator function is attached, operator is mandatory");
        }
    }

    private validateProperty() {
        if (["BT", "NB"].includes(this.settings.operator!)) {
            if (this.settings.value1 == null || this.settings.value2 == null) {
                throw new Error("BT and NB requires both value1 and value2");
            }
        } else {
            if (this.settings.value1 == null) {
                throw new Error("value1 must be provided");
            }
        }
    }

    private validateDependencies() {
        if (!this.settings.dependencies) {
            return;
        }

        this.validateDependencyOperator();
        this.validateDependencyProperty();
    }

    private validateDependencyOperator() {
        for (const dependency of this.settings.dependencies!.validations) {
            if (!dependency.operator) {
                throw new Error("If no validator function is attached, operator is mandatory");
            }
        }
    }

    private validateDependencyProperty() {
        for (const dependency of this.settings.dependencies!.validations) {
            if (["BT", "NB"].includes(dependency.operator!)) {
                if (dependency.value1 == null || dependency.value2 == null) {
                    throw new Error("BT and NB requires both dependentValue1 and dependentValue2");
                }
            } else {
                if (dependency.value1 == null) {
                    throw new Error("dependentValue1 must be provided");
                }
            }
        }
    }

    private getPropertyType(propertyName: string) {
        const property = this.properties.find(prop => prop.name === propertyName);

        if (!property) {
            throw new Error("property does not exist");
        }

        return property.type;
    }

    public getPropertyName(): string {
        return this.settings.propertyName;
    }
}