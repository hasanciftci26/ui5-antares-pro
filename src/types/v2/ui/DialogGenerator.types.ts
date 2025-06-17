/* eslint-disable semi */
import Dialog from "sap/m/Dialog";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/DialogGenerator" {
    export default interface DialogGenerator {
        getDialog: GetProperty<Dialog>;
        setDialog: SetProperty<Dialog>;
    }
}