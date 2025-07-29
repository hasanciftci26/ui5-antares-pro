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
     * Note: The submit button is not generated when using the **ReadEntry** class.
     */
    submitButtonText?: string;

    /**
     * [Button Type](https://sapui5.hana.ondemand.com/#/api/sap.m.ButtonType) of the submit button in the generated dialog.
     * Defaults to **Emphasized**. This property allows the consumer to configure a different button type.
     * Note: The submit button is not generated when using the **ReadEntry** class.
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
     */
    closeButtonType?: ButtonType;

    /**
     * Enables enforcement of key properties in the generated form.
     * When set to **true** (default), all key properties are included in the form and positioned at the top.
     * To allow key properties to be excluded or reordered, this flag must be set to **false**.
     */
    keyEnforcementEnabled?: boolean;

    /**
     * Enables label generation based on OData metadata.
     * When set to **true**, the library attempts to extract labels from either the **sap:label** extension
     * or the **@com.sap.vocabularies.Common.v1.Label** annotation of each property. If neither is available,
     * the library generates a label based on the property's naming convention.
     * Default value is **false**.
     */
    metadataLabelEnabled?: boolean;

    /**
     * Controls how the library generates random GUID values for properties of type **Edm.Guid**.
     * 
     * Supported modes:
     * - **All**: Generates GUIDs for all **Edm.Guid** properties.
     * - **Key**: Generates GUIDs only for key properties with **Edm.Guid** type. *(default)*
     * - **NonKey**: Generates GUIDs only for non-key **Edm.Guid** properties.
     * - **None**: Disables GUID generation entirely.
     */
    guidGenerationMode?: GuidMode;

    /**
     * Controls the visibility of properties with **Edm.Guid** type in the generated form.
     * 
     * Supported modes:
     * - **All**: Displays all **Edm.Guid** properties.
     * - **Key**: Displays only key **Edm.Guid** properties.
     * - **NonKey**: Displays only non-key **Edm.Guid** properties. *(default)*
     * - **None**: Hides all **Edm.Guid** properties.
     */
    guidVisibilityMode?: GuidMode;
    requiredPropertyError?: string;
    validationErrorMessage?: string;
    selectRowError?: string;
    showErrorMessageBox?: boolean;
    booleanFalseByDefault?: boolean;
    autoCloseOnSuccess?: boolean;
    dateTimeSettings?: DateTimeSettings;
    numberSettings?: NumberSettings;
    contentWrapper?: ContentWrapper;
    propertySettings?: PropertySettings[];
    propertyOrder?: string[];
    navigationProperties?: NavigationProperty[];
    validationLogics?: ValidationLogic[];
    valueLists?: ValueList[];
    formLayout?: FormLayout;
    customElements?: CustomElement[];
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