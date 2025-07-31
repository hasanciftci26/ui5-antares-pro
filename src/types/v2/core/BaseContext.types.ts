/* eslint-disable semi */
import { ButtonType } from "sap/m/library";
import ManagedObject from "sap/ui/base/ManagedObject";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import {
    ContentWrapper,
    DateTimeSettings,
    FormType,
    GuidMode,
    NumberSettings,
    PropertySettings
} from "ui5/antares/pro/types/v2/ui/Factory.types";
import CustomContent from "ui5/antares/pro/v2/custom/CustomContent";
import CustomElement from "ui5/antares/pro/v2/custom/CustomElement";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

declare module "ui5/antares/pro/v2/core/BaseContext" {
    export default interface BaseContext {
        getController: GetProperty<Controller>;
        setController: SetProperty<Controller>;
        getModelRef: GetProperty<string | ODataModel | undefined>;
        setModelRef: SetProperty<string | ODataModel | undefined>;
        getResourceModelRef: GetProperty<string | ResourceModel | undefined>;
        setResourceModelRef: SetProperty<string | ResourceModel | undefined>;
        getDeferredGroupId: GetProperty<string>;
        setDeferredGroupId: SetProperty<string>;
    }
}

export interface Settings {
    /**
     * A reference to the [controller](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.mvc.Controller) instance of the consumer application.
     * Used internally to access various resources such as the [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel),
     * [ResourceModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.resource.ResourceModel) (i18n), 
     * and the [owner component](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.UIComponent) of the consumer app.
     */
    controller: Controller;

    /**
     * The name of the EntitySet within the consumer application's OData service.
     * **Must not begin with a slash (/).**
     */
    entitySet: string;

    /**
     * Optional reference to the [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel) used by the consumer application.
     * - If omitted, the library assumes the [owner component](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.UIComponent) of the consumer app
     * has a default unnamed [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel).
     * - If a string is provided, it is treated as the name of the 
     * [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel) registered on the 
     * [owner component](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.UIComponent) of the consumer app.
     * - If an instance of [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel) is provided, it is used directly.
     */
    modelRef?: string | ODataModel;

    /**
     * Optional reference to the [resource (i18n) model](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.resource.ResourceModel) used for 
     * generating property labels.
     * - If omitted, the library looks for a [resource model](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.resource.ResourceModel) 
     * named **i18n** on the [owner component](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.UIComponent) of the consumer app.
     * - If a string is provided, it is treated as the name of the 
     * [ResourceModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.resource.ResourceModel) 
     * registered on the [owner component](https://sapui5.hana.ondemand.com/#/api/sap.ui.core.UIComponent) of the consumer app.
     * - If an instance of [ResourceModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.resource.ResourceModel) is provided, 
     * it is used directly.
     */
    resourceModelRef?: string | ResourceModel;

    /** 
     * ID of the deferred group used for OData create operations.
     * By default, the UI5 Antares Pro library registers a deferred group with the ID **ui5AntaresPro** on the 
     * consumer's [ODataModel](https://sapui5.hana.ondemand.com/#/api/sap.ui.model.odata.v2.ODataModel).
     * This property allows the consumer to override the default group ID.
     * 
     * @default "ui5AntaresPro"
     */
    deferredGroupId?: string;

    /**
     * Index position of the generated form within the containing dialog or component.
     * By default, the form is inserted as the first element. This property allows the consumer to insert custom content,
     * such as a navigation form or table, before the generated form.
     */
    index?: number;

    /**
     * Custom title for the generated dialog.
     * The library automatically generates a localized default title based on the operation (create, update, delete, or read).
     * This property allows the consumer to override the generated title.
     */
    dialogTitle?: string;

    /**
     * Type of form to generate for the specified EntitySet.
     * By default, the library generates a [SmartForm](https://sapui5.hana.ondemand.com/#/api/sap.ui.comp.smartform.SmartForm). 
     * This property allows the consumer to switch to a [SimpleForm](https://sapui5.hana.ondemand.com/#/api/sap.ui.layout.form.SimpleForm).
     * 
     * @default "SmartForm"
     */
    formType?: FormType;

    /**
     * Title displayed above the generated form.
     * By default, no title is set. Use this property to define a custom title for the form.
     */
    formTitle?: string;

    /**
     * Text displayed on the submit button within the generated dialog.
     * A default localized text is provided by the library based on the current language.
     * This property allows the consumer to override the button text.
     * Note: The submit button is not generated when using the **DisplayEntry** class.
     */
    submitButtonText?: string;

    /**
     * [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the submit button in the generated dialog.
     * Defaults to **Emphasized**. This property allows the consumer to configure a different button type.
     * Note: The submit button is not generated when using the **DisplayEntry** class.
     * 
     * @default "Emphasized"
     */
    submitButtonType?: ButtonType;

    /**
     * Text displayed on the close button within the generated dialog.
     * A default localized text is provided by the library based on the current language.
     * This property allows the consumer to override the button text.
     */
    closeButtonText?: string;

