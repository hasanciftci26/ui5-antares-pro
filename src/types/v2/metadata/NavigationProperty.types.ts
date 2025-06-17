/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

declare module "ui5/antares/pro/v2/metadata/NavigationProperty" {
    export default interface NavigationProperty {
        getName: GetProperty<string>;
        setName: SetProperty<string>;
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getMultiplicity: GetProperty<string>;
        setMultiplicity: SetProperty<string>;
        getPropertySettings: GetProperty<PropertySettings[]>;
        setPropertySettings: SetProperty<PropertySettings[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
    }
}

export interface Settings {
    name: string;
    propertySettings?: PropertySettings[];
    propertyOrder?: string[];
}