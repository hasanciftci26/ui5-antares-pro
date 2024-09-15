import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/odata/v2/Context";

export type SubmitEventHandler = (context: Context, dialog: Dialog) => Promise<void> | void;

export interface IBeforeSubmit {
    eventHandler: SubmitEventHandler;
    listener: object;
}

export interface ISubmitSuccess {
    eventHandler: SubmitEventHandler;
    listener: object;
}