    /**
     * [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the close button in the generated dialog.
     * Defaults to **Default**. This property allows the consumer to configure a different button type.
     * 
     * @default "Default"
     */
    closeButtonType?: ButtonType;

    /**
     * Enables enforcement of key properties in the generated form.
     * When set to **true** (default), all key properties are included in the form and positioned at the top.
     * To allow key properties to be excluded or reordered, this flag must be set to **false**.
     * 
     * @default true
     */
    keyEnforcementEnabled?: boolean;

    /**
     * Enables label generation based on OData metadata.
     * When set to **true**, the library attempts to extract labels from either the **sap:label** extension
     * or the **@com.sap.vocabularies.Common.v1.Label** annotation of each property. If neither is available,
     * the library generates a label based on the property's naming convention.
     * 
     * @default false
     */
    metadataLabelEnabled?: boolean;

    /**
     * Controls how the library generates random GUID values for properties of type **Edm.Guid**.
     * 
     * Supported modes:
     * - **All**: Generates GUIDs for all **Edm.Guid** properties.
     * - **Key**: Generates GUIDs only for key properties with **Edm.Guid** type.
     * - **NonKey**: Generates GUIDs only for non-key **Edm.Guid** properties.
     * - **None**: Disables GUID generation entirely.
     * 
     * @default "Key"
     */
    guidGenerationMode?: GuidMode;

    /**
     * Controls the visibility of properties with **Edm.Guid** type in the generated form.
     * 
     * Supported modes:
     * - **All**: Displays all **Edm.Guid** properties.
     * - **Key**: Displays only key **Edm.Guid** properties.
     * - **NonKey**: Displays only non-key **Edm.Guid** properties.
     * - **None**: Hides all **Edm.Guid** properties.
     * 
     * @default "NonKey"
     */
    guidVisibilityMode?: GuidMode;

    /**
     * Custom error message to be displayed when required fields are not provided by the end user during submission.
     * This property overrides the default localized error message shown for missing required fields.
     * 
     * If the message contains the placeholder **{property}**, it will be replaced at runtime
     * with the label of the target property.
     *
     * **Note:** This property is applicable only when **formType** is set to **SimpleForm**. In **SmartForm**, 
     * the SAPUI5 library automatically provides a localized error message for required smart fields.
     */
    requiredPropertyError?: string;

    /**
     * Custom error message to be displayed in an error **MessageBox** when the entity fails validation upon submission.
     * The default message provided by the library can be overridden by setting this property.
     */
    validationErrorMessage?: string;

    /**
     * Custom error message to be displayed in an error **MessageBox** when an operation (update, delete, or display)
     * is attempted on a one-to-many navigation property's generated table without selecting a row,
     * or when the **run** method of update (UpdateEntry), delete (DeleteEntry), 
     * or read (DisplayEntry) operations is called with a table ID but no row is selected.
     * 
     * The default error message provided by the library can be overridden by setting this property.
     */
    selectRowError?: string;

    /**
     * Indicates whether an error **MessageBox** should be displayed when an error occurs during entity submission.
     *
     * If enabled (**default**), the library attempts to extract an error message from the OData error response.
     * If a message is found, it is displayed; otherwise, a default localized message is shown.
     *
     * If set to **false**, the error **MessageBox** will be suppressed. This can be useful in custom error handling scenarios.
     *
     * @default true
     */
    showErrorMessageBox?: boolean;

    /**
     * Indicates whether all properties of type **Edm.Boolean** should be automatically initialized with **false**
     * when creating a new entity, provided no explicit value is set via the **run()** method or **inheritValues** parameter of a navigation property.
     *
     * If set to **false**, such properties will be initialized as **null** instead. This behavior is enabled by default.
     *
     * @default true
     */
    booleanFalseByDefault?: boolean;

    /**
     * Determines whether the generated dialog should be automatically closed after a successful entity submission.
     *
     * This behavior is enabled by default. To prevent automatic closing—especially in cases where custom content 
     * needs to be processed after submission—this flag can be set to **false**.
     *
     * @default true
     */
    autoCloseOnSuccess?: boolean;

    /**
     * Configuration settings for date, time, and date-time controls used by the library.
     *
     * The control generation is based on the following OData type mappings:
     *
     * 1. **Edm.DateTime** with **sap:display-format=Date** → [DatePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.DatePicker)
     * 2. **Edm.DateTime** → [DateTimePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.DateTimePicker)
     * 3. **Edm.DateTimeOffset** → [DateTimePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.DateTimePicker)
     * 4. **Edm.Time** → [TimePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.TimePicker)
     *
     * By default, these controls format values based on the end user's locale.
     * This configuration allows consumers to define custom formatting patterns,
     * which must conform to the [Unicode Locale Data Markup Language (LDML)](https://unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).
     *
     * - **datePattern**: Used for the [DatePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.DatePicker) control.
     * - **dateTimePattern**: Used for the [DateTimePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.DateTimePicker) control.
     * - **timePattern**: Used for the [TimePicker](https://sapui5.hana.ondemand.com/#/api/sap.m.TimePicker) control.
     */
    dateTimeSettings?: DateTimeSettings;

