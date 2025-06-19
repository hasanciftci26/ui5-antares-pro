/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/validation/ValidationLogic" {
    export default interface ValidationLogic {
        getPropertyName: GetProperty<string>;
        setPropertyName: SetProperty<string>;
    }
}