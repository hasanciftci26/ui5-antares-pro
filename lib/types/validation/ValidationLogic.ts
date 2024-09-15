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

export interface IValidationBase {
    propertyName: string;
    operator?: ValidationOperator;
    value1?: ValidationValue;
    value2?: ValidationValue;
}

export interface IValidationLogicSettings extends IValidationBase {
    validator?: (value: ValidationValue) => Promise<boolean> | boolean;
    listener?: object;    
    dependencies?: {
        validations: IValidationBase[];
        and?: boolean;
    };
}