    /**
     * Configuration settings for numeric formatting used in input controls representing number fields.
     *
     * By default, the library formats numbers using the end user's locale (e.g., decimal separator, grouping).
     * This property allows consumers to override the default behavior with custom settings.
     *
     * - **decimalSeparator**: Custom decimal separator for number inputs.
     * - **groupingSeparator**: Custom grouping separator (e.g., comma, dot).
     * - **groupingSize**: Number of digits between grouping separators.
     * - **groupingEnabled**: If set to **false**, grouping separators are disabled. Only decimal separation remains active.
     */
    numberSettings?: NumberSettings;

    /**
     * Custom layout wrapper to be used for placing generated content such as forms, tables, and custom controls.
     *
     * By default:
     * - In **Dialog** mode, the content is wrapped in a **Dialog**.
     * - In **Component** mode, the content is wrapped in a **VBox**.
     *
     * This property allows consumers to supply a custom layout (e.g., **GridLayout**, **HorizontalLayout**, **FlexBox**) 
     * to override the default wrapper and customize the presentation.
     */
    contentWrapper?: ContentWrapper;

    /**
     * Entity-specific configuration for individual properties belonging to the specified **entitySet**.
     *
     * This array allows consumers to define property-level behaviors, such as marking fields as **required**, **readonly**, 
     * or **excluded** from the generated form or table.
     */
    propertySettings?: PropertySettings[];

    /**
     * Custom order for displaying properties in the generated form.
     *
     * By default, property controls (e.g., **Input**, **DatePicker**) are rendered in the order they appear in the metadata.
     * This property allows consumers to specify a different sequence by listing property names in the desired order.
     *
     * The first item in the array appears first in the form, followed by the next, and so on.
     *
     * **Note:** If **keyEnforcementEnabled** is set to **true**, key properties are always shown first, 
     * regardless of their position in this array.
     */
    propertyOrder?: string[];

    /**
     * Navigation properties (associations) to be included in the generated dialog or component.
     *
     * The library supports both **1:1** and **1:N** cardinalities:
     * - For **1:1** navigation properties, an additional form is generated for the target entity.
     * - For **1:N** navigation properties, a table is generated to represent the associated entities.
     *
     * Consumers can provide instances of the **ui5.antares.pro.v2.metadata.NavigationProperty** class,
     * where configuration details for each navigation property are defined in the constructor.
     */
    navigationProperties?: NavigationProperty[];

    /**
     * Validation logics to be applied before the submission of an entity.
     *
     * One of the core capabilities of the UI5 Antares Pro library is its ability to run complex validations
     * on user input to reduce data entry errors. Consumers can provide multiple instances of the
     * **ui5.antares.pro.v2.validation.ValidationLogic** class, each of which encapsulates a specific validation rule.
     *
     * All validation logic should be configured in the corresponding constructor of each instance.
     */
    validationLogics?: ValidationLogic[];

    /**
     * Value help definitions to be used for properties of type **Edm.String** or **Edm.Guid**.
     *
     * The library includes a flexible **ui5.antares.pro.v2.valuelist.ValueList** class that allows consumers to define:
     * - The **EntitySet** from which the value help data should be retrieved.
     * - The **properties** of the target entity to be displayed in the value help dialog.
     *
     * Filtering, searching, and selection handling are fully managed by the library
     * based on the configuration provided within the **ValueList** instances.
     */
    valueLists?: ValueList[];

    /**
     * Form layout configuration for the generated form.
     *
     * By default, a standard form layout is used. This property allows consumers to override
     * the default layout by specifying a custom **FormLayout**, enabling alternate visual structure 
     * for the form inside the generated dialog or component.
     */
    formLayout?: FormLayout;

    /**
     * Custom control definitions to replace the automatically generated controls for specific properties.
     *
     * Normally, controls such as **Input**, **DatePicker**, or **Text** are generated based on metadata.
     * If a consumer prefers to use a different control (e.g., **Slider**), they can provide a
     * **ui5.antares.pro.v2.custom.CustomElement** instance for that property.
     *
     * When provided, the default control generation is skipped for the specified property, 
     * and the consumer's custom control is inserted instead.
     */
    customElements?: CustomElement[];

    /**
     * Custom UI5 content to be added to the generated dialog or component.
     *
     * This property allows consumers to extend the generated UI by inserting additional SAPUI5 controls.
     * The custom controls must be wrapped in instances of **ui5.antares.pro.v2.custom.CustomContent**.
     *
     * **Important:** The lifecycle and behavior of custom content must be fully managed by the consumer.
     * The library only places the content in the correct location but does not control it.
     */
    customContents?: CustomContent[];
}

export interface FormUtilityProvider extends ManagedObject {
    getValidationLogicByProperty: (property: string) => ValidationLogic | undefined;
    getValueListByProperty: (property: string) => ValueList | undefined;
    getFormLayout: () => FormLayout | undefined;
    getContext: () => Context;
    getCustomElementByProperty: (property: string) => CustomElement | undefined;
    getFormTitle: () => string | undefined;
}