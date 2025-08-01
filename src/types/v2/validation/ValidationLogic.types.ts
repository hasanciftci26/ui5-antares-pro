/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import TimeValidation from "ui5/antares/pro/v2/validation/TimeValidation";

declare module "ui5/antares/pro/v2/validation/ValidationLogic" {
    export default interface ValidationLogic {
        /**
         * Returns the name of the property that this validation logic applies to.
         * This is typically the technical name of the property in the entity metadata.
         * 
         * @returns The target property name.
         */
        getPropertyName: GetProperty<string>;

        /**
         * Sets the name of the property to be validated.
         * 
         * @param newValue The technical property name this validation logic is associated with.
         */
        setPropertyName: SetProperty<string>;

        /**
         * Returns the comparison operator used in the validation rule.
         * 
         * @returns The operator defined for this validation logic.
         */
        getOperator: GetProperty<Operator>;

        /**
         * Sets the comparison operator to be used in the validation rule.
         * 
         * @param newValue The operator to define the condition type.
         */
        setOperator: SetProperty<Operator>;

        /**
         * Returns the first value used in the comparison. Can be a static value,
         * an array (for multi-value operators), or undefined if not applicable.
         * 
         * @returns The first comparison value or array of values.
         */
        getValue1: GetProperty<Value | Array<string | number | bigint> | undefined>;

        /**
         * Sets the first value used in the comparison. Can be a static value,
         * an array (for **In**, **NotIn** operators), or undefined.
         * 
         * @param newValue The primary value(s) to compare against.
         */
        setValue1: SetProperty<Value | Array<string | number | bigint> | undefined>;

        /**
         * Returns the second value used in multi-value comparisons (e.g., **BT**, **NB**).
         * May be undefined if not required by the operator.
         * 
         * @returns The second comparison value or undefined.
         */
        getValue2: GetProperty<Value | undefined>;

        /**
         * Sets the second value used in multi-value comparisons.
         * 
         * @param newValue The secondary value to compare against.
         */
        setValue2: SetProperty<Value | undefined>;

        /**
         * Returns the error message that will be shown when validation fails.
         * 
         * @returns The error message text.
         */
        getErrorMessage: GetProperty<string>;

        /**
         * Sets the error message that is displayed to the user if validation fails.
         * 
         * @param newValue The error message to show under the field.
         */
        setErrorMessage: SetProperty<string>;

        /**
         * Returns the logical operator (**And**, **Or**) used to combine sub-conditions.
         * 
         * @returns The logical operator.
         */
        getLogicalOperator: GetProperty<LogicalOperator>;

        /**
         * Sets the logical operator that combines all sub-conditions.
         * 
         * @param newValue The logical operator (**And** or **Or**) to apply.
         */
        setLogicalOperator: SetProperty<LogicalOperator>;

        /**
         * Returns the list of sub-conditions associated with this validation.
         * 
         * @returns An array of additional conditions used in the rule.
         */
        getConditions: GetProperty<Condition[]>;

        /**
         * Sets the list of sub-conditions that enhance the main rule logic.
         * 
         * @param newValue The array of additional validation conditions.
         */
        setConditions: SetProperty<Condition[]>;

        /**
         * Returns the custom validator function, if one is defined.
         * This function is used to perform rule-based or async validations.
         * 
         * @returns The custom validator function or undefined.
         */
        getValidator: GetProperty<Validator | undefined>;

        /**
         * Sets a custom validator function to be executed during submission.
         * 
         * @param newValue A function that returns a boolean or Promise<boolean> 
         * indicating whether the value is valid.
         */
        setValidator: SetProperty<Validator | undefined>;
    }
}

export type Settings = SettingsWithValidator | SettingsWithoutValidator;

export type SettingsWithValidator = {
    /**
     * A custom validator function that is executed during the submission process to verify 
     * whether the value of the specified property is valid. It receives the property's current 
     * value and must return either a boolean or a Promise that resolves to a boolean.
     * If the result is **false**, the validation fails and the associated error message is shown.
     */
    validator: Validator;

    /**
     * Text shown when validation fails. This message is displayed as a value state text below the 
     * automatically generated control in the UI and helps guide users to fix the invalid input.
     */
    errorMessage: string;

    /**
     * The name of the property to which the custom validator function applies. This should be 
     * the technical property name as defined in the metadata of the target entity.
     */
    propertyName: string;
};

export type SettingsWithoutValidator = SettingsBase<Condition>;

