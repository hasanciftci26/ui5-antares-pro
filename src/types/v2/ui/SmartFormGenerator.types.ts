/* eslint-disable semi */
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/SmartFormGenerator" {
    export default interface SmartFormGenerator {
        getForm: GetProperty<Control>;
        setForm: SetProperty<Control>;
    }
}