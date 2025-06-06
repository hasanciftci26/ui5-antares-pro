/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/validation/ValidationLogic" {
    export default interface ValidationLogic {
        getPropertyName: GetProperty<string>;
        setPropertyName: SetProperty<string>;
        getOperator: GetProperty<Operator>;
        setOperator: SetProperty<Operator>;
        getValue1: GetProperty<Value | Array<string | number> | undefined>;
        setValue1: SetProperty<Value | Array<string | number> | undefined>;
        getValue2: GetProperty<Value | undefined>;
        setValue2: SetProperty<Value | undefined>;
        getErrorMessage: GetProperty<string>;
        setErrorMessage: SetProperty<string>;
        getLogicalOperator: GetProperty<LogicalOperator>;
        setLogicalOperator: SetProperty<LogicalOperator>;
        getConditions: GetProperty<Condition[]>;
        setConditions: SetProperty<Condition[]>;
    }
}

export type Settings = SettingsBase<Condition>;

export type SettingsBase<T> = T & {
    errorMessage: string;
    logicalOperator?: LogicalOperator;
    conditions?: Condition[];
};

export type Condition = ICommonWithValue | ICommonWithMultiValue | ICommonWithNoValue | INumericWithValue | NumericWithMultiValue | IString;

export interface ICommonWithValue {
    propertyName: string;
    operator: CommonOperatorWithValue;
    value1: Value;
}

export interface ICommonWithMultiValue {
    propertyName: string;
    operator: CommonOperatorWithMultiValue;
    value1: Array<string | number>;
}

export interface ICommonWithNoValue {
    propertyName: string;
    operator: CommonOperatorWithNoValue;
}

export interface INumericWithValue {
    propertyName: string;
    operator: NumericOperatorWithValue;
    value1: number | Date;
}

export type NumericWithMultiValue =
    | INumericWithMultiValueNumber
    | INumericWithMultiValueDate;

export interface INumericWithMultiValueNumber {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: number;
    value2: number;
}

export interface INumericWithMultiValueDate {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: Date;
    value2: Date;
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
export type Value = string | number | boolean | Date;
export type LogicalOperator = "And" | "Or";