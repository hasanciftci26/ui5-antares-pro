/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/valuelist/ValueList" {
    export default interface ValidationLogic {
        getLocalDataProperty: GetProperty<string>;
        setLocalDataProperty: SetProperty<string>;
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getPropertyLabels: GetProperty<PropertyLabels[]>;
        setPropertyLabels: SetProperty<PropertyLabels[]>;
    }
}

export interface PropertyLabels {
    name: string;
    label: string;
}