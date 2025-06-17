/* eslint-disable semi */
import Table from "sap/m/Table";
import VBox from "sap/m/VBox";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/ResponsiveTableGenerator" {
    export default interface ResponsiveTableGenerator {
        getContent: GetProperty<VBox>;
        setContent: SetProperty<VBox>;
        getTable: GetProperty<Table>;
        setTable: SetProperty<Table>;
    }
}