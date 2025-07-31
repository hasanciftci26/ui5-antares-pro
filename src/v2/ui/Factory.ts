import FlexBox from "sap/m/FlexBox";
import HBox from "sap/m/HBox";
import VBox from "sap/m/VBox";
import ManagedObject from "sap/ui/base/ManagedObject";
import CustomData from "sap/ui/core/CustomData";
import Grid from "sap/ui/layout/Grid";
import HorizontalLayout from "sap/ui/layout/HorizontalLayout";
import VerticalLayout from "sap/ui/layout/VerticalLayout";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { FormUtilityProvider, Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { ContentWrapper, Operation } from "ui5/antares/pro/types/v2/ui/Factory.types";
import BaseContext from "ui5/antares/pro/v2/core/BaseContext";
import CustomElement from "ui5/antares/pro/v2/custom/CustomElement";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * **Internal use only.**
 *
 * This is an abstract base class used internally by the **UI5 Antares Pro** library to define shared behavior.
 * It is not intended to be instantiated or extended directly by consumers.
 *
 * @abstract
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class Factory extends BaseContext implements MetaContextOwner, FormUtilityProvider {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            context: { type: "object" },
            index: { type: "int" },
            dialogTitle: { type: "string" },
            formType: { type: "string", defaultValue: "SmartForm" },
            formTitle: { type: "string" },
            submitButtonText: { type: "string" },
            submitButtonType: { type: "string", defaultValue: "Emphasized" },
            closeButtonText: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.button.close") },
            closeButtonType: { type: "string", defaultValue: "Default" },
            keyEnforcementEnabled: { type: "boolean", defaultValue: true },
            metadataLabelEnabled: { type: "boolean", defaultValue: false },
            guidGenerationMode: { type: "string", defaultValue: "Key" },
            guidVisibilityMode: { type: "string", defaultValue: "NonKey" },
            requiredPropertyError: {
                type: "string",
                defaultValue: ManagedObject.escapeSettingsValue(LibraryBundle.getText("ui5AntaresPro.error.requiredField"))
            },
            validationErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.error.validation") },
            selectRowError: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.error.selectRow") },
            showErrorMessageBox: { type: "boolean", defaultValue: true },
            booleanFalseByDefault: { type: "boolean", defaultValue: true },
            autoCloseOnSuccess: { type: "boolean", defaultValue: true },
            dateTimeSettings: { type: "object" },
            numberSettings: { type: "object" },
            contentWrapper: { type: "object" },
            propertySettings: { type: "object[]", defaultValue: [] },
            propertyOrder: { type: "string[]", defaultValue: [] },
            operation: { type: "string", visibility: "hidden" }
        },
        aggregations: {
            navigationProperties: {
                type: "ui5.antares.pro.v2.metadata.NavigationProperty",
                multiple: true,
                singularName: "navigationProperty"
            },
            validationLogics: {
                type: "ui5.antares.pro.v2.validation.ValidationLogic",
                multiple: true,
                singularName: "validationLogic"
            },
            valueLists: {
                type: "ui5.antares.pro.v2.valuelist.ValueList",
                multiple: true,
                singularName: "valueList"
            },
            formLayout: {
                type: "ui5.antares.pro.v2.ui.FormLayout",
                multiple: false
            },
            customElements: {
                type: "ui5.antares.pro.v2.custom.CustomElement",
                multiple: true,
                singularName: "customElement"
            },
            customContents: {
                type: "ui5.antares.pro.v2.custom.CustomContent",
                multiple: true,
                singularName: "customContent"
            },
            metaContext: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: false,
                visibility: "hidden"
            },
            dialogGenerator: {
                type: "ui5.antares.pro.v2.ui.DialogGenerator",
                multiple: false,
                visibility: "hidden"
            },
            formGenerator: {
                type: "ui5.antares.pro.v2.ui.FormGeneratorBase",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: Settings, operation: Operation) {
        super(settings);
        this.setOperation(operation);
        this.setMetaContext(new MetaContext());

        if (this.getFormType() === "SimpleForm") {
            this.setFormGenerator(new SimpleFormGenerator());
        } else {
            this.setFormGenerator(new SmartFormGenerator());
        }

        this.setDefaultValues();
        this.setFactoryModel();
        this.setDialogGenerator(new DialogGenerator({
            dialogModel: this.getFactoryModel()
        }));
    }

    /**
     * Retrieves the metadata context aggregation containing properties and their attributes from the OData metadata.
     * 
     * This method is intended for internal use only and **must not be called by the consumer**.
     * It provides access to the metadata context stored in the aggregation named "metaContext".
     * 
     * @returns The MetaContext instance holding the metadata properties and attributes.
     * 
     * @internal
     */
    public getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    /**
     * Retrieves the custom error message from the **requiredPropertyError** property.
     *
     * If a custom message was not defined by the consumer, a default localized error message
     * generated by the library will be returned instead.
     *
     * This message is shown when required fields are left empty during submission.
     *
     * **Note:** This is applicable only when **formType** is set to **SimpleForm**.
     * In **SmartForm**, SAPUI5 automatically provides a localized error message.
     *
     * @returns The custom or default localized error message for missing required fields.
     */
    public getRequiredPropertyError() {
        return this.getProperty("requiredPropertyError") as string;
    }

    /**
     * Sets a custom error message in the **requiredPropertyError** property.
     *
     * This message overrides the default localized message shown when the user submits
     * a form without providing values for required fields.
     *
     * If the message contains the placeholder **{property}**, it will be replaced at runtime
     * with the label of the target property.
     *
     * **Note:** This is applicable only when **formType** is set to **SimpleForm**.
     *
     * @param error The custom error message to set.
     */
    public setRequiredPropertyError(error: string) {
        const escapedValue = error.includes("{property}") ? ManagedObject.escapeSettingsValue(error) : error;
        this.setProperty("requiredPropertyError", escapedValue);
    }

    /**
     * Returns the **ui5.antares.pro.v2.validation.ValidationLogic** instance for a specific property, if it exists.
     *
     * This method searches the **validationLogics** aggregation for a validation rule
     * associated with the given property name.
     *
     * @param property The name of the property to retrieve the validation logic for.
     * @returns The matching **ValidationLogic** instance, or **undefined** if none is found.
     */
    public getValidationLogicByProperty(property: string) {
        return this.getValidationLogics().find(logic => logic.getPropertyName() === property);
    }

    /**
     * Returns the **ui5.antares.pro.v2.valuelist.ValueList** instance for a specific property, if it exists.
     *
     * This method searches the **valueLists** aggregation for a value help definition
     * associated with the given property name.
     *
     * @param property The name of the property to retrieve the value list for.
     * @returns The matching **ValueList** instance, or **undefined** if none is found.
     */
    public getValueListByProperty(property: string) {
        return this.getValueLists().find(valueList => valueList.getLocalDataProperty() === property);
    }

    /**
     * Returns the current operation type (Create, Update, Delete, or Read) managed by the library.
     * 
     * This method reflects the operation mode set internally by the library based on the class instance.
     * 
     * **Note to consumers:** This method is intended for internal use and should generally **not** be called
     * directly in application code.
     * 
     * @returns The current operation as an Operation enum or type.
     *
     * @internal
     */
    public getOperation() {
        return this.getProperty("operation") as Operation;
    }

    /**
     * Adds a custom control definition to the **customElements** aggregation.
     *
     * Use this method to register a **ui5.antares.pro.v2.custom.CustomElement** instance for a specific property,
     * replacing the automatically generated control (e.g., **Input**, **DatePicker**, or **Text**).
     *
     * When a **CustomElement** is provided, the default control generation is skipped,
     * and the custom control is inserted into the generated form instead.
     *
     * @param customElement The **CustomElement** instance to add.
     */
    public addCustomElement(customElement: CustomElement) {
        customElement.getElement().addCustomData(new CustomData({
            key: "UI5AntaresProControlType",
            value: "Custom"
        }));

        customElement.getElement().addCustomData(new CustomData({
            key: "UI5AntaresProPropertyName",
            value: customElement.getPropertyName()
        }));

        this.addAggregation("customElements", customElement);
    }

    /**
     * Returns the **ui5.antares.pro.v2.custom.CustomElement** instance for a specific property, if it exists.
     *
     * This method searches the **customElements** aggregation for a custom control definition
     * associated with the given property name. If found, the custom control will be used instead
     * of the default automatically generated one.
     *
     * @param property The name of the property to retrieve the custom element for.
     * @returns The matching **CustomElement** instance, or **undefined** if none is found.
     */
    public getCustomElementByProperty(property: string) {
        return this.getCustomElements().find(element => element.getPropertyName() === property);
    }

    protected setOperation(operation: Operation) {
        this.setProperty("operation", operation);
    }

    protected getDialogGenerator() {
        return this.getAggregation("dialogGenerator") as DialogGenerator;
    }

    protected setDialogGenerator(dialogGenerator: DialogGenerator) {
        this.setAggregation("dialogGenerator", dialogGenerator);
    }

    protected getFormGenerator() {
        return this.getAggregation("formGenerator") as FormGeneratorBase;
    }

    protected setFormGenerator(formGenerator: FormGeneratorBase) {
        this.setAggregation("formGenerator", formGenerator);
    }

    protected setMetaContext(metaContext: MetaContext) {
        this.setAggregation("metaContext", metaContext);
    }

    protected async execute() {
        await this.loadMetaContexts();
        await this.generateContent();
        this.addContent();
        this.getDialogGenerator().getDialog().setBindingContext(this.getContext());
    }

    protected async executeComponent(container: VBox) {
        await this.loadMetaContexts();
        await this.generateContent(true);
        this.addContentIntoComponent(container);
        container.setModel(this.getODataModel());
        container.setBindingContext(this.getContext());
    }

    private async loadMetaContexts() {
        await this.getMetaContext().load();

        for (const property of this.getNavigationProperties()) {
            await property.load();
        }
    }

    private async generateContent(useComponent = false) {
        if (!useComponent) {
            this.getDialogGenerator().generate();
        }

        this.getFormGenerator().generate();

        for (const property of this.getNavigationProperties()) {
            await property.generate();
        }
    }

    private addContent() {
        const contentWrapper = this.getContentWrapper();

        if (contentWrapper) {
            this.addContentIntoWrapper(contentWrapper);
        } else {
            this.addContentIntoDialog();
        }
    }

    private addContentIntoComponent(container: VBox) {
        const contentWrapper = this.getContentWrapper();

        if (contentWrapper) {
            this.addContentIntoWrapper(contentWrapper, container);
        } else {
            this.addContentIntoContainer(container);
        }
    }

    private addContentIntoDialog() {
        const singleNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");
        const multiNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "Many");
        let index = 0;

        this.getDialogGenerator().getDialog().insertContent(this.getFormGenerator().getForm(), this.getIndex() ?? index);
        index++;

        for (const navigation of singleNavigations) {
            this.getDialogGenerator().getDialog().insertContent(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const navigation of multiNavigations) {
            this.getDialogGenerator().getDialog().insertContent(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const content of this.getCustomContents()) {
            this.getDialogGenerator().getDialog().insertContent(content.getContent(), content.getIndex());
        }
    }

    private addContentIntoWrapper(wrapper: ContentWrapper, container?: VBox) {
        switch (true) {
            case wrapper instanceof VBox:
            case wrapper instanceof HBox:
            case wrapper instanceof FlexBox:
                this.addContentAsItem(wrapper);
                break;
            default:
                this.addContentAsContent(wrapper);
                break;
        }

        if (container) {
            container.addItem(wrapper);
        } else {
            this.getDialogGenerator().getDialog().addContent(wrapper);
        }
    }

    private addContentAsItem(wrapper: VBox | HBox | FlexBox) {
        const singleNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");
        const multiNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "Many");
        let index = 0;

        wrapper.insertItem(this.getFormGenerator().getForm(), this.getIndex() ?? index);
        index++;

        for (const navigation of singleNavigations) {
            wrapper.insertItem(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const navigation of multiNavigations) {
            wrapper.insertItem(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const content of this.getCustomContents()) {
            wrapper.insertItem(content.getContent(), content.getIndex());
        }
    }

    private addContentAsContent(wrapper: Grid | HorizontalLayout | VerticalLayout) {
        const singleNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");
        const multiNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "Many");
        let index = 0;

        wrapper.insertContent(this.getFormGenerator().getForm(), this.getIndex() ?? index);
        index++;

        for (const navigation of singleNavigations) {
            wrapper.insertContent(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const navigation of multiNavigations) {
            wrapper.insertContent(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const content of this.getCustomContents()) {
            wrapper.insertContent(content.getContent(), content.getIndex());
        }
    }

    private addContentIntoContainer(container: VBox) {
        const singleNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");
        const multiNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "Many");
        let index = 0;

        container.insertItem(this.getFormGenerator().getForm(), this.getIndex() ?? index);
        index++;

        for (const navigation of singleNavigations) {
            container.insertItem(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const navigation of multiNavigations) {
            container.insertItem(navigation.getContent(), navigation.getIndex() ?? index);
            index++;
        }

        for (const content of this.getCustomContents()) {
            container.insertItem(content.getContent(), content.getIndex());
        }
    }

    private setDefaultValues() {
        this.setDefaultDialogTitle();
        this.setDefaultSubmitButtonText();
    }

    private setDefaultDialogTitle() {
        if (this.getDialogTitle()) {
            return;
        }

        switch (this.getOperation()) {
            case "Create":
                this.setDialogTitle(LibraryBundle.getText("ui5AntaresPro.title.createEntry", [this.getEntitySet()]));
                break;
            case "Update":
                this.setDialogTitle(LibraryBundle.getText("ui5AntaresPro.title.updateEntry", [this.getEntitySet()]));
                break;
            case "Delete":
                this.setDialogTitle(LibraryBundle.getText("ui5AntaresPro.title.deleteEntry", [this.getEntitySet()]));
                break;
            case "Read":
                this.setDialogTitle(LibraryBundle.getText("ui5AntaresPro.title.readEntry", [this.getEntitySet()]));
                break;
        }
    }

    private setDefaultSubmitButtonText() {
        if (this.getSubmitButtonText()) {
            return;
        }

        switch (this.getOperation()) {
            case "Create":
                this.setSubmitButtonText(LibraryBundle.getText("ui5AntaresPro.button.create"));
                break;
            case "Update":
                this.setSubmitButtonText(LibraryBundle.getText("ui5AntaresPro.button.update"));
                break;
            case "Delete":
                this.setSubmitButtonText(LibraryBundle.getText("ui5AntaresPro.button.delete"));
                break;
        }
    }

    private getFactoryModel() {
        return this.getModel("factory") as JSONModel;
    }

    private setFactoryModel() {
        const model = new JSONModel({
            dialogTitle: this.getDialogTitle(),
            submitButtonText: this.getSubmitButtonText(),
            submitButtonType: this.getSubmitButtonType(),
            closeButtonText: this.getCloseButtonText(),
            closeButtonType: this.getCloseButtonType()
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "factory");

        this.bindProperties([
            "dialogTitle",
            "submitButtonText",
            "submitButtonType",
            "closeButtonText",
            "closeButtonType"
        ]);
    }

    private bindProperties(properties: string[]) {
        for (const property of properties) {
            this.bindProperty(property, {
                path: "/" + property,
                model: "factory",
                mode: "TwoWay"
            });
        }
    }
}