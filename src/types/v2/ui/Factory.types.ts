/* eslint-disable semi */
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

declare module "ui5/antares/pro/v2/ui/Factory" {
    export default interface Factory {
        getFormType: GetProperty<FormType>;
        setFormType: SetProperty<FormType>;
        getPropertySettings: GetProperty<PropertySettings[]>;
        setPropertySettings: SetProperty<PropertySettings[]>;
        addNavigationProperty: AddAggregation<NavigationProperty>;
        removeNavigationProperty: RemoveAggregation<NavigationProperty>;
        getNavigationProperties: GetAggregation<NavigationProperty[]>;
        removeAllNavigationProperties: RemoveAllAggregation;
        destroyNavigationProperties: DestroyAggregation;
    }
}

export type FormType = "SimpleForm" | "SmartForm";

export type TextInEditModeSource =
    "None" |
    "NavigationProperty" |
    "ValueList" |
    "ValueListNoValidation" |
    "ValueListWarning";

export interface PropertySettings {
    name: string;
    label?: string;
    required?: boolean;
    readonly?: boolean;
    excluded?: boolean;
    textInEditModeSource?: TextInEditModeSource;
}