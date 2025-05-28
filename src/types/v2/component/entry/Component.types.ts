/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/component/entry/Component" {
    export default interface Root {
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getInvisibleProperties: GetProperty<string[]>;
        setInvisibleProperties: SetProperty<string[]>;
    }
}