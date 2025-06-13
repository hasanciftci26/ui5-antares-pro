/* eslint-disable semi */
import ResponsiveTable from "sap/m/Table";
import Context from "sap/ui/model/odata/v2/Context";
import GridTable from "sap/ui/table/Table";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/SimpleFormGenerator" {
    export default interface SimpleFormGenerator {
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getTable: GetProperty<TableType>;
        setTable: SetProperty<TableType>;
        getTableClass: GetProperty<TableClass>;
        setTableClass: SetProperty<TableClass>;
        getContext: GetProperty<Context>;
        setContext: SetProperty<Context>;
    }
}

export interface ISettings {
    entitySet: string;
    tableClass: TableClass;
}

export type TableClass = "sap.m.Table" | "sap.ui.table.Table";
export type TableType = ResponsiveTable | GridTable;