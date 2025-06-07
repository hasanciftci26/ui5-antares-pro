/* eslint-disable semi */
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import Type from "sap/ui/model/Type";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/SimpleFormGenerator" {
    export default interface SimpleFormGenerator {
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getForm: GetProperty<SimpleForm>;
        setForm: SetProperty<SimpleForm>;
    }
}

export interface ISettings {
    entitySet: string;
}

export interface IBindingWithCustomType {
    path: string;
    type?: Type;
}

export interface IDateBinding {
    path: string;
    type: string;
    constraints: {
        displayFormat: "Date";
    };
    formatOptions?: {
        pattern: string;
    };
}

export interface IDateTimeBinding {
    path: string;
    type: string;
    formatOptions?: {
        pattern: string;
    };
}

export interface INumberBinding {
    path: string;
    type: string;
    constraints?: {
        precision?: number;
        scale?: number;
    };
    formatOptions?: {
        groupingEnabled?: boolean;
        groupingSeparator?: string;
        groupingSize?: number;
        decimalSeparator?: string;
    };
}