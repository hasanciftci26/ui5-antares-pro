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
        getName: GetProperty<string>;
        setName: SetProperty<string>;
        getIndex: GetProperty<number | undefined>;
        setIndex: SetProperty<number | undefined>;
        getTableClass: GetProperty<TableClass>;
        setTableClass: SetProperty<TableClass>;
        getTableTitle: GetProperty<string | undefined>;
        setTableTitle: SetProperty<string | undefined>;
        getTableLayoutData: GetProperty<LayoutData | undefined>;
        setTableLayoutData: SetProperty<LayoutData>;
        getFormTitle: GetProperty<string | undefined>;
        setFormTitle: SetProperty<string | undefined>;
        getCreateDialogTitle: GetProperty<string | undefined>;
        setCreateDialogTitle: SetProperty<string | undefined>;
        getUpdateDialogTitle: GetProperty<string | undefined>;
        setUpdateDialogTitle: SetProperty<string | undefined>;
        getDeleteDialogTitle: GetProperty<string | undefined>;
        setDeleteDialogTitle: SetProperty<string | undefined>;
        getReadDialogTitle: GetProperty<string | undefined>;
        setReadDialogTitle: SetProperty<string | undefined>;
        getCreateButtonText: GetProperty<string>;
        setCreateButtonText: SetProperty<string>;
        getCreateButtonType: GetProperty<ButtonType>;
        setCreateButtonType: SetProperty<ButtonType>;
        getUpdateButtonText: GetProperty<string>;
        setUpdateButtonText: SetProperty<string>;
        getUpdateButtonType: GetProperty<ButtonType>;
        setUpdateButtonType: SetProperty<ButtonType>;
        getDeleteButtonText: GetProperty<string>;
        setDeleteButtonText: SetProperty<string>;
        getDeleteButtonType: GetProperty<ButtonType>;
        setDeleteButtonType: SetProperty<ButtonType>;
        getCloseButtonText: GetProperty<string>;
        setCloseButtonText: SetProperty<string>;
        getCloseButtonType: GetProperty<ButtonType>;
        setCloseButtonType: SetProperty<ButtonType>;
        getVisibleColumnCount: GetProperty<number>;
        setVisibleColumnCount: SetProperty<number>;
        getNoEntryErrorEnabled: GetProperty<boolean>;
        setNoEntryErrorEnabled: SetProperty<boolean>;
        getNoEntryErrorMessage: GetProperty<string | undefined>;
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