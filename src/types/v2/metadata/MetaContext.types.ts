/* eslint-disable semi */
import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/metadata/MetaContext" {
    export default interface MetaContext {
        getPrimary: GetProperty<boolean>;
        setPrimary: SetProperty<boolean>;
    }
}

export interface ISettings extends $ManagedObjectSettings {
    primary: boolean;
}