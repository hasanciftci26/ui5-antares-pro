/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import LayoutData from "sap/ui/core/LayoutData";
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
import { Multiplicity } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";
import CustomContent from "ui5/antares/pro/v2/custom/CustomContent";
import CustomElement from "ui5/antares/pro/v2/custom/CustomElement";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/metadata/NavigationProperty" {
    export default interface NavigationProperty {
        /**
         * Returns the name of the navigation property as defined in the metadata.
         * This name is essential for identifying the correct associated entity
         * to be handled as part of the deep operation.
         *
         * @returns The navigation property name.
         */
        getName: GetProperty<string>;

        /**
         * Sets the name of the navigation property to be used for deep handling.
         * The value must match the navigation property name defined in the metadata
         * of the EntitySet passed to the Entry class.
         *
         * @param newValue - The name of the navigation property.
         */
        setName: SetProperty<string>;

        /**
         * Returns the index that determines where the generated form or table will be inserted
         * within the dialog or component. If not specified, the content will be appended to the end.
         *
         * @returns The index at which the generated content will be placed, or undefined if not set.
         */
        getIndex: GetProperty<number | undefined>;

        /**
         * Sets the index that determines where the generated form or table will be inserted
         * within the dialog or component. If not provided, the content will be appended to the end.
         *
         * @param newValue - The index position for the generated content.
         */
        setIndex: SetProperty<number | undefined>;

        /**
         * Returns the configured table type used when the association cardinality is **many**.
         * If not set, **sap.ui.table.Table** is used by default. Ignored for **one-to-one** associations.
         *
         * @returns The type of table to be generated.
         */
        getTableClass: GetProperty<TableClass>;

        /**
         * Sets the table type to be used when the association cardinality is **many**.
         * This can be either **sap.ui.table.Table** or **sap.m.Table**.
         * This setting has no effect when the cardinality is **one**.
         *
         * @param newValue - The desired table class to use.
         */
        setTableClass: SetProperty<TableClass>;

        /**
         * Returns the custom title used for the generated table in **many** associations.
         * If not set, the associated entity name is used as the default title.
         * This setting is ignored when the cardinality is **one**.
         *
         * @returns The title of the table, or **undefined** if not specified.
         */
        getTableTitle: GetProperty<string | undefined>;

        /**
         * Sets a custom title for the generated table in **many** associations.
         * This title will override the default title based on the associated entity name.
         * This setting has no effect when the cardinality is **one**.
         *
         * @param newValue - The custom title to display on the table.
         */
        setTableTitle: SetProperty<string | undefined>;

        /**
         * Returns the layout data applied to the generated table.
         * This setting allows customizing how the table is rendered within its container.
         * It is ignored when the association cardinality is **one**.
         *
         * @returns The layout data for the table, or **undefined** if not set.
         */
        getTableLayoutData: GetProperty<LayoutData | undefined>;

        /**
         * Sets the layout data for the generated table.
         * This can be used to control the rendering of the table within its container.
         * This setting is ignored when the association cardinality is **one**.
         *
         * @param newValue - The layout data to apply to the table.
         */
        setTableLayoutData: SetProperty<LayoutData>;

        /**
         * Returns the title used for the generated form when the association cardinality is **one**.
         * For **many** associations, this value is used as the dialog title in Create, Update, Delete, and Display operations.
         *
         * @returns The form or dialog title, or **undefined** if not set.
         */
        getFormTitle: GetProperty<string | undefined>;

        /**
         * Sets the title for the generated form when the association cardinality is **one**.
         * For **many** associations, this title is also used in dialogs opened by action buttons.
         *
         * @param newValue - The title to display in the form or dialog.
         */
        setFormTitle: SetProperty<string | undefined>;

        /**
         * Returns the title used for the dialog triggered by the **Create** action in **many** associations.
         * If not set, the library provides a default localized title.
         *
         * @returns The custom title for the create dialog, or **undefined** if not set.
         */
        getCreateDialogTitle: GetProperty<string | undefined>;

        /**
         * Sets the title for the dialog triggered by the **Create** action in **many** associations.
         * This title replaces the default localized title.
         *
         * @param newValue - The title to display in the create dialog.
         */
        setCreateDialogTitle: SetProperty<string | undefined>;

        /**
         * Retrieves the custom title that is applied to the **Update** dialog rendered for a **many** association.
         * If no custom title has been defined, a localized default will be used instead.
         *
         * @returns The custom update dialog title, or **undefined** if not explicitly specified.
         */
        getUpdateDialogTitle: GetProperty<string | undefined>;

        /**
         * Assigns a custom title to the **Update** dialog displayed for a **many** association.
         * This overrides the default localized title typically used by the library.
         *
         * @param newValue - The title to be applied to the update dialog.
         */
        setUpdateDialogTitle: SetProperty<string | undefined>;

        /**
         * Retrieves the custom title that is applied to the **Delete** dialog rendered for a **many** association.
         * A default localized title is used if this value has not been provided.
         *
         * @returns The custom delete dialog title, or **undefined** if not defined.
         */
        getDeleteDialogTitle: GetProperty<string | undefined>;

        /**
         * Assigns a custom title to the **Delete** dialog displayed for a **many** association.
         * This allows override of the default localized title generated by the library.
         *
         * @param newValue - The title to be applied to the delete dialog.
         */
        setDeleteDialogTitle: SetProperty<string | undefined>;

        /**
         * Retrieves the custom title that is used for the **Display** (read-only) dialog in a **many** association.
         * When not set, a default title will be automatically derived and applied.
         *
         * @returns The custom read dialog title, or **undefined** if not provided.
         */
        getReadDialogTitle: GetProperty<string | undefined>;

        /**
         * Assigns a custom title to the **Display** (read-only) dialog used in a **many** association.
         * The provided value replaces the default localized title.
         *
         * @param newValue - The title to be displayed in the read dialog.
         */
        setReadDialogTitle: SetProperty<string | undefined>;

        /**
         * Retrieves the text label applied to the **Create** dialog’s submit button within a navigation property context.
         * If not explicitly set, a default label such as **Create** will be generated and used.
         *
         * @returns The submit button text for the create dialog.
         */
        getCreateButtonText: GetProperty<string>;

        /**
         * Sets a custom label for the submit button within the **Create** dialog of a navigation property.
         * This helps guide the user with a context-specific action label.
         *
         * @param newValue - The text to be used for the create dialog’s submit button.
         */
        setCreateButtonText: SetProperty<string>;

        /**
         * Retrieves the visual type (e.g., **Emphasized**, **Accept**) of the submit button used in the **Create** dialog.
         * The default is **Emphasized** if no value has been configured.
         *
         * @returns The button type applied to the create submit button.
         */
        getCreateButtonType: GetProperty<ButtonType>;

        /**
         * Sets the visual type of the submit button used in the **Create** dialog.
         * This enables the button to reflect the desired styling, such as **Emphasized** or **Accept**.
         *
         * @param newValue - The desired button type to be applied to the create dialog’s submit button.
         */
        setCreateButtonType: SetProperty<ButtonType>;

        /**
         * Retrieves the custom label used for the submit button in the **Update** dialog.
         * A default localized label will be used if no custom value is defined.
         *
         * @returns The update dialog’s submit button text.
         */
        getUpdateButtonText: GetProperty<string>;

        /**
         * Sets a custom label for the submit button in the **Update** dialog of a navigation property.
         * This label replaces the default text and helps clarify the action being performed.
         *
         * @param newValue - The label text for the update submit button.
         */
        setUpdateButtonText: SetProperty<string>;

        /**
         * Retrieves the visual type configured for the submit button in the **Update** dialog.
         * If no type has been set, **Emphasized** is used as the default.
         *
         * @returns The button type assigned to the update dialog’s submit button.
         */
        getUpdateButtonType: GetProperty<ButtonType>;

        /**
         * Sets the visual button type (such as **Accept**, **Reject**, or **Emphasized**) for the **Update** dialog’s submit button.
         *
         * @param newValue - The button type to be applied.
         */
        setUpdateButtonType: SetProperty<ButtonType>;

        /**
         * Retrieves the text label used for the submit (delete) button in the **Delete** dialog.
         * When not explicitly configured, a default label such as **Delete** is applied.
         *
         * @returns The submit button label used in the delete dialog.
         */
        getDeleteButtonText: GetProperty<string>;

        /**
         * Assigns a custom label to the submit (delete) button in the **Delete** dialog.
         *
         * @param newValue - The text to be displayed on the delete dialog’s submit button.
         */
        setDeleteButtonText: SetProperty<string>;

        /**
         * Retrieves the visual type used for the submit (delete) button in the **Delete** dialog.
         * If not provided, **Emphasized** is used by default.
         *
         * @returns The button type used in the delete dialog.
         */
        getDeleteButtonType: GetProperty<ButtonType>;

        /**
         * Sets the visual type of the submit (delete) button in the **Delete** dialog.
         * This determines the style applied to the button.
         *
         * @param newValue - The button type to apply to the delete dialog’s submit button.
         */
        setDeleteButtonType: SetProperty<ButtonType>;

        /**
         * Retrieves the text label applied to the close button in all dialogs (Create, Update, Delete, Display)
         * triggered from a navigation property context.
         * A localized label such as **Close** or **Cancel** will be used if not explicitly set.
         *
         * @returns The label for the close button in navigation dialogs.
         */
        getCloseButtonText: GetProperty<string>;

        /**
         * Sets a custom text label for the close button rendered in all dialogs (Create, Update, Delete, Display)
         * that are triggered by navigation properties.
         *
         * @param newValue - The text to be used for the close button.
         */
        setCloseButtonText: SetProperty<string>;

        /**
         * Retrieves the visual type applied to the close button in dialogs triggered by navigation actions.
         * If not explicitly defined, the **Default** button type is applied.
         *
         * @returns The button type of the close button.
         */
        getCloseButtonType: GetProperty<ButtonType>;

        /**
         * Assigns a specific visual type to the close button rendered in dialogs triggered by navigation actions.
         *
         * @param newValue - The button type to apply to the close button.
         */
        setCloseButtonType: SetProperty<ButtonType>;

        /**
         * Retrieves the number of columns that will be initially visible in the table generated
         * for navigation properties with **many** cardinality.
         * When not defined, up to five columns are shown by default, with the rest accessible via table personalization.
         *
         * @returns The number of visible columns.
         */
        getVisibleColumnCount: GetProperty<number>;

        /**
         * Sets how many columns should be initially visible in the generated table for **many** cardinality navigation properties.
         * This allows consumers to customize the default column visibility in the UI.
         *
         * @param newValue - The number of columns to be displayed initially.
         */
        setVisibleColumnCount: SetProperty<number>;

        /**
         * Indicates whether the validation check for at least one child entity is enabled in **many** cardinality
         * navigation properties when used with the **CreateEntry** class.
         * If **true**, parent entity submission will be blocked unless at least one child row is present.
         *
         * @returns **true** if the validation is enabled, otherwise **false**.
         */
        getNoEntryErrorEnabled: GetProperty<boolean>;

        /**
         * Enables or disables the validation check that enforces the presence of at least one entry
         * in the navigation table during deep creation scenarios.
         *
         * @param newValue - **true** to enable the check; **false** to disable it.
         */
        setNoEntryErrorEnabled: SetProperty<boolean>;

        /**
         * Retrieves the custom error message displayed when **noEntryErrorEnabled** is set to **true** and the user
         * attempts to submit the parent entity without any child entries.
         * If not explicitly defined, a default localized message will be shown.
         *
         * @returns The custom error message, or **undefined** if not specified.
         */
        getNoEntryErrorMessage: GetProperty<string | undefined>;

        /**
         * Sets a custom error message that appears when validation fails due to missing child entries
         * in a navigation table configured with **noEntryErrorEnabled**.
         * This message provides contextual guidance to the user during deep create flows.
         *
         * @param newValue - The custom message to display upon validation failure.
         */
        setNoEntryErrorMessage: SetProperty<string>;

        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;
        getMultiplicity: GetProperty<Multiplicity>;
        setMultiplicity: SetProperty<Multiplicity>;
        getContext: GetProperty<Context>;
        setContext: SetProperty<Context>;
        getPropertySettings: GetProperty<PropertySettings[]>;
        setPropertySettings: SetProperty<PropertySettings[]>;
        getPropertyOrder: GetProperty<string[]>;
        setPropertyOrder: SetProperty<string[]>;
        getInheritValues: GetProperty<ValueInheritance[]>;
        setInheritValues: SetProperty<ValueInheritance[]>;
        addValidationLogic: AddAggregation<ValidationLogic>;
        removeValidationLogic: RemoveAggregation<ValidationLogic>;
        getValidationLogics: GetAggregation<ValidationLogic[]>;
        removeAllValidationLogics: RemoveAllAggregation;
        destroyValidationLogics: DestroyAggregation;
        addValueList: AddAggregation<ValueList>;
        removeValueList: RemoveAggregation<ValueList>;
        getValueLists: GetAggregation<ValueList[]>;
        removeAllValueLists: RemoveAllAggregation;
        destroyValueLists: DestroyAggregation;
        getFormLayout: GetAggregation<FormLayout>;
        setFormLayout: SetAggregation<FormLayout>;
        getCustomElements: GetAggregation<CustomElement[]>;
        removeCustomElement: RemoveAggregation<CustomElement>;
        removeAllCustomElements: RemoveAllAggregation;
        destroyCustomElements: DestroyAggregation;
        addCustomContent: AddAggregation<CustomContent>;
        getCustomContents: GetAggregation<CustomContent[]>;
        removeCustomContent: RemoveAggregation<CustomContent>;
        removeAllCustomContents: RemoveAllAggregation;
        destroyCustomContents: DestroyAggregation;
    }
}

