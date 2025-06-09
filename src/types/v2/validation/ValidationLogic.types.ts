/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import TimeValidation from "ui5/antares/pro/v2/validation/TimeValidation";

declare module "ui5/antares/pro/v2/validation/ValidationLogic" {
    export default interface ValidationLogic {
        getPropertyName: GetProperty<string>;
        setPropertyName: SetProperty<string>;
        getOperator: GetProperty<Operator>;
        setOperator: SetProperty<Operator>;
        getValue1: GetProperty<Value | Array<string | number | bigint> | undefined>;
        setValue1: SetProperty<Value | Array<string | number | bigint> | undefined>;
        getValue2: GetProperty<Value | undefined>;
        setValue2: SetProperty<Value | undefined>;
        getErrorMessage: GetProperty<string>;
        setErrorMessage: SetProperty<string>;
        getLogicalOperator: GetProperty<LogicalOperator>;
        setLogicalOperator: SetProperty<LogicalOperator>;
        getConditions: GetProperty<Condition[]>;
        setConditions: SetProperty<Condition[]>;
        getValidator: GetProperty<Validator | undefined>;
        setValidator: SetProperty<Validator | undefined>;
    }
}

export type Settings = SettingsWithValidator | SettingsWithoutValidator;

export type SettingsWithValidator = {
    validator: Validator;
    errorMessage: string;
    propertyName: string;
};

export type SettingsWithoutValidator = SettingsBase<Condition>;

export type SettingsBase<T> = T & {
    errorMessage: string;
    logicalOperator?: LogicalOperator;
    conditions?: Condition[];
};

export type Validator = (value: any) => boolean | Promise<boolean>;
export type Condition = ICommonWithValue | ICommonWithMultiValue | ICommonWithNoValue | INumericWithValue | INumericWithMultiValue | IString;

export interface ICommonWithValue {
    propertyName: string;
    operator: CommonOperatorWithValue;
    value1: Value;
}

export interface ICommonWithMultiValue {
    propertyName: string;
    operator: CommonOperatorWithMultiValue;
    value1: Array<string | number | bigint>;
}

export interface ICommonWithNoValue {
    propertyName: string;
    operator: CommonOperatorWithNoValue;
}

export interface INumericWithValue {
    propertyName: string;
    operator: NumericOperatorWithValue;
    value1: number | bigint | Date | TimeValidation;
}

export type INumericWithMultiValue =
    INumericWithMultiValueNumber |
    INumericWithMultiValueDate |
    INumericWithMultiValueTime;

export interface INumericWithMultiValueNumber {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: number | bigint;
    value2: number | bigint;
}

export interface INumericWithMultiValueDate {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: Date;
    value2: Date;
}

export interface INumericWithMultiValueTime {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: TimeValidation;
    value2: TimeValidation;
}

export interface IString {
    propertyName: string;
    operator: StringOperator;
    value1: string;
}

export type Operator =
    CommonOperatorWithValue |
    CommonOperatorWithMultiValue |
    CommonOperatorWithNoValue |
    NumericOperatorWithValue |
    NumericOperatorWithMultiValue |
    StringOperator;

export type CommonOperatorWithValue = "EQ" | "NE";
export type CommonOperatorWithMultiValue = "In" | "NotIn";
export type CommonOperatorWithNoValue = "IsEmpty" | "IsNotEmpty";
export type NumericOperatorWithValue = "LE" | "LT" | "GE" | "GT";
export type NumericOperatorWithMultiValue = "BT" | "NB";
export type StringOperator = "Contains" | "NotContains" | "StartsWith" | "NotStartsWith" | "EndsWith" | "NotEndsWith";
export type Value = string | number | bigint | boolean | Date | TimeValidation;
export type LogicalOperator = "And" | "Or";

export interface ITimeObject {
    ms: number;
}