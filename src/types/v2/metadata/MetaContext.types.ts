/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import ManagedObject from "sap/ui/base/ManagedObject";
import { Property } from "sap/ui/model/odata/ODataMetaModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { GuidMode, Operation, PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

declare module "ui5/antares/pro/v2/metadata/MetaContext" {
    export default interface MetaContext {
        getEntityProperties: GetProperty<EntityProperty[]>;
        setEntityProperties: SetProperty<EntityProperty[]>;
    }
}

export interface MetaContextOwner extends ManagedObject {
    getEntitySet: () => string;
    getOperation: () => Operation;
    getPropertySettings: () => PropertySettings[];
    getPropertyOrder: () => string[];
}

export interface EntityProperty {
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

export interface NavigationInfo {
    entitySet: string;
    multiplicity: Multiplicity;
}

export type MetaModelProperty = Property & {
    "com.sap.vocabularies.Common.v1.Label"?: {
        String: string;
    };
};

export type Multiplicity = "One" | "Many";
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