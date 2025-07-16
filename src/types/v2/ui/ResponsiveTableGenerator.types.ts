/* eslint-disable semi */
import Table from "sap/m/Table";
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/ResponsiveTableGenerator" {
    export default interface ResponsiveTableGenerator {
        getContent: GetProperty<Control>;
        setContent: SetProperty<Control>;
        getTable: GetProperty<Table>;
        setTable: SetProperty<Table>;
    }
}