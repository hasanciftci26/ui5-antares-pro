/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/valuelist/ValueList" {
    export default interface ValueList {
        getLocalDataProperty: GetProperty<string>;
        setLocalDataProperty: SetProperty<string>;
        getCollectionPath: GetProperty<string>;
        getFixedValues: GetProperty<boolean>;
        setFixedValues: SetProperty<boolean>;
        getFixedValueSeparator: GetProperty<string>;
        setFixedValueSeparator: SetProperty<string>;
        getSearchSupported: GetProperty<boolean>;
        setSearchSupported: SetProperty<boolean>;
        getCaseSensitiveSearch: GetProperty<boolean>;
        setCaseSensitiveSearch: SetProperty<boolean>;
        getTitle: GetProperty<string>;
        setTitle: SetProperty<string>;
        getFilterBarErrorMessage: GetProperty<string>;
        setFilterBarErrorMessage: SetProperty<string>;
        getDateRangeOptions: GetProperty<string[] | undefined>;
        setDateRangeOptions: SetProperty<string[] | undefined>;
        getParameters: GetProperty<ValueListParameter[]>;
        setParameters: SetProperty<ValueListParameter[]>;
        getUseChildContext: GetProperty<boolean>;
        setUseChildContext: SetProperty<boolean>;        
    }
}

export interface ISettings {
    localDataProperty: string;
    collectionPath: string;
    fixedValues?: boolean;
    fixedValueSeparator?: string;
    searchSupported?: boolean;
    caseSensitiveSearch?: boolean;
    title?: string;
    filterBarErrorMessage?: string;
    dateRangeOptions?: string[];
    parameters: ValueListParameter[];
}

export type ValueListParameter = {
    type: "In" | "InOut" | "Out";
    localDataProperty: string;
    valueListProperty: string;
} | {
    type: "DisplayOnly" | "FilterOnly";
    valueListProperty: string;
};