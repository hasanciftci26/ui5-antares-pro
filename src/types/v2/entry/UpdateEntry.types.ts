/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable semi */
import Event from "sap/ui/base/Event";
import Context from "sap/ui/model/odata/v2/Context";
import { AttachEvent, FireEvent, GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";

declare module "ui5/antares/pro/v2/entry/UpdateEntry" {
    export default interface UpdateEntry {
        getBeforeSubmit: GetProperty<BeforeSubmit | undefined>;
        setBeforeSubmit: SetProperty<BeforeSubmit>;

        attachSubmitSuccess: <T extends Record<string, any>>(
            handler: (event: UpdateEntry$SubmitSuccessEvent<T>) => void,
            listener: object
        ) => void;

        fireSubmitSuccess: FireEvent<UpdateEntry$SubmitSuccessEventParameters>;
        attachSubmitError: AttachEvent<UpdateEntry$SubmitErrorEvent>;
        fireSubmitError: FireEvent<UpdateEntry$SubmitErrorEventParameters>;
    }
}

export type BeforeSubmit = (context: Context) => boolean | Promise<boolean>;

export type UpdateEntry$SubmitSuccessEventParameters<T extends Record<string, any> = Record<string, any>> = {
    submitted: boolean;
    data?: T;
    response?: Record<string, any>;
};

export type UpdateEntry$SubmitSuccessEvent<T extends Record<string, any> = Record<string, any>> =
    Event<UpdateEntry$SubmitSuccessEventParameters<T>, UpdateEntry>;

export type UpdateEntry$SubmitErrorEventParameters = {
    response?: Record<string, any>;
};

export type UpdateEntry$SubmitErrorEvent = Event<UpdateEntry$SubmitErrorEventParameters, UpdateEntry>;