import { Property } from "sap/ui/model/odata/ODataMetaModel";

export type DisplayFormat = "Date" | "NonNegative" | "UpperCase";

export type PropertyType =
    "Edm.Binary" |
    "Edm.Boolean" |
    "Edm.Byte" |
    "Edm.DateTime" |
    "Edm.DateTimeOffset" |
    "Edm.Decimal" |
    "Edm.Double" |
    "Edm.Guid" |
    "Edm.Int16" |
    "Edm.Int32" |
    "Edm.Int64" |
    "Edm.SByte" |
    "Edm.Single" |
    "Edm.Stream" |
    "Edm.String" |
    "Edm.Time";

export interface IEntityProperty {
    key: boolean;
    name: string;
    type: PropertyType;
    label: string;
    bindingPathWithModel: string;
    bindingPathWithoutModel: string;
    nullable?: "true" | "false";
    readonly?: "true" | "false";
    precision?: string;
    scale?: string;
    displayFormat?: DisplayFormat;
    maxLength?: string;
}

export type PropertyVocabLabelExt = Property & {
    "com.sap.vocabularies.Common.v1.Label": {
        "String": string;
    };
}

export type PropertyMaxLengthExt = Property & {
    maxLength: string;
}