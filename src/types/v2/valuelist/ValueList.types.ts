/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/valuelist/ValueList" {
    export default interface ValueList {
        getLocalDataProperty: GetProperty<string>;
        setLocalDataProperty: SetProperty<string>;
        getCollectionPath: GetProperty<string>;
        getFixedValues: GetProperty<boolean>;
        setFixedValues: SetProperty<boolean>;
        getSearchSupported: GetProperty<boolean>;
        setSearchSupported: SetProperty<boolean>;
        getTitle: GetProperty<string>;
        setTitle: SetProperty<string>;
        getParameters: GetProperty<ValueListParameter[]>;
        setParameters: SetProperty<ValueListParameter[]>;
    }
}

export interface ISettings {
    localDataProperty: string;
    collectionPath: string;
    fixedValues?: boolean;
    searchSupported?: boolean;
    title?: string;
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