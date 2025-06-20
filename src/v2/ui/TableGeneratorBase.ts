import OverflowToolbar from "sap/m/OverflowToolbar";
import OverflowToolbarButton from "sap/m/OverflowToolbarButton";
import ResponsiveTable from "sap/m/Table";
import GridTable from "sap/ui/table/Table";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/Factory.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import MessageBox from "sap/m/MessageBox";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class TableGeneratorBase extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            tableTitle: { type: "string", defaultValue: "" },
            count: { type: "int", defaultValue: 0 },
            formTitle: { type: "string", defaultValue: "" },
            createFormTitle: { type: "string" },
            updateFormTitle: { type: "string" },
            deleteFormTitle: { type: "string" },
            createButtonText: { type: "string" },
            createButtonType: { type: "string" },
            updateButtonText: { type: "string" },
            updateButtonType: { type: "string" },
            deleteButtonText: { type: "string" },
            deleteButtonType: { type: "string" },
            submitButtonText: { type: "string", defaultValue: "" },
            submitButtonType: { type: "string", defaultValue: "Emphasized" },
            closeButtonText: { type: "string" },
            closeButtonType: { type: "string" },
            visibleColumnCount: { type: "int" },
            tableInstance: { type: "object", visibility: "hidden" }
        },
        aggregations: {
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

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
        this.setTableModel();
        this.setDialogGenerator(new DialogGenerator({
            dialogModel: this.getTableModel()
        }));

        this.getDialogGenerator().attachSubmitted(this.onSubmit, this);
        this.getDialogGenerator().attachClosed(this.onClose, this);
    }

    public abstract generate(): void;
    public abstract getContent(): Control;
    public abstract setContent(content: Control): void;
    public abstract getTable(): Control;
    public abstract setTable(content: Control): void;

    protected getFactory() {
        const parent = this.getParent() as NavigationProperty;
        return parent.getParent() as Factory;
    }

    protected getOwnerParent() {
        return this.getParent() as NavigationProperty;
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

    protected getTableInstance() {
        return this.getProperty("tableInstance") as ResponsiveTable | GridTable;
    }

    protected setTableInstance(tableInstance: ResponsiveTable | GridTable) {
        this.setProperty("tableInstance", tableInstance);
    }

    protected initialize() {
        if (this.getFactory().getFormType() === "SimpleForm") {
            this.setFormGenerator(new SimpleFormGenerator());
        } else {
            this.setFormGenerator(new SmartFormGenerator());
        }

        this.setDefaultTableTitle();
    }

    protected getMetaContext() {
        return this.getOwnerParent().getMetaContext();
    }

    protected setOperation(operation: Operation) {
        this.getOwnerParent().setOperation(operation);
    }

    protected async loadMetaContext() {
        await this.getMetaContext().load();
    }

    protected getToolbar(addSettingsButton: boolean) {
        const toolbar = new OverflowToolbar({
            content: this.getToolbarContent(addSettingsButton)
        });

        toolbar.setModel(this.getTableModel(), "table");
        return toolbar;
    }

    private getToolbarContent(addSettingsButton: boolean) {
        const content: Control[] = [
            new Title({ text: "{table>/tableTitle} ({table>/count})" })
        ];

        switch (this.getFactory().getOperation()) {
            case "Create":
                content.push(new ToolbarSpacer());
                content.push(this.getTableCreateButton());
                content.push(this.getTableDeleteButton());
                break;
            case "Update":
                content.push(new ToolbarSpacer());
                content.push(this.getTableCreateButton());
                content.push(this.getTableUpdateButton());
                content.push(this.getTableDeleteButton());
                break;
            case "Delete":
                content.push(new ToolbarSpacer());
                content.push(this.getTableDeleteButton());
                break;
        }

        if (addSettingsButton) {
            if (this.getFactory().getOperation() === "Read") {
                content.push(new ToolbarSpacer());
            }

            content.push(this.getTableSettingsButton());
        }

        return content;
    }

    private getTableCreateButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://add"
        });

        button.attachPress(this.onCreate, this);
        return button;
    }

    private getTableUpdateButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://edit"
        });

        button.attachPress(this.onUpdate, this);
        return button;
    }

    private getTableDeleteButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://delete"
        });

        button.attachPress(this.onDelete, this);
        return button;
    }

    private getTableSettingsButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://action-settings"
        });

        button.attachPress(this.onSettings, this);
        return button;
    }

    private async onCreate() {
        this.getOwnerParent().setOperation("Create");
        this.setSubmitButtonText(this.getCreateButtonText());
        this.setSubmitButtonType(this.getCreateButtonType());
        this.setFormTitle(this.getCreateFormTitle() || LibraryBundle.getText(
            "ui5AntaresPro.title.createEntry",
            [this.getOwnerParent().getEntitySet()]
        ));

        await this.getMetaContext().load();
        this.createEntry();
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());
        this.getDialogGenerator().getDialog().setBindingContext(this.getOwnerParent().getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private onUpdate() {

    }

    private onDelete() {

    }

    private onSettings() {

    }

    private async onSubmit() {
        BusyIndicator.show(0);

        this.correctFixedValueListValues();
        const validation = await this.getFormGenerator().validate();

        if (!validation) {
            BusyIndicator.hide();
            MessageBox.error(this.getFactory().getValidationErrorMessage());
            return;
        }

        BusyIndicator.hide();
        this.getDialogGenerator().getDialog().close();
    }

    private onClose() {
        const factory = this.getFactory();

        if (factory.getODataModel().hasPendingChanges(true)) {
            factory.getODataModel().resetChanges([this.getOwnerParent().getContext().getPath()], true, true);
        }
    }

    private createEntry() {
        if (this.getFactory().getOperation() === "Create") {
            this.createListBindingEntry();
        } else {

        }
    }

    private createListBindingEntry() {
        const tableInstance = this.getTableInstance();

        if (tableInstance instanceof GridTable) {
            const binding = tableInstance.getBinding("rows") as ODataListBinding;
            const context = binding.create(undefined, true);

            this.getOwnerParent().setContext(context);
        } else {
            const binding = tableInstance.getBinding("items") as ODataListBinding;
            const context = binding.create(undefined, true);

            this.getOwnerParent().setContext(context);
        }
    }

    private correctFixedValueListValues() {
        const context = this.getOwnerParent().getContext();
        const data = context.getObject() as Record<string, any>;

        for (const property in data) {
            if (data[property] === "UI5_ANTARES_PRO_SELECT_EMPTY_KEY" || data[property] === "00000000-0000-0000-0000-000000000000") {
                this.getFactory().getODataModel().setProperty(context.getPath() + `/${property}`, null);
            }
        }
    }

    private setDefaultTableTitle() {
        if (this.getTableTitle()) {
            return;
        }

        this.setTableTitle(this.getOwnerParent().getEntitySet());
    }

    private getTableModel() {
        return this.getModel("table") as JSONModel;
    }

    private setTableModel() {
        const model = new JSONModel({
            tableTitle: this.getTableTitle(),
            count: this.getCount(),
            formTitle: this.getFormTitle(),
            submitButtonText: this.getSubmitButtonText(),
            submitButtonType: this.getSubmitButtonType(),
            closeButtonText: this.getCloseButtonText(),
            closeButtonType: this.getCloseButtonType()
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "table");

        this.bindProperties([
            "tableTitle",
            "count",
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
                model: "table",
                mode: "TwoWay"
            });
        }
    }
}