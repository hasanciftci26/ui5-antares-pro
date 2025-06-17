/* eslint-disable semi */
import Dialog from "sap/m/Dialog";
import Event from "sap/ui/base/Event";
import JSONModel from "sap/ui/model/json/JSONModel";
import { AttachEvent, FireEvent, GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";

declare module "ui5/antares/pro/v2/ui/DialogGenerator" {
    export default interface DialogGenerator {
        getDialogModel: GetProperty<JSONModel>;
        setDialogModel: SetProperty<JSONModel>;
        getDialog: GetProperty<Dialog>;
        setDialog: SetProperty<Dialog>;
        attachSubmitted: AttachEvent<DialogGenerator$SubmittedEvent>;
        fireSubmitted: FireEvent<DialogGenerator$SubmittedEventParameters>;
        attachClosed: AttachEvent<DialogGenerator$ClosedEvent>;
        fireClosed: FireEvent<DialogGenerator$ClosedEventParameters>;
    }
}

export interface Settings {
    dialogModel: JSONModel;
}

export type DialogGenerator$SubmittedEventParameters = {
    dialog: Dialog;
};

export type DialogGenerator$SubmittedEvent = Event<DialogGenerator$SubmittedEventParameters, DialogGenerator>;

export type DialogGenerator$ClosedEventParameters = {
    dialog: Dialog;
};

export type DialogGenerator$ClosedEvent = Event<DialogGenerator$ClosedEventParameters, DialogGenerator>;