/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
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
export type Condition = CommonWithValue | CommonWithMultiValue | CommonWithNoValue | NumericWithValue | NumericWithMultiValue | String | Regex;

export interface CommonWithValue {
    propertyName: string;
    operator: CommonOperatorWithValue;
    value1: Value | PropertyRef;
}

export interface CommonWithMultiValue {
    propertyName: string;
    operator: CommonOperatorWithMultiValue;
    value1: Array<string | number | bigint>;
}

export interface CommonWithNoValue {
    propertyName: string;
    operator: CommonOperatorWithNoValue;
}

export interface NumericWithValue {
    propertyName: string;
    operator: NumericOperatorWithValue;
    value1: number | bigint | Date | TimeValidation | PropertyRef;
}

export type NumericWithMultiValue =
    NumericWithMultiValueNumber |
    NumericWithMultiValueDate |
    NumericWithMultiValueTime;

export interface NumericWithMultiValueNumber {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: number | bigint | PropertyRef;
    value2: number | bigint | PropertyRef;
}

export interface NumericWithMultiValueDate {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: Date | PropertyRef;
    value2: Date | PropertyRef;
}

export interface NumericWithMultiValueTime {
    propertyName: string;
    operator: NumericOperatorWithMultiValue;
    value1: TimeValidation | PropertyRef;
    value2: TimeValidation | PropertyRef;
}

export interface String {
    propertyName: string;
    operator: StringOperator;
    value1: string | PropertyRef;
}

export interface Regex {
    propertyName: string;
    operator: RegexOperator;
    value1: RegExp;
}

export type Operator =
    CommonOperatorWithValue |
    CommonOperatorWithMultiValue |
    CommonOperatorWithNoValue |
    NumericOperatorWithValue |
    NumericOperatorWithMultiValue |
    StringOperator |
    RegexOperator;

export type CommonOperatorWithValue = "EQ" | "NE";
export type CommonOperatorWithMultiValue = "In" | "NotIn";
export type CommonOperatorWithNoValue = "IsEmpty";
export type NumericOperatorWithValue = "LE" | "LT" | "GE" | "GT";
export type NumericOperatorWithMultiValue = "BT" | "NB";
export type StringOperator = "Contains" | "NotContains" | "StartsWith" | "NotStartsWith" | "EndsWith" | "NotEndsWith";
export type RegexOperator = "Regex";
export type Value = string | number | bigint | boolean | Date | TimeValidation;
export type LogicalOperator = "And" | "Or";

export interface TimeObject {
    ms: number;
}

export interface PropertyRef {
    propertyName: string;
}