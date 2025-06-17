/* eslint-disable semi */
import Table from "sap/ui/table/Table";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/GridTableGenerator" {
    export default interface GridTableGenerator {
        getContent: GetProperty<Table>;
        setContent: SetProperty<Table>;
        getTable: GetProperty<Table>;
        setTable: SetProperty<Table>;
    }
}