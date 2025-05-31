/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable semi */
import { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { Property } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/metadata/MetaContext" {
    export default interface MetaContext {
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getEntitySetType: GetProperty<EntitySetType>;
        setEntitySetType: SetProperty<EntitySetType>;
        getNavProperty: GetProperty<INavProperty | undefined>;
        setNavProperty: SetProperty<INavProperty | undefined>;
        getProps: GetProperty<IProp[]>;
        setProps: SetProperty<IProp[]>;
    }
}

export interface ISettings extends $ManagedObjectSettings {
    entitySet: string;
    entitySetType: EntitySetType;
    navProperty?: INavProperty;
}

export interface INavProperty {
    name: string;
    multiplicity: AssociationMultiplicity;
}

export interface INavPropertyExtractionParams {
    model: ODataModel;
    entitySet: string;
    navProperties: string[];
}

export interface INavPropertyExtraction {
    name: string;
    entitySet: string;
    multiplicity: AssociationMultiplicity;
}

export type EntitySetType = "Parent" | "Child";
export type AssociationMultiplicity = "One" | "Many";

export interface IProp {
    key: boolean;
    name: string;
    type: EdmType;
    label: string;
    readonly: boolean;
    required: boolean;
    visible: boolean;
    displayFormat?: PropertyDisplayFormat;
    precision?: number;
    scale?: number;
    maxLength?: number;
}

export type MetaModelProperty = Property & {
    "com.sap.vocabularies.Common.v1.Label"?: {
        String: string;
    };
};

export type PropertyDisplayFormat = "Date" | "NonNegative" | "UpperCase";

export type EdmType =
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