/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable semi */
import Event from "sap/ui/base/Event";
import Context from "sap/ui/model/odata/v2/Context";
import { AttachEvent, FireEvent, GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import DeleteEntry from "ui5/antares/pro/v2/entry/DeleteEntry";

declare module "ui5/antares/pro/v2/entry/DeleteEntry" {
    export default interface DeleteEntry {
        getBeforeDelete: GetProperty<BeforeDelete | undefined>;
        setBeforeDelete: SetProperty<BeforeDelete>;

        attachDeleteSuccess: <T extends Record<string, any>>(
            handler: (event: DeleteEntry$DeleteSuccessEvent<T>) => void,
            listener: object
        ) => void;

        fireDeleteSuccess: FireEvent<DeleteEntry$DeleteSuccessEventParameters>;
        attachDeleteError: AttachEvent<DeleteEntry$DeleteErrorEvent>;
        fireDeleteError: FireEvent<DeleteEntry$DeleteErrorEventParameters>;
    }
}

export type BeforeDelete = (context: Context) => boolean | Promise<boolean>;

export type DeleteEntry$DeleteSuccessEventParameters<T extends Record<string, any> = Record<string, any>> = {
    deleted: boolean;
    data?: T;
    response?: Record<string, any>;
};

export type DeleteEntry$DeleteSuccessEvent<T extends Record<string, any> = Record<string, any>> =
    Event<DeleteEntry$DeleteSuccessEventParameters<T>, DeleteEntry>;

export type DeleteEntry$DeleteErrorEventParameters = {
    response?: Record<string, any>;
};

export type DeleteEntry$DeleteErrorEvent = Event<DeleteEntry$DeleteErrorEventParameters, DeleteEntry>;