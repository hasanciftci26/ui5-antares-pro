/* eslint-disable semi */
import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { GuidGenerationMode, IPropertyLabel } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";

declare module "ui5/antares/pro/v2/core/Root" {
    export default interface Root {
        getModelRef: GetProperty<string | ODataModel | undefined>;
        setModelRef: SetProperty<string | ODataModel | undefined>;
        getEntitySet: GetProperty<string>;
    }
}

export interface ISettings extends $ManagedObjectSettings {
    controller: Controller;
    entitySet: string;
    modelRef?: string | ODataModel;
    keyEnforcementEnabled?: boolean;
    guidGenerationMode?: GuidGenerationMode;
    metadataLabelEnabled?: boolean;
    invisibleProperties?: string[];
    readonlyProperties?: string[];
    requiredProperties?: string[];
    propertyOrder?: string[];
    propertyLabels?: IPropertyLabel[];
    navProperties?: string[];
}