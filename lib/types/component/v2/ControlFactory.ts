import Control from "sap/ui/core/Control";
import { IEntityProperty } from "ui5/antares/pro/types/odata/v2/ODataMetadataReader";

export type FormType = "SmartForm" | "SimpleForm";
export type EntryType = "Create" | "Update" | "Delete" | "Display";

export interface IGuidBehaviour {
    generate: boolean;
    display: boolean;
    keys: boolean;
    properties: string[];
}

export interface IFormElement {
    control: Control;
    standard: boolean;
    property: IEntityProperty;
}