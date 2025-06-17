/* eslint-disable semi */
import Dialog from "sap/m/Dialog";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/DialogGenerator" {
    export default interface DialogGenerator {
        getModelName: GetProperty<string>;
        setModelName: SetProperty<string>;
        getDialog: GetProperty<Dialog>;
        setDialog: SetProperty<Dialog>;
    }
}

export interface Settings {
    modelName: string;
}