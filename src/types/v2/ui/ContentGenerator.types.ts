/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/ContentGenerator" {
    export default interface ContentGenerator {
        getKeyEnforcementEnabled: GetProperty<boolean>;
        setKeyEnforcementEnabled: SetProperty<boolean>;
        getGuidGenerationMode: GetProperty<GuidGenerationMode>;
        setGuidGenerationMode: SetProperty<GuidGenerationMode>;
        getMetadataLabelEnabled: GetProperty<boolean>;
        setMetadataLabelEnabled: SetProperty<boolean>;
        getInvisibleProperties: GetProperty<string[]>;
        setInvisibleProperties: SetProperty<string[]>;
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
    }
}

export type Operation = "Create" | "Read" | "Update" | "Delete";
export type GuidGenerationMode = "All" | "Key" | "NonKey" | "None";

export interface IPropertyLabel {
    name: string;
    label: string;
}