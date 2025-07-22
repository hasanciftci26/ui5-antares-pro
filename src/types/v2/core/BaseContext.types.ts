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
    controller: Controller;
    entitySet: string;
    modelRef?: string | ODataModel;
    resourceModelRef?: string | ResourceModel;
    deferredGroupId?: string;
    formType?: FormType;
    formTitle?: string;
    submitButtonText?: string;
    submitButtonType?: ButtonType;
    closeButtonText?: string;
    closeButtonType?: ButtonType;
    keyEnforcementEnabled?: boolean;
    metadataLabelEnabled?: boolean;
    guidGenerationMode?: GuidMode;
    guidVisibilityMode?: GuidMode;
    requiredPropertyError?: string;
    validationErrorMessage?: string;
    selectRowError?: string;
    showErrorMessageBox?: boolean;
    booleanFalseByDefault?: boolean;
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
}

export interface FormUtilityProvider extends ManagedObject {
    getValidationLogicByProperty: (property: string) => ValidationLogic | undefined;
    getValueListByProperty: (property: string) => ValueList | undefined;
    getFormLayout: () => FormLayout | undefined;
    getContext: () => Context;
    getCustomElementByProperty: (property: string) => CustomElement | undefined;
}