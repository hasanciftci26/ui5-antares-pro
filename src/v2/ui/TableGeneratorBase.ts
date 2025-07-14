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
import { P13nProperty, P13nStateChangeParams, Settings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
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
import Context from "sap/ui/model/odata/v2/Context";
import MetadataHelper from "sap/m/p13n/MetadataHelper";
import Engine from "sap/m/p13n/Engine";
import SelectionController from "sap/m/p13n/SelectionController";
import Event from "sap/ui/base/Event";
import { Button$PressEvent } from "sap/m/Button";

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
            tableInstance: { type: "object", visibility: "hidden" },
            p13nStateChangeHandler: { type: "function", visibility: "hidden" }
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

    public abstract generate(): Promise<void>;
    public abstract getContent(): Control;
    public abstract setContent(content: Control): void;
    public abstract getTable(): Control;
    public abstract setTable(content: Control): void;

    public deregisterP13n() {
        Engine.getInstance().deregister(this.getTableInstance());
        Engine.getInstance().detachStateChange(this.getP13nStateChangeHandler());
    }

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

    protected getToolbar() {
        const toolbar = new OverflowToolbar({
            content: this.getToolbarContent()
        });

        toolbar.setModel(this.getTableModel(), "table");
        return toolbar;
    }

    protected registerP13n(properties: P13nProperty[]) {
        const helper = new MetadataHelper(properties);

        Engine.getInstance().register(this.getTableInstance(), {
            helper: helper,
            controller: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                Columns: new SelectionController({
                    targetAggregation: "columns",
                    control: this.getTableInstance()
                })
            }
        });

        this.setP13nStateChangeHandler(this.onP13nStateChange.bind(this) as (event: Event) => void);
        Engine.getInstance().attachStateChange(this.getP13nStateChangeHandler());
    }

    protected setTableLayoutData() {
        const tableLayoutData = this.getOwnerParent().getTableLayoutData();

        if (tableLayoutData) {
            this.getTableInstance().setLayoutData(tableLayoutData);
        }
    }

    private getToolbarContent() {
        const content: Control[] = [
            new Title({ text: "{table>/tableTitle} ({table>/count})" }),
            new ToolbarSpacer()
        ];

        switch (this.getFactory().getOperation()) {
            case "Create":
                content.push(this.getTableCreateButton());
                content.push(this.getTableDeleteButton());
                break;
            case "Update":
                content.push(this.getTableCreateButton());
                content.push(this.getTableUpdateButton());
                content.push(this.getTableDeleteButton());
                break;
            case "Delete":
                content.push(this.getTableDeleteButton());
                break;
        }

        content.push(this.getTableSettingsButton());
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
        const selectedContext = this.getSelectedRowContext();

        if (!selectedContext) {
            MessageBox.error(this.getFactory().getSelectRowError());
            return;
        }
    }

    private async onDelete() {
        const selectedContext = this.getSelectedRowContext();

        if (!selectedContext) {
            MessageBox.error(this.getFactory().getSelectRowError());
            return;
        }

        this.getOwnerParent().setContext(selectedContext);
        this.getOwnerParent().setOperation("Delete");
        this.setSubmitButtonText(this.getDeleteButtonText());
        this.setSubmitButtonType(this.getDeleteButtonType());
        this.setFormTitle(this.getDeleteFormTitle() || LibraryBundle.getText(
            "ui5AntaresPro.title.deleteEntry",
            [this.getOwnerParent().getEntitySet()]
        ));

        await this.getMetaContext().load();
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());
        this.getDialogGenerator().getDialog().setBindingContext(this.getOwnerParent().getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private onSettings(event: Button$PressEvent) {
        Engine.getInstance().show(this.getTableInstance(), ["Columns"], {
            source: event.getSource()
        });
    }

    private onP13nStateChange(event: Event<P13nStateChangeParams>) {
        const tableInstance = this.getTableInstance();
        const control = event.getParameter("control");
        const state = event.getParameter("state");

        if (control !== tableInstance || !state) {
            return;
        }

        if (tableInstance instanceof GridTable) {
            const columns = tableInstance.getColumns();
            columns.forEach(column => column.setVisible(false));

            state.Columns.forEach((selectedColumn, index) => {
                const column = columns.find(column => column.data("p13nKey") === selectedColumn.key);

                if (column) {
                    column.setVisible(true);
                    tableInstance.removeColumn(column);
                    tableInstance.insertColumn(column, index);
                }
            });
        } else {
            const columns = tableInstance.getColumns();
            columns.forEach(column => column.setVisible(false));

            state.Columns.forEach((selectedColumn, index) => {
                const column = columns.find(column => column.data("p13nKey") === selectedColumn.key);

                if (column) {
                    column.setVisible(true);
                    tableInstance.removeColumn(column);
                    tableInstance.insertColumn(column, index);
                }
            });
        }
    }

    private onSubmit() {
        switch (this.getOwnerParent().getOperation()) {
            case "Create":
            case "Update":
                this.submit();
                break;
            case "Delete":
                this.delete();
                break;
        }
    }

    private onClose() {
        const factory = this.getFactory();

        if (this.getOwnerParent().getOperation() === "Delete") {
            return;
        }

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

    private getSelectedRowContext() {
        const tableInstance = this.getTableInstance();

        if (tableInstance instanceof GridTable) {
            const selectedIndices = tableInstance.getSelectedIndices();

            if (!selectedIndices.length) {
                return;
            }

            return tableInstance.getContextByIndex(selectedIndices[0]) as Context;
        } else {
            const selectedItem = tableInstance.getSelectedItem();

            if (!selectedItem) {
                return;
            }

            return selectedItem.getBindingContext() as Context;
        }
    }

    private async submit() {
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

    private delete() {
        BusyIndicator.show(0);

        this.getOwnerParent().getContext().delete({
            groupId: this.getFactory().getDeferredGroupId()
        }).then(() => {
            BusyIndicator.hide();
            this.getDialogGenerator().getDialog().close();
        });
    }

    private getP13nStateChangeHandler() {
        return this.getProperty("p13nStateChangeHandler") as (event: Event) => void;
    }

    private setP13nStateChangeHandler(p13nStateChangeHandler: (event: Event) => void) {
        this.setProperty("p13nStateChangeHandler", p13nStateChangeHandler);
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