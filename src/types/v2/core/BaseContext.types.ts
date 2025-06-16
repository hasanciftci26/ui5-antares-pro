/* eslint-disable semi */
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/core/BaseContext" {
    export default interface BaseContext {
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
}