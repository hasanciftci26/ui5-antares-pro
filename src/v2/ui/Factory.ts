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
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class Factory extends BaseContext implements MetaContextOwner, FormUtilityProvider {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            context: { type: "object" },
            index: { type: "int" },
            formType: { type: "string", defaultValue: "SmartForm" },
            formTitle: { type: "string", },
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

    public getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    public getRequiredPropertyError() {
        return this.getProperty("requiredPropertyError") as string;
    }

    public setRequiredPropertyError(error: string) {
        const escapedValue = error.includes("{property}") ? ManagedObject.escapeSettingsValue(error) : error;
        this.setProperty("requiredPropertyError", escapedValue);
    }

    public getValidationLogicByProperty(property: string) {
        return this.getValidationLogics().find(logic => logic.getPropertyName() === property);
    }

    public getValueListByProperty(property: string) {
        return this.getValueLists().find(valueList => valueList.getLocalDataProperty() === property);
    }

    public getOperation() {
        return this.getProperty("operation") as Operation;
    }

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
        this.setDefaultFormTitle();
        this.setDefaultSubmitButtonText();
    }

    private setDefaultFormTitle() {
        if (this.getFormTitle()) {
            return;
        }

        switch (this.getOperation()) {
            case "Create":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.createEntry", [this.getEntitySet()]));
                break;
            case "Update":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.updateEntry", [this.getEntitySet()]));
                break;
            case "Delete":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.deleteEntry", [this.getEntitySet()]));
                break;
            case "Read":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.readEntry", [this.getEntitySet()]));
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
            formTitle: this.getFormTitle(),
            submitButtonText: this.getSubmitButtonText(),
            submitButtonType: this.getSubmitButtonType(),
            closeButtonText: this.getCloseButtonText(),
            closeButtonType: this.getCloseButtonType()
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "factory");

        this.bindProperties([
            "formTitle",
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