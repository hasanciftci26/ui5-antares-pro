import JSONModel from "sap/ui/model/json/JSONModel";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/Factory.types";
import BaseContext from "ui5/antares/pro/v2/core/BaseContext";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class Factory extends BaseContext implements MetaContextOwner {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            context: { type: "object" },
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

    public getOperation() {
        return this.getProperty("operation") as Operation;
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

    protected getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    protected setMetaContext(metaContext: MetaContext) {
        this.setAggregation("metaContext", metaContext);
    }

    protected async execute() {
        await this.loadMetaContexts();

        this.generateContent();
        this.addContent();
        this.getDialogGenerator().getDialog().setBindingContext(this.getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private async loadMetaContexts() {
        await this.getMetaContext().load();

        for (const property of this.getNavigationProperties()) {
            await property.load();
        }
    }

    private generateContent() {
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        for (const property of this.getNavigationProperties()) {
            property.generate();
        }
    }

    private addContent() {
        const singleNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");
        const multiNavigations = this.getNavigationProperties().filter(property => property.getMultiplicity() === "Many");

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());

        for (const navigation of singleNavigations) {
            this.getDialogGenerator().getDialog().addContent(navigation.getContent());
        }

        for (const navigation of multiNavigations) {
            this.getDialogGenerator().getDialog().addContent(navigation.getContent());
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