export interface Settings {
    /**
     * The name of the navigation property as defined in the metadata of the EntitySet passed to the Entry class.
     * This property is required to bind the correct associated entity for deep handling.
     */
    name: string;

    /**
     * Determines where the generated form or table will be inserted in the dialog or component.
     * If not specified, the content will be placed at the end.
     */
    index?: number;

    /**
     * Specifies the type of table to be used when the association cardinality is **many**.
     * Supported types are sap.ui.table.Table (default) and sap.m.Table.
     * This setting is ignored when the cardinality is **one**.
     */
    tableClass?: TableClass;

    /**
     * Defines a custom title for the generated table in **many** associations.
     * If not set, the name of the associated entity is used by default.
     * The row count is automatically managed and included in the title.
     * This setting is ignored when the cardinality is **one**.
     */
    tableTitle?: string;

    /**
     * Provides custom layout data for the generated table.
     * This can be used to change how the table is rendered within its container.
     * This setting is ignored when the cardinality is **one**.
     */
    tableLayoutData?: LayoutData;

    /**
     * Sets the title for the generated form when the association cardinality is **one**.
     * For **many** associations, this title is used in dialogs opened by action buttons
     * such as Create, Update, Delete, or Display.
     */
    formTitle?: string;

    /**
     * Title used for the dialog when the **Create** action button is triggered in a **many** association.
     * If not specified, a default localized title will be used.
     */
    createDialogTitle?: string;

