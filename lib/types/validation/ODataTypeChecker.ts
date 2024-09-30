import { DisplayFormat, PropertyType } from "ui5/antares/pro/types/odata/v2/ODataMetadataReader";

export interface IPropertyDescriptor {
    name: string;
    type: PropertyType;
    value: string;
    maxLength?: string;
    precision?: string;
    scale?: string;
    displayFormat?: DisplayFormat;
}