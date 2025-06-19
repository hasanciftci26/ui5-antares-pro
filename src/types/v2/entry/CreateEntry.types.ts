/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable semi */
import Event from "sap/ui/base/Event";
import Context from "sap/ui/model/odata/v2/Context";
import { AttachEvent, FireEvent, GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";

declare module "ui5/antares/pro/v2/entry/CreateEntry" {
    export default interface CreateEntry {
        getBeforeSubmit: GetProperty<BeforeSubmit | undefined>;
        setBeforeSubmit: SetProperty<BeforeSubmit>;

        attachSubmitSuccess: <T extends Record<string, any>>(
            handler: (event: CreateEntry$SubmitSuccessEvent<T>) => void,
            listener: object
        ) => void;

        fireSubmitSuccess: FireEvent<CreateEntry$SubmitSuccessEventParameters>;
        attachSubmitError: AttachEvent<CreateEntry$SubmitErrorEvent>;
        fireSubmitError: FireEvent<CreateEntry$SubmitErrorEventParameters>;
    }
}

export type BeforeSubmit = (context: Context) => boolean | Promise<boolean>;

export type CreateEntry$SubmitSuccessEventParameters<T extends Record<string, any> = Record<string, any>> = {
    submitted: boolean;
    data?: T;
    response?: Record<string, any>;
};

export type CreateEntry$SubmitSuccessEvent<T extends Record<string, any> = Record<string, any>> =
    Event<CreateEntry$SubmitSuccessEventParameters<T>, CreateEntry>;

export type CreateEntry$SubmitErrorEventParameters = {
    response?: Record<string, any>;
};

export type CreateEntry$SubmitErrorEvent = Event<CreateEntry$SubmitErrorEventParameters, CreateEntry>;