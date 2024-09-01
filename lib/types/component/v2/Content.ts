export type FormType = "SmartForm" | "SimpleForm";
export type EntryType = "Create" | "Update" | "Delete" | "Display";

export interface IGuidMode {
    generate: boolean;
    display: boolean;
    onlyForKeys: boolean;
}