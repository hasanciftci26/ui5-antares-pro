/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/FormLayout" {
    export default interface FormLayout {
        getLayoutType: GetProperty<LayoutType>;
        setLayoutType: SetProperty<LayoutType>;
        getColumnsXL: GetProperty<number>;
        setColumnsXL: SetProperty<number>;
        getColumnsL: GetProperty<number>;
        setColumnsL: SetProperty<number>;
        getColumnsM: GetProperty<number>;
        setColumnsM: SetProperty<number>;
        getLabelSpanXL: GetProperty<number>;
        setLabelSpanXL: SetProperty<number>;
        getLabelSpanL: GetProperty<number>;
        setLabelSpanL: SetProperty<number>;
        getLabelSpanM: GetProperty<number>;
        setLabelSpanM: SetProperty<number>;
        getLabelSpanS: GetProperty<number>;
        setLabelSpanS: SetProperty<number>;
        getEmptySpanXL: GetProperty<number>;
        setEmptySpanXL: SetProperty<number>;
        getEmptySpanL: GetProperty<number>;
        setEmptySpanL: SetProperty<number>;
        getEmptySpanM: GetProperty<number>;
        setEmptySpanM: SetProperty<number>;
        getEmptySpanS: GetProperty<number>;
        setEmptySpanS: SetProperty<number>;
    }
}

export interface Settings {
    layoutType?: LayoutType;
    columnsXL?: number;
    columnsL?: number;
    columnsM?: number;
    labelSpanXL?: number;
    labelSpanL?: number;
    labelSpanM?: number;
    labelSpanS?: number;
    emptySpanXL?: number;
    emptySpanL?: number;
    emptySpanM?: number;
    emptySpanS?: number;
}

export type LayoutType = "ResponsiveGridLayout" | "ColumnLayout";