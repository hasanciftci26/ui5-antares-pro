import ManagedObject from "sap/ui/base/ManagedObject";
import CustomData from "sap/ui/core/CustomData";
import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v2/Context";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
import { INavProperty, Operation } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";
import Root from "ui5/antares/pro/v2/core/Root";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import CustomElement from "ui5/antares/pro/v2/ui/CustomElement";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";
import TableGenerator from "ui5/antares/pro/v2/ui/TableGenerator";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class ContentGenerator extends Root {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            operation: { type: "string", visibility: "hidden" },
            context: { type: "object", visibility: "hidden" },
            formType: { type: "string", visibility: "public", defaultValue: "SmartForm" },
            formTitle: { type: "string", visibility: "public" },
            submitButtonText: { type: "string", visibility: "public" },
            submitButtonType: { type: "string", visibility: "public", defaultValue: "Emphasized" },
            closeButtonText: { type: "string", visibility: "public" },
            closeButtonType: { type: "string", visibility: "public", defaultValue: "Default" },
            keyEnforcementEnabled: { type: "boolean", visibility: "public", defaultValue: true },
            guidGenerationMode: { type: "string", visibility: "public", defaultValue: "Key" },
            guidVisibilityMode: { type: "string", visibility: "public", defaultValue: "NonKey" },
            metadataLabelEnabled: { type: "boolean", visibility: "public", defaultValue: false },
            validationErrorMessage: { type: "string", visibility: "public", defaultValue: "" },
            requiredPropertyErrorMessage: { type: "string", visibility: "public", defaultValue: "" },
            showErrorMessageBox: { type: "boolean", visibility: "public", defaultValue: true },
            dateTimeSettings: { type: "object", visibility: "public" },
            numberSettings: { type: "object", visibility: "public" },
            booleanSettings: { type: "object", visibility: "public", defaultValue: { trueText: "", falseText: "", autoFalse: true } },
            propertyOrder: { type: "string[]", visibility: "public", defaultValue: [] },
            propertySettings: { type: "object[]", visibility: "public", defaultValue: [] },
            navProperties: { type: "object[]", visibility: "public", defaultValue: [] }
        },
        aggregations: {
            metaContexts: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: true,
                singularName: "metaContext",
                visibility: "hidden"
            },
            dialogGenerator: {
                type: "ui5.antares.pro.v2.ui.DialogGenerator",
                multiple: false,
                visibility: "hidden"
            },
            simpleFormGenerators: {
                type: "ui5.antares.pro.v2.ui.SimpleFormGenerator",
                multiple: true,
                singularName: "simpleFormGenerators",
                visibility: "hidden"
            },
            smartFormGenerators: {
                type: "ui5.antares.pro.v2.ui.SmartFormGenerator",
                multiple: true,
                singularName: "smartFormGenerator",
                visibility: "hidden"
            },
            tableGenerators: {
                type: "ui5.antares.pro.v2.ui.TableGenerator",
                multiple: true,
                singularName: "tableGenerator",
                visibility: "hidden"
            },
            valueLists: {
                type: "ui5.antares.pro.v2.valuelist.ValueList",
                multiple: true,
                singularName: "valueList",
                visibility: "public"
            },
            validationLogics: {
                type: "ui5.antares.pro.v2.validation.ValidationLogic",
                multiple: true,
                singularName: "validationLogic",
                visibility: "public"
            },
            customElements: {
                type: "ui5.antares.pro.v2.ui.CustomElement",
                multiple: true,
                singularName: "customElement",
                visibility: "public"
            }
        }
    };

    constructor(settings: ISettings, operation: Operation) {
        super(settings);
        this.setOperation(operation);
        this.setDialogGenerator(new DialogGenerator({
            operation: this.getOperation()
        }));
        this.setDefaultValues();

        const model = new JSONModel({
            formTitle: this.getFormTitle(),
            submitButtonText: this.getSubmitButtonText(),
            submitButtonType: this.getSubmitButtonType(),
            closeButtonText: this.getCloseButtonText(),
            closeButtonType: this.getCloseButtonType()
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "content");

        this.bindProperties([
            "formTitle",
            "submitButtonText",
            "submitButtonType",
            "closeButtonText",
            "closeButtonType"
        ]);
    }

    public getMetaContexts() {
        return this.getAggregation("metaContexts") as MetaContext[];
    }

    public getParentMetaContext() {
        const context = this.getMetaContexts().find(context => context.getEntitySetType() === "Parent");
        return context as MetaContext;
    }

    public getMetaContextByEntitySet(entitySet: string) {
        const metaContext = this.getMetaContexts().find(context => context.getEntitySet() === entitySet);

        if (!metaContext) {
            throw new Error("The MetaContext was not found for the Entity Set: " + entitySet);
        }

        return metaContext;
    }

    public getChildMetaContexts() {
        return this.getMetaContexts().filter(context => context.getEntitySetType() === "Child");
    }

    public getSimpleFormGenerators() {
        return this.getAggregation("simpleFormGenerators") as SimpleFormGenerator[];
    }

    public getSmartFormGenerators() {
        return this.getAggregation("smartFormGenerators") as SmartFormGenerator[];
    }

    public getTableGenerators() {
        return this.getAggregation("tableGenerators") as TableGenerator[];
    }

    public addValueList(valueList: ValueList) {
        valueList.check();
        this.addAggregation("valueLists", valueList);
    }

    public getValueListByProperty(property: string) {
        return this.getValueLists().find(list => list.getLocalDataProperty() === property);
    }

    public addValidationLogic(validationLogic: ValidationLogic) {
        this.addAggregation("validationLogics", validationLogic);
    }

    public getValidationLogicByProperty(property: string) {
        return this.getValidationLogics().find(logic => logic.getPropertyName() === property);
    }

    public getContext() {
        return this.getProperty("context") as Context;
    }

    public getRequiredPropertyErrorMessage() {
        const message = this.getProperty("requiredPropertyErrorMessage") as string;
        return message.replace(/\\\{/g, "{").replace(/\\\}/g, "}");
    }

    public getSinglePropertySettings(propertyName: string) {
        return this.getPropertySettings().find(settings => settings.name === propertyName);
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

    public setNavProperties(navProperties: INavProperty[]) {
        for (const property of navProperties) {
            if (!property.tableClass) {
                property.tableClass = "sap.ui.table.Table";
            }
        }

        this.setProperty("navProperties", navProperties);
    }

    public getOperation() {
        return this.getProperty("operation") as Operation;
    }

    protected setOperation(operation: Operation) {
        this.setProperty("operation", operation);
    }

    protected addMetaContext(metaContext: MetaContext) {
        this.addAggregation("metaContexts", metaContext);
    }

    protected removeMetaContext(reference: number | string | MetaContext) {
        this.removeAggregation("metaContexts", reference);
    }

    protected removeAllMetaContexts() {
        this.removeAllAggregation("metaContexts");
    }

    protected destroyMetaContexts() {
        this.destroyAggregation("metaContexts");
    }

    protected getDialogGenerator() {
        return this.getAggregation("dialogGenerator") as DialogGenerator;
    }

    protected setDialogGenerator(dialogGenerator: DialogGenerator) {
        this.setAggregation("dialogGenerator", dialogGenerator);
    }

    protected destroyDialogGenerator() {
        this.destroyAggregation("dialogGenerator");
    }

    protected addSimpleFormGenerator(simpleFormGenerator: SimpleFormGenerator) {
        this.addAggregation("simpleFormGenerators", simpleFormGenerator);
    }

    protected removeSimpleFormGenerator(reference: number | string | SimpleFormGenerator) {
        this.removeAggregation("simpleFormGenerators", reference);
    }

    protected removeAllSimpleFormGenerators() {
        this.removeAllAggregation("simpleFormGenerators");
    }

    protected destroySimpleFormGenerators() {
        this.destroyAggregation("simpleFormGenerators");
    }

    protected addSmartFormGenerator(smartFormGenerator: SmartFormGenerator) {
        this.addAggregation("smartFormGenerators", smartFormGenerator);
    }

    protected removeSmartFormGenerator(reference: number | string | SmartFormGenerator) {
        this.removeAggregation("smartFormGenerators", reference);
    }

    protected removeAllSmartFormGenerators() {
        this.removeAllAggregation("smartFormGenerators");
    }

    protected destroySmartFormGenerators() {
        this.destroyAggregation("smartFormGenerators");
    }

    protected addTableGenerator(tableGenerator: TableGenerator) {
        this.addAggregation("tableGenerators", tableGenerator);
    }

    protected removeTableGenerator(reference: number | string | TableGenerator) {
        this.removeAggregation("tableGenerators", reference);
    }

    protected removeAllTableGenerators() {
        this.removeAllAggregation("tableGenerators");
    }

    protected destroyTableGenerators() {
        this.destroyAggregation("tableGenerators");
    }

    protected setContext(context: Context) {
        this.setProperty("context", context);
    }

    protected async generate() {
        await this.loadMetaContext();

        this.getDialogGenerator().generate();
        this.generateParentForm();
        this.generateChildForm();
        this.generateChildTable();

        // Dialog related methods should not run for the reuse component
        this.addFormsToDialog();
        this.addTablesToDialog();
        this.getDialogGenerator().getDialog().setBindingContext(this.getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private async loadMetaContext() {
        const parent = new MetaContext({
            entitySet: this.getEntitySet(),
            entitySetType: "Parent"
        });
        const navProperties = await MetaContext.extractNavProperties({
            model: this.getODataModel(),
            entitySet: this.getEntitySet(),
            navProperties: this.getNavProperties().map(prop => prop.name)
        });

        this.addMetaContext(parent);
        await parent.load();

        for (const property of navProperties) {
            const child = new MetaContext({
                entitySet: property.entitySet,
                entitySetType: "Child",
                navProperty: {
                    name: property.name,
                    multiplicity: property.multiplicity
                }
            });

            this.addMetaContext(child);
            await child.load();
        }
    }

    private generateParentForm() {
        const entitySet = this.getParentMetaContext().getEntitySet();

        if (this.getFormType() === "SmartForm") {
            const smartFormGenerator = new SmartFormGenerator({ entitySet: entitySet });
            this.addSmartFormGenerator(smartFormGenerator);
            smartFormGenerator.generate();
        } else {
            const simpleFormGenerator = new SimpleFormGenerator({ entitySet: entitySet });
            this.addSimpleFormGenerator(simpleFormGenerator);
            simpleFormGenerator.generate();
        }
    }

    private generateChildForm() {
        const children = this.getChildMetaContexts().filter(child => child.getNavProperty()!.multiplicity === "One");

        for (const child of children) {
            const entitySet = child.getEntitySet();

            if (this.getFormType() === "SmartForm") {
                const smartFormGenerator = new SmartFormGenerator({ entitySet: entitySet });
                this.addSmartFormGenerator(smartFormGenerator);
                smartFormGenerator.generate();
            } else {
                const simpleFormGenerator = new SimpleFormGenerator({ entitySet: entitySet });
                this.addSimpleFormGenerator(simpleFormGenerator);
                simpleFormGenerator.generate();
            }
        }
    }

    private generateChildTable() {
        const children = this.getChildMetaContexts().filter(child => child.getNavProperty()!.multiplicity === "Many");

        for (const child of children) {
            const navProperty = this.getNavProperties().find(prop => prop.name === child.getNavProperty()?.name)!;
            const tableGenerator = new TableGenerator({
                entitySet: child.getEntitySet(),
                navProperty: navProperty
            });

            this.addTableGenerator(tableGenerator);
            tableGenerator.generate();
        }
    }

    private addFormsToDialog() {
        if (this.getFormType() === "SmartForm") {
            for (const generator of this.getSmartFormGenerators()) {
                this.getDialogGenerator().getDialog().addContent(generator.getForm());
            }
        } else {
            for (const generator of this.getSimpleFormGenerators()) {
                this.getDialogGenerator().getDialog().addContent(generator.getForm());
            }
        }
    }

    private addTablesToDialog() {
        for (const generator of this.getTableGenerators()) {
            this.getDialogGenerator().getDialog().addContent(generator.getTable());
        }
    }

    private setDefaultValues() {
        this.setDefaultFormTitle();
        this.setDefaultSubmitButtonText();
        this.setDefaultCloseButtonText();
        this.setDefaultValidationErrorMessage();
        this.setDefaultRequiredPropertyMessage();
        this.setDefaultBooleanSettings();
    }

    private setDefaultFormTitle() {
        if (this.getFormTitle()) {
            return;
        }

        switch (this.getOperation()) {
            case "Create":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.createEntry", [this.getEntitySet()])!);
                break;
            case "Update":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.updateEntry", [this.getEntitySet()])!);
                break;
            case "Delete":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.deleteEntry", [this.getEntitySet()])!);
                break;
            case "Read":
                this.setFormTitle(LibraryBundle.getText("ui5AntaresPro.title.readEntry", [this.getEntitySet()])!);
                break;
        }
    }

    private setDefaultSubmitButtonText() {
        if (this.getSubmitButtonText()) {
            return;
        }

        switch (this.getOperation()) {
            case "Create":
                this.setSubmitButtonText(LibraryBundle.getText("ui5AntaresPro.button.create")!);
                break;
            case "Update":
                this.setSubmitButtonText(LibraryBundle.getText("ui5AntaresPro.button.update")!);
                break;
            case "Delete":
                this.setSubmitButtonText(LibraryBundle.getText("ui5AntaresPro.button.delete")!);
                break;
        }
    }

    private setDefaultCloseButtonText() {
        if (this.getCloseButtonText()) {
            return;
        }

        this.setCloseButtonText(LibraryBundle.getText("ui5AntaresPro.button.close")!);
    }

    private setDefaultValidationErrorMessage() {
        if (this.getValidationErrorMessage()) {
            return;
        }

        this.setValidationErrorMessage(LibraryBundle.getText("ui5AntaresPro.error.validation")!);
    }

    private setDefaultRequiredPropertyMessage() {
        if (this.getRequiredPropertyErrorMessage()) {
            return;
        }

        const message = LibraryBundle.getText("ui5AntaresPro.error.requiredField") as string;
        this.setRequiredPropertyErrorMessage(ManagedObject.escapeSettingsValue(message));
    }

    private setDefaultBooleanSettings() {
        const booleanSettings = this.getBooleanSettings();

        if (!booleanSettings.trueText) {
            booleanSettings.trueText = LibraryBundle.getText("ui5AntaresPro.text.true") as string;
        }

        if (!booleanSettings.falseText) {
            booleanSettings.falseText = LibraryBundle.getText("ui5AntaresPro.text.false") as string;
        }

        this.setBooleanSettings(booleanSettings);
    }

    private bindProperties(properties: string[]) {
        for (const property of properties) {
            this.bindProperty(property, {
                path: "/" + property,
                model: "content",
                mode: "TwoWay"
            });
        }
    }
}