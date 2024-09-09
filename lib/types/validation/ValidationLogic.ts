import UI5Date from "sap/ui/core/date/UI5Date";

export interface IValidationLogicSettings {
    propertyName: string;
    operator?: ValidationOperator;
    value1?: ValidationValueType;
    value2?: ValidationValueType;
    dependentProperty?: string;
    dependentOperator?: ValidationOperator;
    dependentValue1?: ValidationValueType;
    dependentValue2?: ValidationValueType;
    validator?: (value: ValidationValueType) => Promise<boolean> | boolean;
    listener?: object;
}

export type ValidationOperator =
    "BT" |
    "Contains" |
    "EndsWith" |
    "EQ" |
    "GE" |
    "GT" |
    "LE" |
    "LT" |
    "NB" |
    "NE" |
    "NotContains" |
    "NotEndsWith" |
    "NotStartsWith" |
    "StartsWith";

export type ValidationValueType = string | boolean | number | Date | UI5Date;