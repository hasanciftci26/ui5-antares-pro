/* eslint-disable semi */
import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import { ButtonType } from "sap/m/library";
import VBox from "sap/m/VBox";
import LayoutData from "sap/ui/core/LayoutData";
import Grid from "sap/ui/layout/Grid";
import HorizontalLayout from "sap/ui/layout/HorizontalLayout";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import Context from "sap/ui/model/odata/v2/Context";
import {
    AddAggregation,
    DestroyAggregation,
    GetAggregation,
    GetProperty,
    RemoveAggregation,
    RemoveAllAggregation,
    SetAggregation,
    SetProperty
} from "ui5/antares/pro/types/Global.types";
import CustomContent from "ui5/antares/pro/v2/custom/CustomContent";
import CustomElement from "ui5/antares/pro/v2/custom/CustomElement";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/ui/Factory" {
    export default interface Factory {
        getContext: GetProperty<Context>;
        setContext: SetProperty<Context>;
        getIndex: GetProperty<number | undefined>;
        setIndex: SetProperty<number | undefined>;
        getFormType: GetProperty<FormType>;
        setFormType: SetProperty<FormType>;
        getDialogTitle: GetProperty<string>;
        setDialogTitle: SetProperty<string>;
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
        getSelectRowError: GetProperty<string>;
        setSelectRowError: SetProperty<string>;
        getShowErrorMessageBox: GetProperty<boolean>;
        setShowErrorMessageBox: SetProperty<boolean>;
        getBooleanFalseByDefault: GetProperty<boolean>;
        setBooleanFalseByDefault: SetProperty<boolean>;
        getDateTimeSettings: GetProperty<DateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<DateTimeSettings | undefined>;
        getNumberSettings: GetProperty<NumberSettings | undefined>;
        setNumberSettings: SetProperty<NumberSettings | undefined>;
        getContentWrapper: GetProperty<ContentWrapper | undefined>;
        setContentWrapper: SetProperty<ContentWrapper | undefined>;
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
        addValueList: AddAggregation<ValueList>;
        removeValueList: RemoveAggregation<ValueList>;
        getValueLists: GetAggregation<ValueList[]>;
        removeAllValueLists: RemoveAllAggregation;
        destroyValueLists: DestroyAggregation;
        getFormLayout: GetAggregation<FormLayout>;
        setFormLayout: SetAggregation<FormLayout>;
        getCustomElements: GetAggregation<CustomElement[]>;
        removeCustomElement: RemoveAggregation<CustomElement>;
        removeAllCustomElements: RemoveAllAggregation;
        destroyCustomElements: DestroyAggregation;
        addCustomContent: AddAggregation<CustomContent>;
        getCustomContents: GetAggregation<CustomContent[]>;
        removeCustomContent: RemoveAggregation<CustomContent>;
        removeAllCustomContents: RemoveAllAggregation;
        destroyCustomContents: DestroyAggregation;
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
    layoutData?: LayoutData;
}

export type ContentWrapper =
    VBox |
    HBox |
    FlexBox |
    Grid |
    VerticalLayout |
    HorizontalLayout;
