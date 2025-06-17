/* eslint-disable semi */
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/SmartFormGenerator" {
    export default interface SmartFormGenerator {
        getForm: GetProperty<SmartForm>;
        setForm: SetProperty<SmartForm>;
    }
}