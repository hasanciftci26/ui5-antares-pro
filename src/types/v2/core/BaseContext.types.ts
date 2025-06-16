/* eslint-disable semi */
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

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

export interface ISettings {
    controller: Controller;
    entitySet: string;
    modelRef?: string | ODataModel;
    resourceModelRef?: string | ResourceModel;
}