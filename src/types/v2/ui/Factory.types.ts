/* eslint-disable semi */
import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import { ButtonType } from "sap/m/library";
import VBox from "sap/m/VBox";
import LayoutData from "sap/ui/core/LayoutData";
import Grid from "sap/ui/layout/Grid";
import HorizontalLayout from "sap/ui/layout/HorizontalLayout";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import Context from "sap/ui/model/odata/v2/Context";
import {
    AddAggregation,
    DestroyAggregation,
    GetAggregation,
    GetProperty,
    RemoveAggregation,
    RemoveAllAggregation,
    SetAggregation,
    SetProperty
} from "ui5/antares/pro/types/Global.types";
import CustomContent from "ui5/antares/pro/v2/custom/CustomContent";
import CustomElement from "ui5/antares/pro/v2/custom/CustomElement";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/ui/Factory" {
    export default interface Factory {
        /**
         * Returns the [sap.ui.model.odata.v2.Context](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.Context) 
         * instance used by the library to manage CRUD operations.
         *
         * This context instance is generated internally by the library.
         *
         * **Note to consumers:** This method is intended for internal use only and **must not** be called directly.
         *
         * @returns The current OData context instance.
         *
         * @internal
         */
        getContext: GetProperty<Context>;

        /**
         * Sets the [sap.ui.model.odata.v2.Context](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.Context) 
         * instance used by the library to manage CRUD operations.
         *
         * This method is used internally to assign the context to the library instance.
         *
         * **Note to consumers:** This method is intended for internal use only and **must not** be called directly.
         *
         * @param newValue The OData context instance to set.
         *
         * @internal
         */
        setContext: SetProperty<Context>;

        /**
         * Returns the index position of the generated form within the containing dialog or component.
         * 
         * This property determines the insertion position of the form. By default, the form is inserted as the first element.
         * The index can be negative as well.
         * Consumers can use this to insert custom content (e.g., a navigation form or table) before the generated form.
         * 
         * @returns The index position or **undefined** if not set.
         */
        getIndex: GetProperty<number | undefined>;

        /**
         * Sets the index position of the generated form within the containing dialog or component.
         * 
         * This property determines the insertion position of the form. By default, the form is inserted as the first element.
         * The index can be negative as well.
         * Consumers can use this to insert custom content (e.g., a navigation form or table) before the generated form.
         * 
         * @param newValue The index position or **undefined** to reset to default.
         */
        setIndex: SetProperty<number | undefined>;

        /**
         * Returns the dialog title.
         * 
         * If a custom title has been set by the consumer, it is returned.
         * Otherwise, the library returns a localized default title based on the current operation (create, update, delete, or read).
         * 
         * @returns The dialog title string.
         */
        getDialogTitle: GetProperty<string>;

        /**
         * Sets a custom title for the generated dialog.
         * 
         * This overrides the library's default localized title based on the operation.
         * 
         * @param newValue The custom dialog title.
         */
        setDialogTitle: SetProperty<string>;

        /**
         * Returns the type of form generated for the specified EntitySet.
         * 
         * By default, the library generates a **SmartForm**.
         * If set by the consumer, this property allows switching to a **SimpleForm**.
         * 
         * @returns The form type, either "SmartForm" or "SimpleForm".
         */
        getFormType: GetProperty<FormType>;

        /**
         * Sets the type of form to generate for the specified EntitySet.
         * 
         * Use this property to override the default **SmartForm** with **SimpleForm** if desired.
         * 
         * @param newValue The form type to set ("SmartForm" or "SimpleForm").
         */
        setFormType: SetProperty<FormType>;

        /**
         * Returns the title displayed above the generated form.
         * 
         * By default, no title is set. This property allows the consumer to define a custom form title.
         * 
         * @returns The custom form title, or undefined if not set.
         */
        getFormTitle: GetProperty<string | undefined>;

        /**
         * Sets the title displayed above the generated form.
         * 
         * Use this property to provide a custom title for the form.
         * 
         * @param newValue The custom form title to set, or undefined to remove the title.
         */
        setFormTitle: SetProperty<string | undefined>;

        /**
         * Returns the text displayed on the submit button within the generated dialog.
         * 
         * If not set, the library provides a default localized text based on the current language.
         * This property allows the consumer to override the button text.
         * 
         * Note: The submit button is not generated when using the **DisplayEntry** class.
         * 
         * @returns The custom submit button text, or the library-generated default if not set.
         */
        getSubmitButtonText: GetProperty<string>;

        /**
         * Sets the text displayed on the submit button within the generated dialog.
         * 
         * Use this property to override the default localized submit button text.
         * 
         * Note: The submit button is not generated when using the **DisplayEntry** class.
         * 
         * @param newValue The custom submit button text to set.
         */
        setSubmitButtonText: SetProperty<string>;

        /**
         * Returns the [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the submit button in the generated dialog.
         * 
         * Defaults to **Emphasized** if not set. This property allows the consumer to configure a different button type.
         * 
         * Note: The submit button is not generated when using the **DisplayEntry** class.
         * 
         * @returns The configured submit button type, or the default **Emphasized** if not set.
         */
        getSubmitButtonType: GetProperty<ButtonType>;

        /**
         * Sets the [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the submit button in the generated dialog.
         * 
         * Use this property to configure a button type different from the default **Emphasized**.
         * 
         * Note: The submit button is not generated when using the **DisplayEntry** class.
         * 
         * @param newValue The button type to set for the submit button.
         */
        setSubmitButtonType: SetProperty<ButtonType>;

        /**
         * Returns the text displayed on the close button within the generated dialog.
         * 
         * If no custom text is set, a default localized text based on the current language is returned.
         * This property allows the consumer to override the default button text.
         * 
         * @returns The close button text, either custom set or the default localized value.
         */
        getCloseButtonText: GetProperty<string>;

        /**
         * Sets the text displayed on the close button within the generated dialog.
         * 
         * Use this property to override the default localized button text.
         * 
         * @param newValue The text to set for the close button.
         */
        setCloseButtonText: SetProperty<string>;

        /**
         * Returns the [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the close button in the generated dialog.
         * 
         * If not set, the default value **Default** is returned.
         * This property allows the consumer to configure a different button type.
         * 
         * @returns The button type of the close button, either custom set or the default value.
         */
        getCloseButtonType: GetProperty<ButtonType>;

        /**
         * Sets the [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the close button in the generated dialog.
         * 
         * Use this property to override the default button type (**Default**).
         * 
         * @param newValue The button type to set for the close button.
         */
        setCloseButtonType: SetProperty<ButtonType>;

        /**
         * Returns whether enforcement of key properties in the generated form is enabled.
         * 
         * When **true** (default), all key properties are included in the form and positioned at the top.
         * If set to **false**, key properties can be excluded or reordered by the consumer.
         * 
         * @returns A boolean indicating if key enforcement is enabled.
         */
        getKeyEnforcementEnabled: GetProperty<boolean>;

        /**
         * Sets whether enforcement of key properties in the generated form is enabled.
         * 
         * Use **true** to include all key properties and position them at the top (default).
         * Use **false** to allow key properties to be excluded or reordered.
         * 
         * @param newValue The boolean value to enable or disable key enforcement.
         */
        setKeyEnforcementEnabled: SetProperty<boolean>;

        /**
         * Returns whether label generation based on OData metadata is enabled.
         * 
         * When **true**, the library tries to extract labels from the **sap:label** extension
         * or the **@com.sap.vocabularies.Common.v1.Label** annotation for each property.
         * If neither is available, a label is generated from the property's naming convention.
         * 
         * @returns A boolean indicating if metadata-based label generation is enabled.
         */
        getMetadataLabelEnabled: GetProperty<boolean>;

        /**
         * Sets whether label generation based on OData metadata is enabled.
         * 
         * Use **true** to enable extracting labels from OData metadata or fallback to naming convention.
         * Use **false** to disable this behavior.
         * 
         * @param newValue The boolean value to enable or disable metadata label generation.
         */
        setMetadataLabelEnabled: SetProperty<boolean>;

        /**
         * Returns the current mode for GUID generation used by the library for **Edm.Guid** properties.
         * 
         * Supported modes:
         * - **All**: Generates GUIDs for all **Edm.Guid** properties.
         * - **Key**: Generates GUIDs only for key properties with **Edm.Guid** type.
         * - **NonKey**: Generates GUIDs only for non-key **Edm.Guid** properties.
         * - **None**: Disables GUID generation entirely.
         * 
         * @returns The current GUID generation mode.
         */
        getGuidGenerationMode: GetProperty<GuidMode>;

        /**
         * Sets the mode controlling how the library generates GUID values for **Edm.Guid** properties.
         * 
         * Use one of the following modes:
         * - **All**: Generate GUIDs for all **Edm.Guid** properties.
         * - **Key**: Generate GUIDs only for key **Edm.Guid** properties.
         * - **NonKey**: Generate GUIDs only for non-key **Edm.Guid** properties.
         * - **None**: Disable GUID generation.
         * 
         * @param newValue The GUID generation mode to set.
         */
        setGuidGenerationMode: SetProperty<GuidMode>;

        /**
         * Returns the current visibility mode for **Edm.Guid** properties in the generated form.
         * 
         * Supported modes:
         * - **All**: Displays all **Edm.Guid** properties.
         * - **Key**: Displays only key **Edm.Guid** properties.
         * - **NonKey**: Displays only non-key **Edm.Guid** properties.
         * - **None**: Hides all **Edm.Guid** properties.
         * 
         * @returns The current GUID visibility mode.
         */
        getGuidVisibilityMode: GetProperty<GuidMode>;

        /**
         * Sets the visibility mode for **Edm.Guid** properties in the generated form.
         * 
         * Use one of the following modes:
         * - **All**: Display all **Edm.Guid** properties.
         * - **Key**: Display only key **Edm.Guid** properties.
         * - **NonKey**: Display only non-key **Edm.Guid** properties.
         * - **None**: Hide all **Edm.Guid** properties.
         * 
         * @param newValue The GUID visibility mode to set.
         */
        setGuidVisibilityMode: SetProperty<GuidMode>;

        /**
         * Returns the error message displayed in an error **MessageBox** when entity validation fails upon submission.
         * 
         * If a custom message is not set, the library-generated default message is returned.
         * 
         * @returns The validation error message.
         */
        getValidationErrorMessage: GetProperty<string>;

        /**
         * Sets a custom error message to be displayed in an error **MessageBox** when entity validation fails upon submission.
         * 
         * Use this property to override the default library message.
         * 
         * @param newValue The custom validation error message to set.
         */
        setValidationErrorMessage: SetProperty<string>;

        /**
         * Returns the error message displayed in an error **MessageBox** when an operation (update, delete, or display)
         * is attempted on a one-to-many navigation property's generated table without selecting a row,
         * or when the **run** method of update (UpdateEntry), delete (DeleteEntry), 
         * or read (DisplayEntry) operations is called with a table ID but no row is selected.
         * 
         * If a custom message is not set, the library-generated default message is returned.
         * 
         * @returns The select-row error message.
         */
        getSelectRowError: GetProperty<string>;

        /**
         * Sets a custom error message to be displayed in an error **MessageBox** when an operation (update, delete, or display)
         * is attempted on a one-to-many navigation property's generated table without selecting a row,
         * or when the **run** method of update (UpdateEntry), delete (DeleteEntry), 
         * or read (DisplayEntry) operations is called with a table ID but no row is selected.
         * 
         * Use this property to override the default library message.
         * 
         * @param newValue The custom select-row error message to set.
         */
        setSelectRowError: SetProperty<string>;

        /**
         * Returns whether an error **MessageBox** is displayed when an error occurs during entity submission.
         * When enabled (**default**), an error message extracted from the OData response is shown if available; 
         * otherwise, a default localized message is returned and displayed.
         * If disabled, the error **MessageBox** is suppressed.
         * 
         * @returns Boolean indicating if the error **MessageBox** is shown on submission error.
         */
        getShowErrorMessageBox: GetProperty<boolean>;

        /**
         * Sets whether an error **MessageBox** should be displayed when an error occurs during entity submission.
         * Set to **false** to suppress the error **MessageBox**, useful for custom error handling scenarios.
         * When enabled (**default**), the library extracts and shows an error message from the OData response if available.
         * 
         * @param newValue New boolean value to enable or disable the error **MessageBox** display.
         */
        setShowErrorMessageBox: SetProperty<boolean>;

        /**
         * Returns whether all **Edm.Boolean** properties are automatically initialized with **false** 
         * when creating a new entity and no explicit value is provided via the **run()** method or the **inheritValues** parameter.
         * When disabled, these properties are initialized as **null** instead.
         * 
         * @returns Boolean indicating if **Edm.Boolean** properties default to **false** on entity creation.
         */
        getBooleanFalseByDefault: GetProperty<boolean>;

        /**
         * Sets whether all **Edm.Boolean** properties should be automatically initialized with **false** 
         * when creating a new entity and no explicit value is provided via the **run()** method or the **inheritValues** parameter.
         * Set to **false** to initialize such properties as **null** instead.
         * 
         * @param newValue New boolean value to enable or disable default initialization to **false**.
         */
        setBooleanFalseByDefault: SetProperty<boolean>;

        /**
         * Returns whether the generated dialog will automatically close after a successful entity submission.
         * This behavior is enabled by default.
         * 
         * @returns Boolean indicating if the dialog closes automatically on success.
         */
        getAutoCloseOnSuccess: GetProperty<boolean>;

        /**
         * Sets whether the generated dialog should automatically close after a successful entity submission.
         * Set to **false** to prevent automatic closing, for example when custom content processing is needed.
         * 
         * @param newValue New boolean value to enable or disable automatic dialog closing on success.
         */
        setAutoCloseOnSuccess: SetProperty<boolean>;

        /**
         * Returns the configuration settings for date, time, and date-time controls used by the library.
         * These settings define custom formatting patterns for controls based on OData types,
         * allowing overriding of default locale-based formats. The patterns must follow the Unicode LDML standard.
         * 
         * @returns The current DateTimeSettings object or undefined if not set.
         */
        getDateTimeSettings: GetProperty<DateTimeSettings | undefined>;

        /**
         * Sets the configuration settings for date, time, and date-time controls used by the library.
         * Consumers can provide custom formatting patterns for the respective controls, which must conform to Unicode LDML.
         * 
         * @param newValue The new DateTimeSettings object or undefined to reset the configuration.
         */
        setDateTimeSettings: SetProperty<DateTimeSettings | undefined>;

        /**
         * Returns the configuration settings for numeric formatting used in input controls for number fields.
         * These settings allow overriding the default locale-based formatting, including decimal and grouping separators.
         * 
         * @returns The current NumberSettings object or undefined if not set.
         */
        getNumberSettings: GetProperty<NumberSettings | undefined>;

        /**
         * Sets the configuration settings for numeric formatting used in input controls for number fields.
         * Consumers can specify custom decimal separator, grouping separator, grouping size, and enable/disable grouping.
         * 
         * @param newValue The new NumberSettings object or undefined to reset the configuration.
         */
        setNumberSettings: SetProperty<NumberSettings | undefined>;

        /**
         * Returns the custom layout wrapper used for placing generated content such as forms, tables, and custom controls.
         * By default, content is wrapped in a Dialog (Dialog mode) or VBox (Component mode).
         * This property allows consumers to override the default wrapper with a custom layout (e.g., GridLayout, HorizontalLayout, FlexBox).
         * 
         * @returns The current ContentWrapper instance or undefined if the default wrapper is used.
         */
        getContentWrapper: GetProperty<ContentWrapper | undefined>;

        /**
         * Sets a custom layout wrapper to be used for placing generated content such as forms, tables, and custom controls.
         * This overrides the default wrapper (Dialog or VBox) allowing customized presentation.
         * 
         * @param newValue The ContentWrapper instance to use or undefined to revert to the default wrapper.
         */
        setContentWrapper: SetProperty<ContentWrapper | undefined>;

        /**
         * Returns the entity-specific configuration array for individual properties of the specified entitySet.
         * This allows consumers to define property-level behaviors 
         * such as marking fields as required, readonly, or excluded from generated forms or tables.
         * 
         * @returns An array of PropertySettings defining behaviors for individual properties.
         */
        getPropertySettings: GetProperty<PropertySettings[]>;

        /**
         * Sets the entity-specific configuration for individual properties of the specified entitySet.
         * Use this to customize property-level behaviors like required, readonly, or exclusion from generated forms or tables.
         * 
         * @param newValue An array of PropertySettings to apply to individual properties.
         */
        setPropertySettings: SetProperty<PropertySettings[]>;

        /**
         * Returns the custom order for displaying properties in the generated form.
         * By default, properties are rendered in metadata order.
         * If not set by the consumer, this method returns an empty array.
         * This array defines a different sequence by listing property names.
         * 
         * Note: If **keyEnforcementEnabled** is **true**, key properties are always shown first regardless of this order.
         * 
         * @returns An array of property names defining the display sequence in the form, or an empty array if not set.
         */
        getPropertyOrder: GetProperty<string[]>;

        /**
         * Sets the custom order for displaying properties in the generated form.
         * Use this to specify a sequence of property names different from the default metadata order.
         * 
         * Note: If **keyEnforcementEnabled** is **true**, key properties remain first regardless of this order.
         * 
         * @param newValue An array of property names defining the display sequence.
         */
        setPropertyOrder: SetProperty<string[]>;

        /**
         * Adds a navigation property to the **navigationProperties** aggregation.
         *
         * This method registers a new navigation property (association) to be included
         * when generating the dialog or component.
         *
         * The provided **aggregation** must be an instance of **ui5.antares.pro.v2.metadata.NavigationProperty**.
         * It defines whether the associated target entity will be rendered as a form (**1:1**)
         * or a table (**1:N**), based on its cardinality.
         *
         * @param aggregation The **NavigationProperty** instance to add.
         */
        addNavigationProperty: AddAggregation<NavigationProperty>;

        /**
         * Removes a specific navigation property from the **navigationProperties** aggregation.
         *
         * You can remove the navigation property by passing its index, ID, or object reference.
         * Once removed, it will no longer be used in dialog or component generation.
         *
         * @param aggregation The navigation property to remove (by index, ID, or instance).
         */
        removeNavigationProperty: RemoveAggregation<NavigationProperty>;

        /**
         * Retrieves all navigation properties in the **navigationProperties** aggregation.
         *
         * These are used to generate additional UI elements (forms or tables) depending
         * on the type and cardinality of each navigation association.
         *
         * @returns An array of **NavigationProperty** instances currently aggregated.
         */
        getNavigationProperties: GetAggregation<NavigationProperty[]>;

        /**
         * Removes all navigation properties from the **navigationProperties** aggregation.
         *
         * This will reset the aggregation, meaning no associated entities will be rendered
         * in the generated dialog or component.
         */
        removeAllNavigationProperties: RemoveAllAggregation;

        /**
         * Destroys all navigation properties in the **navigationProperties** aggregation.
         *
         * This method completely removes all associated **NavigationProperty** instances
         * and releases any resources they hold. After destruction, no additional forms
         * or tables will be generated for associated entities.
         */
        destroyNavigationProperties: DestroyAggregation;

        /**
         * Adds a validation logic to the **validationLogics** aggregation.
         *
         * This method registers a new validation rule to be executed before the submission
         * of an entity. Use this to enforce custom data consistency checks beyond built-in validation.
         *
         * The provided **aggregation** must be an instance of **ui5.antares.pro.v2.validation.ValidationLogic**,
         * with its logic fully configured in its constructor.
         *
         * @param aggregation The **ValidationLogic** instance to add.
         */
        addValidationLogic: AddAggregation<ValidationLogic>;

        /**
         * Removes a specific validation logic from the **validationLogics** aggregation.
         *
         * You can remove the validation logic by passing its index, ID, or object reference.
         * Removed logic will no longer be executed during entity validation.
         *
         * @param aggregation The validation logic to remove (by index, ID, or instance).
         */
        removeValidationLogic: RemoveAggregation<ValidationLogic>;

        /**
         * Retrieves all validation logic instances in the **validationLogics** aggregation.
         *
         * These define custom validation rules that are applied before the submission of an entity.
         *
         * @returns An array of **ValidationLogic** instances currently aggregated.
         */
        getValidationLogics: GetAggregation<ValidationLogic[]>;

        /**
         * Removes all validation logic instances from the **validationLogics** aggregation.
         *
         * This disables all custom validation rules previously configured on the entity.
         */
        removeAllValidationLogics: RemoveAllAggregation;

        /**
         * Destroys all validation logic instances in the **validationLogics** aggregation.
         *
         * This method permanently deletes all custom validation rules and frees up any
         * resources associated with them. After destruction, no validation logic will run before submission.
         */
        destroyValidationLogics: DestroyAggregation;

        /**
         * Adds a value list definition to the **valueLists** aggregation.
         *
         * Use this method to register a new **ValueList** instance that defines value help
         * behavior for a property of type **Edm.String** or **Edm.Guid**.
         *
         * The provided **aggregation** must be an instance of **ui5.antares.pro.v2.valuelist.ValueList**,
         * which should include configuration such as the **EntitySet** and displayed properties.
         *
         * @param aggregation The **ValueList** instance to add.
         */
        addValueList: AddAggregation<ValueList>;

        /**
         * Removes a specific value list definition from the **valueLists** aggregation.
         *
         * You can remove the value list by passing its index, ID, or object reference.
         * Once removed, the corresponding property will no longer have value help support.
         *
         * @param aggregation The value list to remove (by index, ID, or instance).
         */
        removeValueList: RemoveAggregation<ValueList>;

        /**
         * Retrieves all value list definitions in the **valueLists** aggregation.
         *
         * These instances define the value help logic for properties of type **Edm.String** or **Edm.Guid**,
         * including data source and visible fields.
         *
         * @returns An array of **ValueList** instances currently aggregated.
         */
        getValueLists: GetAggregation<ValueList[]>;

        /**
         * Removes all value list definitions from the **valueLists** aggregation.
         *
         * This clears all configured value helps, disabling value help dialogs
         * for all properties that previously had one.
         */
        removeAllValueLists: RemoveAllAggregation;

        /**
         * Destroys all value list definitions in the **valueLists** aggregation.
         *
         * This permanently deletes all configured **ValueList** instances and
         * releases their resources. No value help dialogs will be available after destruction.
         */
        destroyValueLists: DestroyAggregation;

        /**
         * Retrieves the current form layout from the **formLayout** property.
         *
         * The form layout defines the visual structure of the generated form.
         * If not explicitly set, a default layout is used.
         *
         * @returns The current **ui5.antares.pro.v2.ui.FormLayout** instance, if defined.
         */
        getFormLayout: GetAggregation<FormLayout>;

        /**
         * Sets a custom form layout to the **formLayout** property.
         *
         * Use this to override the default form layout with a specific **ui5.antares.pro.v2.ui.FormLayout** instance,
         * enabling a custom structure for the generated form inside the dialog or component.
         *
         * @param newValue The **ui5.antares.pro.v2.ui.FormLayout** instance to set.
         */
        setFormLayout: SetAggregation<FormLayout>;

        /**
         * Retrieves all custom control definitions in the **customElements** aggregation.
         *
         * These definitions override the default metadata-driven controls for specific properties.
         * For example, a consumer can provide a **CustomElement** to use a **Slider** instead of an **Input**.
         *
         * @returns An array of **CustomElement** instances currently aggregated.
         */
        getCustomElements: GetAggregation<CustomElement[]>;

        /**
         * Removes a specific custom control definition from the **customElements** aggregation.
         *
         * You can remove a custom element by passing its index, ID, or object reference.
         * Once removed, the default control generation will be restored for the corresponding property.
         *
         * @param aggregation The custom element to remove (by index, ID, or instance).
         */
        removeCustomElement: RemoveAggregation<CustomElement>;

        /**
         * Removes all custom control definitions from the **customElements** aggregation.
         *
         * This resets the control generation behavior to rely solely on metadata.
         * All previously customized properties will use the default controls again.
         */
        removeAllCustomElements: RemoveAllAggregation;

        /**
         * Destroys all custom control definitions in the **customElements** aggregation.
         *
         * This permanently deletes all **CustomElement** instances and frees up their associated resources.
         * The default metadata-based controls will be used for all properties afterward.
         */
        destroyCustomElements: DestroyAggregation;

        /**
         * Adds a custom content element to the **customContents** aggregation.
         *
         * This allows consumers to insert additional SAPUI5 controls into the generated dialog or component.
         * The provided **aggregation** must be an instance of **ui5.antares.pro.v2.custom.CustomContent**.
         *
         * **Note:** The lifecycle and behavior of custom content must be fully managed by the consumer.
         *
         * @param aggregation The **CustomContent** instance to add.
         */
        addCustomContent: AddAggregation<CustomContent>;

        /**
         * Retrieves all custom content elements in the **customContents** aggregation.
         *
         * These elements are used to extend the UI with additional SAPUI5 controls,
         * as defined by the consumer.
         *
         * @returns An array of **CustomContent** instances currently aggregated.
         */
        getCustomContents: GetAggregation<CustomContent[]>;

        /**
         * Removes a specific custom content element from the **customContents** aggregation.
         *
         * The content can be removed by its index, ID, or object reference.
         * After removal, it will no longer be rendered in the generated UI.
         *
         * @param aggregation The custom content to remove (by index, ID, or instance).
         */
        removeCustomContent: RemoveAggregation<CustomContent>;

        /**
         * Removes all custom content elements from the **customContents** aggregation.
         *
         * This clears all additional UI controls provided by the consumer.
         */
        removeAllCustomContents: RemoveAllAggregation;

        /**
         * Destroys all custom content elements in the **customContents** aggregation.
         *
         * This permanently deletes all **CustomContent** instances and releases their associated resources.
         * The default UI remains intact, but any custom UI enhancements are removed.
         */
        destroyCustomContents: DestroyAggregation;
    }
}

export type Operation = "Create" | "Update" | "Delete" | "Read";
export type FormType = "SimpleForm" | "SmartForm";
export type GuidMode = "All" | "Key" | "NonKey" | "None";

export type TextInEditModeSource =
    "None" |
    "NavigationProperty" |
    "ValueList" |
    "ValueListNoValidation" |
    "ValueListWarning";

export interface DateTimeSettings {
    datePattern?: string;
    dateTimePattern?: string;
    timePattern?: string;
}

export interface NumberSettings {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
}

export interface PropertySettings {
    name: string;
    label?: string;
    required?: boolean;
    readonly?: boolean;
    excluded?: boolean;
    textInEditModeSource?: TextInEditModeSource;
    layoutData?: LayoutData;
}

export type ContentWrapper =
    VBox |
    HBox |
    FlexBox |
    Grid |
    VerticalLayout |
    HorizontalLayout;