    /**
     * Title used for the dialog when the **Update** action button is triggered in a **many** association.
     * If not specified, a default localized title will be used.
     */
    updateDialogTitle?: string;

    /**
     * Title used for the dialog when the **Delete** action button is triggered in a **many** association.
     * If not specified, a default localized title will be used.
     */
    deleteDialogTitle?: string;

    /**
     * Title used for the dialog when the **Display** action button is triggered in a **many** association.
     * If not specified, a default localized title will be used.
     */
    readDialogTitle?: string;

    /**
     * Defines the text displayed on the submit button within the dialog triggered by the **Create** action
     * on a navigation property's table. If not specified, a default localized label such as **Create + EntitySet Name** is applied.
     * This text helps guide the end user during child entity creation.
     */
    createButtonText?: string;

    /**
     * Defines the button type (e.g., **Emphasized**, **Accept**, **Reject**) used for the submit button within
     * the dialog triggered by the **Create** action on a navigation property's table.
     * If omitted, the default type **Emphasized** is used to draw attention to the action.
     */
    createButtonType?: ButtonType;

    /**
     * Specifies the text displayed on the submit button within the dialog triggered by the **Update** action.
     * This dialog allows editing of an existing child entity. If not explicitly provided, a localized
     * default such as **Update + Entity Name** is used.
     */
    updateButtonText?: string;

