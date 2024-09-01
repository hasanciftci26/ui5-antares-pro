import Dialog from "sap/m/Dialog";
import Context from "sap/ui/model/odata/v2/Context";

export interface IBeforeSubmit {
    eventHandler: (context: Context, dialog: Dialog) => void;
    listener: object; 
}

export interface ISubmitSuccess {
    eventHandler: () => void;
    listener: object; 
}