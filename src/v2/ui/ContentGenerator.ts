import JSONModel from "sap/ui/model/json/JSONModel";
import Context from "sap/ui/model/odata/v2/Context";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";
import Root from "ui5/antares/pro/v2/core/Root";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";
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
            dateTimeSettings: { type: "object", visibility: "public" },
            numberSettings: { type: "object", visibility: "public" },
            excludedProperties: { type: "string[]", visibility: "public", defaultValue: [] },
            readonlyProperties: { type: "string[]", visibility: "public", defaultValue: [] },
            requiredProperties: { type: "string[]", visibility: "public", defaultValue: [] },
            propertyOrder: { type: "string[]", visibility: "public", defaultValue: [] },
            propertyLabels: { type: "object[]", visibility: "public", defaultValue: [] },
            navProperties: { type: "string[]", visibility: "public", defaultValue: [] }
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
            valueLists: {
                type: "ui5.antares.pro.v2.valuelist.ValueList",
                multiple: true,
                singularName: "valueList",
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

    public addValueList(valueList: ValueList) {
        valueList.check();
        this.addAggregation("valueLists", valueList);
    }

    public getValueListByProperty(property: string) {
        return this.getValueLists().find(list => list.getLocalDataProperty() === property);
    }

    public getContext() {
        return this.getProperty("context") as Context;
    }    

    protected getOperation() {
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

    protected setContext(context: Context) {
        this.setProperty("context", context);
    }

    protected async generate() {
        await this.loadMetaContext();

        this.getDialogGenerator().generate();
        this.generateParentForm();
        this.generateChildForm();

        // Dialog related methods should not run for the reuse component
        this.addFormsToDialog();
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
            navProperties: this.getNavProperties()
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

    private setDefaultValues() {
        this.setDefaultFormTitle();
        this.setDefaultSubmitButtonText();
        this.setDefaultCloseButtonText();
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