export type SettingsBase<T> = T & {
    /**
     * Text shown when validation fails. This message is displayed as a value state text below the 
     * automatically generated control in the UI and helps guide users to fix the invalid input.
     */
    errorMessage: string;

    /**
     * When multiple conditions are used, this logical operator (**And** or **Or**) determines how those 
     * conditions are evaluated in combination. For example, if set to **And**, all conditions must pass.
     * If omitted, defaults to **And**.
     */
    logicalOperator?: LogicalOperator;

    /**
     * An optional array of additional validation conditions. These are combined with the main condition 
     * using the specified logical operator and allow for more complex rule configurations.
     */
    conditions?: Condition[];
};

export type Validator = (value: any) => boolean | Promise<boolean>;
export type Condition = CommonWithValue | CommonWithMultiValue | CommonWithNoValue | NumericWithValue | NumericWithMultiValue | String | Regex;

export interface CommonWithValue {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A basic comparison operator that supports single values such as **EQ** (equal) or **NE** (not equal).
     */
    operator: CommonOperatorWithValue;

    /**
     * The reference value to compare against. Can be a static value (e.g. "XYZ", 100) or 
     * another property from the same entry using a **PropertyRef**.
     */
    value1: Value | PropertyRef;
}

export interface CommonWithMultiValue {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A multi-value comparison operator such as **In** or **NotIn**, which checks whether the value 
     * is (or is not) included in the specified array.
     */
    operator: CommonOperatorWithMultiValue;

    /**
     * An array of values that the property should (or should not) match. Useful for whitelist 
     * or blacklist validations.
     */
    value1: Array<string | number | bigint>;
}

export interface CommonWithNoValue {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A comparison operator that does not require a value, such as **IsEmpty**, which checks 
     * whether the field is empty or not filled in.
     */
    operator: CommonOperatorWithNoValue;
}

export interface NumericWithValue {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A numeric operator such as **GT** (greater than) or **LE** (less than or equal to), 
     * used for value comparison.
     */
    operator: NumericOperatorWithValue;

    /**
     * A comparison value which can be a number, date, time (via **TimeValidation**), or a reference 
     * to another property.
     */
    value1: number | bigint | Date | TimeValidation | PropertyRef;
}

export type NumericWithMultiValue =
    NumericWithMultiValueNumber |
    NumericWithMultiValueDate |
    NumericWithMultiValueTime;

export interface NumericWithMultiValueNumber {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A multi-value operator like **BT** (between) or **NB** (not between), which checks if the 
     * property value falls within a specified range.
     */
    operator: NumericOperatorWithMultiValue;

    /**
     * The lower boundary value of the range. Can be a static value or another property reference.
     */
    value1: number | bigint | PropertyRef;

    /**
     * The upper boundary value of the range. Can be a static value or another property reference.
     */
    value2: number | bigint | PropertyRef;
}

export interface NumericWithMultiValueDate {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A multi-value operator like **BT** (between) or **NB** (not between), which validates whether 
     * the date is within a specified date range.
     */
    operator: NumericOperatorWithMultiValue;

    /**
     * Start date or a property reference to be used as the lower boundary of the range.
     */
    value1: Date | PropertyRef;

    /**
     * End date or a property reference to be used as the upper boundary of the range.
     */
    value2: Date | PropertyRef;
}

export interface NumericWithMultiValueTime {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A time range operator such as **BT** (between) or **NB** (not between), used to validate 
     * whether the time falls within a specific time interval.
     */
    operator: NumericOperatorWithMultiValue;

    /**
     * Start time of the interval, either as a **TimeValidation** instance or a reference to another property.
     */
    value1: TimeValidation | PropertyRef;

    /**
     * End time of the interval, either as a **TimeValidation** instance or a reference to another property.
     */
    value2: TimeValidation | PropertyRef;
}

export interface String {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * A string operator such as **Contains**, **StartsWith**, or **EndsWith**, which defines 
     * how the input string should be matched.
     */
    operator: StringOperator;

    /**
     * A comparison string value or a reference to another property.
     */
    value1: string | PropertyRef;
}

export interface Regex {
    /**
     * The name of the property to validate. Must match the technical property name defined 
     * in the metadata of the entity.
     */
    propertyName: string;

    /**
     * Always set to **"Regex"**, indicating that the value will be tested against a regular expression.
     */
    operator: RegexOperator;

    /**
     * A valid JavaScript regular expression used to test the property value.
     * If the test fails, validation is considered unsuccessful.
     */
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
    /**
     * A time value represented in milliseconds, typically used for internal conversions 
     * when validating Edm.Time fields.
     */
    ms: number;
}

export interface PropertyRef {
    /**
     * The name of another property whose value will be used in a condition instead of a literal value.
     * Enables dynamic comparisons between fields in the same entry.
     */
    propertyName: string;
}