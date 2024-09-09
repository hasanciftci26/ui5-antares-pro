export type FormType = "SmartForm" | "SimpleForm";
export type EntryType = "Create" | "Update" | "Delete" | "Display";

export interface IGuidBehaviour {
    generate: boolean;
    display: boolean;
    keys: boolean;
    properties: string[];
}