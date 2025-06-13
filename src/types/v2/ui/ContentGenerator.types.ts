/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import {
    DestroyAggregation,
    GetAggregation,
    GetProperty,
    MakeRequired,
    RemoveAggregation,
    RemoveAllAggregation,
    SetProperty
} from "ui5/antares/pro/types/Global.types";
import { TableClass } from "ui5/antares/pro/types/v2/ui/TableGenerator.types";
import CustomElement from "ui5/antares/pro/v2/ui/CustomElement";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/ui/ContentGenerator" {
    export default interface ContentGenerator {
        getFormType: GetProperty<FormType>;
        setFormType: SetProperty<FormType>;
        getFormTitle: GetProperty<string>;
        setFormTitle: SetProperty<string>;
        getSubmitButtonText: GetProperty<string>;
        setSubmitButtonText: SetProperty<string>;
        getSubmitButtonType: GetProperty<ButtonType>;
        setSubmitButtonType: SetProperty<ButtonType>;
        getCloseButtonText: GetProperty<string>;
        setCloseButtonText: SetProperty<string>;
        getCloseButtonType: GetProperty<ButtonType>;
        setCloseButtonType: SetProperty<ButtonType>;
        getKeyEnforcementEnabled: GetProperty<boolean>;
        setKeyEnforcementEnabled: SetProperty<boolean>;
        getGuidGenerationMode: GetProperty<GuidMode>;
        setGuidGenerationMode: SetProperty<GuidMode>;
        getGuidVisibilityMode: GetProperty<GuidMode>;
        setGuidVisibilityMode: SetProperty<GuidMode>;
        getMetadataLabelEnabled: GetProperty<boolean>;
        setMetadataLabelEnabled: SetProperty<boolean>;
        getValidationErrorMessage: GetProperty<string>;
        setValidationErrorMessage: SetProperty<string>;
        setRequiredPropertyErrorMessage: SetProperty<string>;
        getShowErrorMessageBox: GetProperty<boolean>;
        setShowErrorMessageBox: SetProperty<boolean>;
        getDateTimeSettings: GetProperty<IDateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<IDateTimeSettings | undefined>;
        getNumberSettings: GetProperty<INumberSettings | undefined>;
        setNumberSettings: SetProperty<INumberSettings | undefined>;
        getBooleanSettings: GetProperty<Required<IBooleanSettings>>;
        setBooleanSettings: SetProperty<IBooleanSettings>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getPropertySettings: GetProperty<IPropertySettings[]>;
        setPropertySettings: SetProperty<IPropertySettings[]>;
        getNavProperties: GetProperty<MakeRequired<INavProperty, "tableClass">[]>;
        getValueLists: GetAggregation<ValueList[]>;
        removeValueList: RemoveAggregation<ValueList>;
        removeAllValueLists: RemoveAllAggregation;
        destroyValueLists: DestroyAggregation;
        getValidationLogics: GetAggregation<ValidationLogic[]>;
        removeValidationLogic: RemoveAggregation<ValidationLogic>;
        removeAllValidationLogics: RemoveAllAggregation;
        destroyValidationLogics: DestroyAggregation;
        getCustomElements: GetAggregation<CustomElement[]>;
        removeCustomElement: RemoveAggregation<CustomElement>;
        removeAllCustomElements: RemoveAllAggregation;
        destroyCustomElements: DestroyAggregation;
    }
}

export type Operation = "Create" | "Read" | "Update" | "Delete";
export type GuidMode = "All" | "Key" | "NonKey" | "None";

export interface IPropertySettings {
    name: string;
    label?: string;
    textInEditModeSource?: TextInEditModeSource;
    required?: boolean;
    readonly?: boolean;
    excluded?: boolean;
}

export type TextInEditModeSource =
    "None" |
    "NavigationProperty" |
    "ValueList" |
    "ValueListNoValidation" |
    "ValueListWarning";

export type FormType = "SmartForm" | "SimpleForm";

export interface IDateTimeSettings {
    datePattern?: string;
    dateTimePattern?: string;
    timePattern?: string;
}

export interface INumberSettings {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
}

export interface IBooleanSettings {
    trueText?: string;
    falseText?: string;
    autoFalse?: boolean;
}

export interface INavProperty {
    name: string;
    tableTitle?: string;
    tableClass?: TableClass;
    createFormTitle?: string;
    createButtonText?: string;
    createButtonType?: ButtonType;
    updateFormTitle?: string;
    updateButtonText?: string;
    updateButtonType?: ButtonType;
    deleteFormTitle?: string;
    deleteButtonText?: string;
    deleteButtonType?: ButtonType;
    closeButtonText?: string;
    closeButtonType?: ButtonType;
}