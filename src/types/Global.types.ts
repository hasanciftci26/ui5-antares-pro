import Event from "sap/ui/base/Event";
import EventProvider from "sap/ui/base/EventProvider";
import ManagedObject, { AggregationBindingInfo } from "sap/ui/base/ManagedObject";

// Property Types for ManagedObject Classes
export type GetProperty<PropertyT> = () => PropertyT;
export type SetProperty<PropertyT> = (newValue: PropertyT) => void;

// Aggregation Types for ManagedObject Classes
export type BindAggregation = (aggregationInfo: AggregationBindingInfo) => void;
export type SetAggregation<AggregationT extends ManagedObject> = (aggregation: AggregationT) => void;
export type GetAggregation<AggregationT extends ManagedObject | ManagedObject[]> = () => AggregationT;
export type AddAggregation<AggregationT extends ManagedObject> = (aggregation: AggregationT) => void;
export type RemoveAggregation<AggregationT extends ManagedObject> = (reference: number | string | AggregationT) => void;
export type RemoveAllAggregation = () => void;
export type DestroyAggregation = () => void;

// Event Types for ManagedObject Classes
export type AttachEvent<EventT extends Event<object, EventProvider> = Event<object, EventProvider>> =
    (handler: (event: EventT) => void, listener: object) => void;

export type FireEvent<ParameterT extends object = object> = (parameters?: ParameterT) => void;

// Metadata Types for ManagedObject Classes
export interface IClassMetadata {
    library: "ui5.antares.pro";
    properties?: IClassMetadataProperty;
    defaultProperty?: string;
    aggregations?: IClassMetadataAggregation;
    defaultAggregation?: string;
    associations?: IClassMetadataAssociation;
    events?: IClassMetadataEvent;
    abstract?: boolean;
    final?: boolean;
    deprecated?: boolean;
}

export interface IComponentMetadata extends IClassMetadata {
    manifest: "json";
    interfaces?: string[];
}

export interface IClassMetadataProperty {
    [key: string]: {
        type: MetadataPropertyDataType;
        defaultValue?: any;
        visibility?: MetadataVisibility;
        deprecated?: boolean;
    };
}

export interface IClassMetadataAggregation {
    [key: string]: {
        type: string;
        bindable?: boolean | "bindable";
        visibility?: MetadataVisibility;
        deprecated?: boolean;
    } & ClassMetadataAggregationType;
}

export type ClassMetadataAggregationType = {
    multiple: false;
} | {
    multiple: true;
    singularName: string;
}

export interface IClassMetadataAssociation {
    [key: string]: {
        type: string;
        visibility?: MetadataVisibility;
        deprecated?: boolean;
    } & ClassMetadataAssociationType;
}

export type ClassMetadataAssociationType = {
    multiple: false;
} | {
    multiple: true;
    singularName: string;
}

export interface IClassMetadataEvent {
    [key: string]: {
        parameters?: {
            [key: string]: {
                type: MetadataPropertyDataType;
            };
        };
        allowPreventDefault?: boolean;
        deprecated?: boolean;
    };
}

export type MetadataPropertyDataType =
    "string" |
    "boolean" |
    "int" |
    "float" |
    "object" |
    "function" |
    "any" |
    "string[]" |
    "boolean[]" |
    "int[]" |
    "float[]" |
    "object[]" |
    "function[]" |
    "any[]";

export type MetadataVisibility = "hidden" | "public";