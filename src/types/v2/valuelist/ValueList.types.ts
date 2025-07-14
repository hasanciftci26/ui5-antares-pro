/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/valuelist/ValueList" {
    export default interface ValidationLogic {
        getLocalDataProperty: GetProperty<string>;
        setLocalDataProperty: SetProperty<string>;
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
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
        getParameters: GetProperty<Parameter[]>;
        setParameters: SetProperty<Parameter[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getPropertyLabels: GetProperty<PropertyLabels[]>;
        setPropertyLabels: SetProperty<PropertyLabels[]>;
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
    propertyLabels?: string[];
}

export interface PropertyLabels {
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