    /**
     * Specifies the button type used for the submit button in the **Update** dialog.
     * If not provided, the button is rendered using the **Emphasized** type by default.
     */
    updateButtonType?: ButtonType;

    /**
     * Specifies the text displayed on the submit (delete) button within the dialog triggered by the **Delete** action.
     * This dialog allows the removal of an existing child entity from the navigation property's table.
     * If not defined, a default localized label such as **Delete** will be used.
     */
    deleteButtonText?: string;

    /**
     * Specifies the button type used for the submit (delete) button in the **Delete** dialog.
     * If not provided, the button is rendered using the **Emphasized** type by default.
     */
    deleteButtonType?: ButtonType;

    /**
     * Defines the label for the close button rendered in all navigation dialogs (Create, Update, Delete, Display).
     * This button allows users to cancel the operation or close the dialog.
     * If not specified, a default localized text such as **Close** or **Cancel** is used.
     */
    closeButtonText?: string;

    /**
     * Defines the visual style for the close button in navigation dialogs (Create, Update, Delete, Display).
     * If not explicitly set, the library applies the default type **Default**.
     */
    closeButtonType?: ButtonType;

    /**
     * Determines how many columns will be initially visible in the table generated for **many** cardinality
     * navigation properties. By default, up to five columns are shown and the rest are hidden but accessible
     * through the table's personalization settings.
     * This property gives consumers control over the table’s initial appearance.
     */
    visibleColumnCount?: number;

