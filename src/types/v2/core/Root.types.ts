/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { FormType, GuidMode, IDateTimeSettings, INumberSettings, IPropertyLabel } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

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
    submitButtonText?: string;
    submitButtonType?: ButtonType;
    closeButtonText?: string;
    closeButtonType?: ButtonType;
    keyEnforcementEnabled?: boolean;
    guidGenerationMode?: GuidMode;
    guidVisibilityMode?: GuidMode;
    metadataLabelEnabled?: boolean;
    dateTimeSettings?: IDateTimeSettings;
    numberSettings?: INumberSettings;
    excludedProperties?: string[];
    readonlyProperties?: string[];
    requiredProperties?: string[];
    propertyOrder?: string[];
    propertyLabels?: IPropertyLabel[];
    navProperties?: string[];
    valueLists?: ValueList[];
}