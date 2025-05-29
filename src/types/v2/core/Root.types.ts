/* eslint-disable semi */
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { FormType, GuidGenerationMode, IPropertyLabel } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";

declare module "ui5/antares/pro/v2/core/Root" {
    export default interface Root {
        getModelRef: GetProperty<string | ODataModel | undefined>;
        setModelRef: SetProperty<string | ODataModel | undefined>;
        getDeferredGroupId: GetProperty<string>;
        setDeferredGroupId: SetProperty<string>;
        getEntitySet: GetProperty<string>;
    }
}

export interface ISettings {
    controller: Controller;
    entitySet: string;
    modelRef?: string | ODataModel;
    deferredGroupId?: string;
    formType?: FormType;
    formTitle?: string;
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