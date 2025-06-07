/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import {
    DestroyAggregation,
    GetAggregation,
    GetProperty,
    RemoveAggregation,
    RemoveAllAggregation,
    SetProperty
} from "ui5/antares/pro/types/Global.types";
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
        setRequiredPropertyErrorMessage: SetProperty<string>;
        getDateTimeSettings: GetProperty<IDateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<IDateTimeSettings | undefined>;
        getNumberSettings: GetProperty<INumberSettings | undefined>;
        setNumberSettings: SetProperty<INumberSettings | undefined>;
        getExcludedProperties: GetProperty<string[]>;
        setExcludedProperties: SetProperty<string[]>;
        getReadonlyProperties: GetProperty<string[]>;
        setReadonlyProperties: SetProperty<string[]>;
        getRequiredProperties: GetProperty<string[]>;
        setRequiredProperties: SetProperty<string[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getPropertyLabels: GetProperty<IPropertyLabel[]>;
        setPropertyLabels: SetProperty<IPropertyLabel[]>;
        getNavProperties: GetProperty<string[]>;
        setNavProperties: SetProperty<string[]>;
        getValueLists: GetAggregation<ValueList[]>;
        removeValueList: RemoveAggregation<ValueList>;
        removeAllValueLists: RemoveAllAggregation;
        destroyValueLists: DestroyAggregation;
        getValidationLogics: GetAggregation<ValidationLogic[]>;
        removeValidationLogic: RemoveAggregation<ValidationLogic>;
        removeAllValidationLogics: RemoveAllAggregation;
        destroyValidationLogics: DestroyAggregation;
    }
}

export type Operation = "Create" | "Read" | "Update" | "Delete";
export type GuidMode = "All" | "Key" | "NonKey" | "None";

export interface IPropertyLabel {
    name: string;
    label: string;
}

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