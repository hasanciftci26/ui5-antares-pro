/* eslint-disable semi */
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/SimpleFormGenerator" {
    export default interface SimpleFormGenerator {
        getForm: GetProperty<SimpleForm>;
        setForm: SetProperty<SimpleForm>;
    }
}