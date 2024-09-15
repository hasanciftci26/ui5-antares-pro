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

export type ValidationValue = string | boolean | number | Date;

export interface IValidationDependency {
    propertyName: string;
    operator: ValidationOperator;
    value1: ValidationValue;
    value2?: ValidationValue;
}

export interface IValidationLogicSettings {
    propertyName: string;
    operator?: ValidationOperator;
    value1?: ValidationValue;
    value2?: ValidationValue;
    validator?: (value: ValidationValue) => Promise<boolean> | boolean;
    listener?: object;
    dependencies?: {
        validations: IValidationDependency[];
        and?: boolean;
    };
}