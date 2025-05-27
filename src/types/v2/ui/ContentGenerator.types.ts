/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/ContentGenerator" {
    export default interface ContentGenerator {
        getNavigationProperties: GetProperty<string[]>;
        setNavigationProperties: SetProperty<string[]>;
    }
}