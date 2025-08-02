/* eslint-disable semi */
/* eslint-disable @typescript-eslint/naming-convention */
import Context from "sap/ui/model/odata/v2/Context";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/valuelist/ValueList" {
    export default interface ValidationLogic {
        /**
         * Returns the name of the local entity property that is bound to the value list.
         * This property must be of type Edm.String or Edm.Guid.
         * 
         * @returns The local data property name.
         */
        getLocalDataProperty: GetProperty<string>;

        /**
         * Sets the name of the local entity property that is bound to the value list.
         * This property must be of type Edm.String or Edm.Guid.
         * 
         * @param newValue The local data property name.
         */
        setLocalDataProperty: SetProperty<string>;

        /**
         * Returns whether search functionality is enabled for the value help dialog.
         * 
         * @returns True if search is supported; false otherwise.
         */
        getSearchSupported: GetProperty<boolean>;

        /**
         * Enables or disables search functionality in the value help dialog.
         * 
         * @param newValue True to enable search; false to disable.
         */
        setSearchSupported: SetProperty<boolean>;

        /**
         * Returns whether the search functionality is case-sensitive.
         * 
         * @returns True if search is case-sensitive; false otherwise.
         */
        getCaseSensitiveSearch: GetProperty<boolean>;

        /**
         * Sets whether the search functionality should be case-sensitive.
         * 
         * @param newValue True to enable case-sensitive search; false otherwise.
         */
        setCaseSensitiveSearch: SetProperty<boolean>;

        /**
         * Returns the title configured for the value help dialog.
         * 
         * @returns The dialog title.
         */
        getTitle: GetProperty<string>;

        /**
         * Sets a custom title for the value help dialog.
         * 
         * @param newValue The dialog title.
         */
        setTitle: SetProperty<string>;

        /**
         * Returns the error message that will be shown in the filter bar area
         * if there are issues with filter fields or the search input.
         * 
         * @returns The filter bar error message.
         */
        getFilterBarErrorMessage: GetProperty<string>;

        /**
         * Sets the error message that will be displayed in the filter bar area
         * when the filters or search input are invalid.
         * 
         * @param newValue The filter bar error message.
         */
        setFilterBarErrorMessage: SetProperty<string>;

        /**
         * Returns the path prefix used for internal model bindings.
         * **This is handled by the library and must not be used by the consumer.**
         * 
         * @returns The internal path prefix for bindings.
         * @internal
         */
        getPathPrefix: GetProperty<string>;

        /**
         * Sets the path prefix used for internal model bindings.
         * **This is handled by the library and must not be used by the consumer.**
         * 
         * @param newValue The internal path prefix.
         * @internal
         */
        setPathPrefix: SetProperty<string>;

        /**
         * Returns the current binding context of the local entity.
         * This context is used internally by the library to extract or assign values.
         * **This is handled by the library and must not be used by the consumer.**
         * 
         * @returns The binding context of the local entity.
         * @internal
         */
        getLocalDataContext: GetProperty<Context>;

        /**
         * Sets the binding context of the local entity.
         * This context is used internally by the library to extract or assign values.
         * **This is handled by the library and must not be used by the consumer.**
         * 
         * @param newValue The binding context.
         * @internal
         */
        setLocalDataContext: SetProperty<Context>;

        /**
         * Returns the list of available date range options, if configured.
         * These options define supported date filters in the value help dialog.
         * 
         * @returns Array of date range options or undefined.
         */
        getDateRangeOptions: GetProperty<string[] | undefined>;

        /**
         * Sets the list of available date range options.
         * These define the types of date ranges users can select in the dialog.
         * 
         * @param newValue Array of date range option strings or undefined.
         */
        setDateRangeOptions: SetProperty<string[] | undefined>;

        /**
         * Returns the list of parameters that define the mapping between
         * local and remote properties used in the value help dialog.
         * 
         * @returns Array of parameter mappings.
         */
        getParameters: GetProperty<Parameter[]>;

        /**
         * Sets the parameter mappings that define the relationship between
         * local and remote properties in the value help dialog.
         * 
         * @param newValue Array of parameter configurations.
         */
        setParameters: SetProperty<Parameter[]>;

        /**
         * Returns the list of explicitly defined labels for value list properties.
         * These override labels retrieved from metadata or generated by naming conventions.
         * 
         * @returns Array of custom property labels.
         */
        getPropertyLabels: GetProperty<PropertyLabel[]>;

        /**
         * Sets the custom labels for value list properties.
         * These labels override default or metadata-provided labels in the value help dialog.
         * 
         * @param newValue Array of property label definitions.
         */
        setPropertyLabels: SetProperty<PropertyLabel[]>;
    }
}

export interface Settings {
    /**
     * Name of the property from the local entity to which the value help will be attached.
     * This property must be of type Edm.String or Edm.Guid.
     */
    localDataProperty: string;

    /**
     * Name of the OData entity set that provides the source data for the value help dialog.
     */
    entitySet: string;

    /**
     * Optional flag to indicate whether the value help dialog should support search functionality.
     * If enabled, the user can search values using a search field.
     * Defaults to false if not provided.
     */
    searchSupported?: boolean;

    /**
     * Optional flag that controls whether search inputs should be case-sensitive.
     * If set to true, the search will differentiate between uppercase and lowercase characters.
     */
    caseSensitiveSearch?: boolean;

    /**
     * Optional title to be displayed at the top of the value help dialog.
     * If not provided, **entitySet** will be used with the prefix **Select:** (localized) which is automatically added by the SAPUI5 library.
     */
    title?: string;

    /**
     * Optional custom error message that will be displayed in the filter bar area
     * if validation fails or a filter input is invalid.
     */
    filterBarErrorMessage?: string;

    /**
     * Optional list of allowed date range options when filtering on date fields.
     * This enables consumers to restrict or configure available range options.
     */
    dateRangeOptions?: string[];

    /**
     * Array of Parameter objects that define the mapping between local and remote properties.
     * These parameters determine how data will be fetched and mapped between the local context
     * and the OData entity. Each parameter specifies how a field should be used during input, output, filtering,
     * or display in the value help dialog.
     */
    parameters: Parameter[];

    /**
     * Optional list of custom labels for the value help table columns.
     * 
     * By default, the library will attempt to retrieve labels from the metadata or generate
     * them from the property names. This array allows overriding those values explicitly.
     */
    propertyLabels?: PropertyLabel[];
}

export interface PropertyLabel {
    /**
     * The name of the value list property for which the label is being defined.
     */
    name: string;

    /**
     * The text to be used as the label in the value help dialog column.
     */
    label: string;
}

export type Parameter = {
    /**
     * Defines the role of this parameter in data exchange.
     * - "In": Sends a local value to the value list entity.
     * - "InOut": Sends a value and also expects a value back.
     * - "Out": Only receives data from the value list.
     */
    type: "In" | "InOut" | "Out";

    /**
     * Name of the property from the local entity.
     */
    localDataProperty: string;

    /**
     * Name of the corresponding property in the value list entity set.
     */
    valueListProperty: string;
} | {
    /**
     * Defines a display or filter-only field:
     * - "DisplayOnly": This field is shown in the dialog but not used for value mapping.
     * - "FilterOnly": This field is only used as a filter field in the filter bar.
     */
    type: "DisplayOnly" | "FilterOnly";

    /**
     * Name of the corresponding property in the value list entity set.
     */
    valueListProperty: string;
};