    /**
     * Enables a validation check for **many** cardinality navigation properties used with the **CreateEntry** class.
     * When enabled, submission of the parent entity will be blocked unless at least one entry exists in the
     * corresponding child table. This enforces a minimum requirement for deep creation.
     * The default behavior (false) allows submission without any child records.
     */
    noEntryErrorEnabled?: boolean;

    /**
     * Defines the error message that is shown when **noEntryErrorEnabled** is set to true and the user attempts
     * to submit the parent entity without adding any child entities to the relevant navigation table.
     * If not specified, a default localized message is displayed. This helps provide a user-friendly and
     * informative error message aligned with the application context.
     */
    noEntryErrorMessage?: string;

    /**
     * Defines property-level configurations for the child entity, similar to those available in the main Entry class.
     * Consumers can mark child properties as **required**, **excluded**, **readonly**, and so on.
     * These configurations apply to the target entity of the navigation property.
     * 
     * **Note:** If **keyEnforcementEnabled** is set to **true** in the corresponding Entry class,
     * key properties will always be shown regardless of the **excluded** flag set here.
     */
    propertySettings?: PropertySettings[];

    /**
     * Allows the consumer to explicitly define the order in which the child entity’s properties
     * should be rendered in the generated form or table. By default, properties follow the order defined in the metadata.
     * When this array is provided, the specified property names are used to determine the rendering sequence.
     * Note: If **keyEnforcementEnabled** is enabled in the parent Entry class,
     * key fields will always appear first, regardless of their position in this array.
     */
    propertyOrder?: string[];

    /**
     * Enables inheritance of values from the parent entity to the child entity at the time of creation.
     * For example, if both parent and child entities share a common field (e.g., foreign key),
     * this property ensures that the child entity automatically inherits that field’s value during deep create.
     * 
     * **Note:** If the inherited field is editable, users can still modify it,
     * which may lead to unintended results. It is recommended to set such fields as **readonly** in **propertySettings**.
     */
    inheritValues?: ValueInheritance[];

    /**
     * Defines one or more validation logic objects that apply to the child entity’s form or table entry.
     * These validations are triggered before submission during Create or Update operations.
     * If any validation fails, the submission is blocked and an error is shown.
     */
    validationLogics?: ValidationLogic[];

    /**
     * Configures value help (F4 help) behavior for specific properties of the child entity,
     * similarly to the main Entry class. These value lists can be triggered by the end user in
     * Create and Update dialogs associated with the navigation property.
     */
    valueLists?: ValueList[];

    /**
     * If the cardinality of the navigation property is **one**, the library generates a form to represent
     * the child entity. This property allows consumers to configure the layout of that generated form
     * (e.g., column span, label alignment, etc.), using a **ui5.antares.pro.v2.ui.FormLayout** instance.
     */
    formLayout?: FormLayout;

    /**
     * Replaces the default UI5 controls generated for specific child entity properties with custom controls.
     * For example, an **Input** control may be replaced by a **TextArea**, **ComboBox**, or any other SAPUI5-compatible control.
     * This offers fine-grained control over the child entity UI behavior.
     */
    customElements?: CustomElement[];

    /**
     * Inserts custom UI content into the generated dialogs that are opened via action buttons (Create, Update, Display, etc.)
     * for **many** cardinality navigation properties. Unlike other managed components,
     * this content is not handled by the library and must be manually managed by the consumer.
     * This is ideal for injecting static elements, explanations, or custom logic blocks.
     */
    customContents?: CustomContent[];
}

export type TableClass = "sap.m.Table" | "sap.ui.table.Table";

export interface ValueInheritance {
    parentProperty: string;
    targetProperty: string;
}