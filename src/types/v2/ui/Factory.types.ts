/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import Context from "sap/ui/model/odata/v2/Context";
import {
    AddAggregation,
    DestroyAggregation,
    GetAggregation,
    GetProperty,
    RemoveAggregation,
    RemoveAllAggregation,
    SetProperty
} from "ui5/antares/pro/types/Global.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/ui/Factory" {
    export default interface Factory {
        getContext: GetProperty<Context>;
        setContext: SetProperty<Context>;
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
        getMetadataLabelEnabled: GetProperty<boolean>;
        setMetadataLabelEnabled: SetProperty<boolean>;
        getGuidGenerationMode: GetProperty<GuidMode>;
        setGuidGenerationMode: SetProperty<GuidMode>;
        getGuidVisibilityMode: GetProperty<GuidMode>;
        setGuidVisibilityMode: SetProperty<GuidMode>;
        getValidationErrorMessage: GetProperty<string>;
        setValidationErrorMessage: SetProperty<string>;
        getShowErrorMessageBox: GetProperty<boolean>;
        setShowErrorMessageBox: SetProperty<boolean>;
        getDateTimeSettings: GetProperty<DateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<DateTimeSettings | undefined>;
        getNumberSettings: GetProperty<NumberSettings | undefined>;
        setNumberSettings: SetProperty<NumberSettings | undefined>;
        getPropertySettings: GetProperty<PropertySettings[]>;
        setPropertySettings: SetProperty<PropertySettings[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        addNavigationProperty: AddAggregation<NavigationProperty>;
        removeNavigationProperty: RemoveAggregation<NavigationProperty>;
        getNavigationProperties: GetAggregation<NavigationProperty[]>;
        removeAllNavigationProperties: RemoveAllAggregation;
        destroyNavigationProperties: DestroyAggregation;
        addValidationLogic: AddAggregation<ValidationLogic>;
        removeValidationLogic: RemoveAggregation<ValidationLogic>;
        getValidationLogics: GetAggregation<ValidationLogic[]>;
        removeAllValidationLogics: RemoveAllAggregation;
        destroyValidationLogics: DestroyAggregation;
        removeValueList: RemoveAggregation<ValueList>;
        getValueLists: GetAggregation<ValueList[]>;
        removeAllValueLists: RemoveAllAggregation;
        destroyValueLists: DestroyAggregation;
    }
}

export type Operation = "Create" | "Update" | "Delete" | "Read";
export type FormType = "SimpleForm" | "SmartForm";
export type GuidMode = "All" | "Key" | "NonKey" | "None";

export type TextInEditModeSource =
    "None" |
    "NavigationProperty" |
    "ValueList" |
    "ValueListNoValidation" |
    "ValueListWarning";

export interface DateTimeSettings {
    datePattern?: string;
    dateTimePattern?: string;
    timePattern?: string;
}

export interface NumberSettings {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
}

export interface PropertySettings {
    name: string;
    label?: string;
    required?: boolean;
    readonly?: boolean;
    excluded?: boolean;
    textInEditModeSource?: TextInEditModeSource;
}