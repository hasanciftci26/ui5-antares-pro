/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import Context from "sap/ui/model/odata/v2/Context";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/valuelist/ValueList" {
    export default interface ValidationLogic {
        getLocalDataProperty: GetProperty<string>;
        setLocalDataProperty: SetProperty<string>;
        getSearchSupported: GetProperty<boolean>;
        setSearchSupported: SetProperty<boolean>;
        getCaseSensitiveSearch: GetProperty<boolean>;
        setCaseSensitiveSearch: SetProperty<boolean>;
        getTitle: GetProperty<string>;
        setTitle: SetProperty<string>;
        getFilterBarErrorMessage: GetProperty<string>;
        setFilterBarErrorMessage: SetProperty<string>;
        getPathPrefix: GetProperty<string>;
        setPathPrefix: SetProperty<string>;
        getLocalDataContext: GetProperty<Context>;
        setLocalDataContext: SetProperty<Context>;
        getDateRangeOptions: GetProperty<string[] | undefined>;
        setDateRangeOptions: SetProperty<string[] | undefined>;
        getParameters: GetProperty<Parameter[]>;
        setParameters: SetProperty<Parameter[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getPropertyLabels: GetProperty<PropertyLabel[]>;
        setPropertyLabels: SetProperty<PropertyLabel[]>;
    }
}

export interface Settings {
    localDataProperty: string;
    entitySet: string;
    searchSupported?: boolean;
    caseSensitiveSearch?: boolean;
    title?: string;
    filterBarErrorMessage?: string;
    dateRangeOptions?: string[];
    parameters: Parameter[];
    propertyOrder?: string[];
    propertyLabels?: PropertyLabel[];
}

export interface PropertyLabel {
    name: string;
    label: string;
}

export type Parameter = {
    type: "In" | "InOut" | "Out";
    localDataProperty: string;
    valueListProperty: string;
} | {
    type: "DisplayOnly" | "FilterOnly";
    valueListProperty: string;
};