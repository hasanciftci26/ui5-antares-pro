/* eslint-disable semi */
import Dialog from "sap/m/Dialog";
import Event from "sap/ui/base/Event";
import { AttachEvent, FireEvent, GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";

declare module "ui5/antares/pro/v2/ui/DialogGenerator" {
    export default interface DialogGenerator {
        getDialog: GetProperty<Dialog>;
        setDialog: SetProperty<Dialog>;
        getOperation: GetProperty<Operation>;
        setOperation: SetProperty<Operation>;
        attachSubmitted: AttachEvent<DialogGenerator$SubmittedEvent>;
        fireSubmitted: FireEvent<DialogGenerator$SubmittedEventParameters>;
        attachClosed: AttachEvent<DialogGenerator$ClosedEvent>;
        fireClosed: FireEvent<DialogGenerator$ClosedEventParameters>;
    }
}

export interface ISettings {
    operation: Operation;
}

export type DialogGenerator$SubmittedEventParameters = {
    dialog: Dialog;
};

export type DialogGenerator$SubmittedEvent = Event<DialogGenerator$SubmittedEventParameters, DialogGenerator>;

export type DialogGenerator$ClosedEventParameters = {
    dialog: Dialog;
};

export type DialogGenerator$ClosedEvent = Event<DialogGenerator$ClosedEventParameters, DialogGenerator>;