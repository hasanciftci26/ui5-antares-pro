/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { DateTimeSettings, FormType, GuidMode, NumberSettings, PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";

declare module "ui5/antares/pro/v2/core/BaseContext" {
    export default interface BaseContext {
        getController: GetProperty<Controller>;
        setController: SetProperty<Controller>;
        getModelRef: GetProperty<string | ODataModel | undefined>;
        setModelRef: SetProperty<string | ODataModel | undefined>;
        getResourceModelRef: GetProperty<string | ResourceModel | undefined>;
        setResourceModelRef: SetProperty<string | ResourceModel | undefined>;
        getDeferredGroupId: GetProperty<string>;
        setDeferredGroupId: SetProperty<string>;
    }
}

export interface Settings {
    controller: Controller;
    entitySet: string;
    modelRef?: string | ODataModel;
    resourceModelRef?: string | ResourceModel;
    deferredGroupId?: string;
    formType?: FormType;
    formTitle?: string;
    submitButtonText?: string;
    submitButtonType?: ButtonType;
    closeButtonText?: string;
    closeButtonType?: ButtonType;
    keyEnforcementEnabled?: boolean;
    metadataLabelEnabled?: boolean;
    guidGenerationMode?: GuidMode;
    guidVisibilityMode?: GuidMode;
    dateTimeSettings?: DateTimeSettings;
    numberSettings?: NumberSettings;
    propertySettings?: PropertySettings[];
    propertyOrder?: string[];
    navigationProperties?: NavigationProperty[];
}