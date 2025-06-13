/* eslint-disable semi */
import ResponsiveTable from "sap/m/Table";
import Context from "sap/ui/model/odata/v2/Context";
import GridTable from "sap/ui/table/Table";
import { GetProperty, MakeRequired, SetProperty } from "ui5/antares/pro/types/Global.types";
import { INavProperty } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";

declare module "ui5/antares/pro/v2/ui/TableGenerator" {
    export default interface TableGenerator {
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getTable: GetProperty<TableType>;
        setTable: SetProperty<TableType>;
        getTableTitle: GetProperty<string>;
        setTableTitle: SetProperty<string>;
        getFormTitle: GetProperty<string>;
        setFormTitle: SetProperty<string>;
        getCount: GetProperty<number>;
        setCount: SetProperty<number>;
        getNavProperty: GetProperty<MakeRequired<INavProperty, "tableClass">>;
        setNavProperty: SetProperty<MakeRequired<INavProperty, "tableClass">>;
        getContext: GetProperty<Context>;
        setContext: SetProperty<Context>;
    }
}

export interface ISettings {
    entitySet: string;
    navProperty: MakeRequired<INavProperty, "tableClass">;
}

export type TableClass = "sap.m.Table" | "sap.ui.table.Table";
export type TableType = ResponsiveTable | GridTable;