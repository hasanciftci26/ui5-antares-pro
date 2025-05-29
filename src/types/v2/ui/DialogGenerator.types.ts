/* eslint-disable semi */
import Dialog from "sap/m/Dialog";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";

declare module "ui5/antares/pro/v2/ui/DialogGenerator" {
    export default interface DialogGenerator {
        getDialog: GetProperty<Dialog>;
        setDialog: SetProperty<Dialog>;
        getOperation: GetProperty<Operation>;
        setOperation: SetProperty<Operation>;
    }
}

export interface ISettings {
    operation: Operation;
}