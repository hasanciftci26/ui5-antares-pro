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
import { ErrorBody, SubmitChangesResponse } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import ResponseParser from "ui5/antares/pro/v2/entry/ResponseParser";
import ListBinding from "sap/ui/model/ListBinding";

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
export default abstract class TableGeneratorBase extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            tableTitle: { type: "string", defaultValue: "" },
            count: { type: "int", defaultValue: 0 },
            dialogTitle: { type: "string", defaultValue: "" },
            createDialogTitle: { type: "string" },
            updateDialogTitle: { type: "string" },
            deleteDialogTitle: { type: "string" },
            readDialogTitle: { type: "string" },
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
            visibleColumns: { type: "string[]", visibility: "hidden" },
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

    protected getVisibleColumns() {
        return this.getProperty("visibleColumns") as string[];
    }

    protected setVisibleColumns(visibleColumns: string[]) {
        this.setProperty("visibleColumns", visibleColumns);
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
            case "Read":
                content.push(this.getTableDisplayButton());
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

    private getTableDisplayButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://display"
        });

        button.attachPress(this.onDisplay, this);
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
        this.setDialogTitle(this.getCreateDialogTitle() || LibraryBundle.getText(
            "ui5AntaresPro.title.createEntry",
            [this.getOwnerParent().getEntitySet()]
        ));

        await this.getMetaContext().load();
        this.createEntry();
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());
        this.addCustomContentIntoDialog();
        this.getDialogGenerator().getDialog().setBindingContext(this.getOwnerParent().getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private async onUpdate() {
        const selectedContext = this.getSelectedRowContext();

        if (!selectedContext) {
            MessageBox.error(this.getFactory().getSelectRowError());
            return;
        }

        this.getOwnerParent().setContext(selectedContext);
        this.getOwnerParent().setOperation("Update");
        this.setSubmitButtonText(this.getUpdateButtonText());
        this.setSubmitButtonType(this.getUpdateButtonType());
        this.setDialogTitle(this.getUpdateDialogTitle() || LibraryBundle.getText(
            "ui5AntaresPro.title.updateEntry",
            [this.getOwnerParent().getEntitySet()]
        ));

        await this.getMetaContext().load();
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());
        this.addCustomContentIntoDialog();
        this.getDialogGenerator().getDialog().setBindingContext(this.getOwnerParent().getContext());
        this.getDialogGenerator().getDialog().open();
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
        this.setDialogTitle(this.getDeleteDialogTitle() || LibraryBundle.getText(
            "ui5AntaresPro.title.deleteEntry",
            [this.getOwnerParent().getEntitySet()]
        ));

        await this.getMetaContext().load();
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());
        this.addCustomContentIntoDialog();
        this.getDialogGenerator().getDialog().setBindingContext(this.getOwnerParent().getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private async onDisplay() {
        const selectedContext = this.getSelectedRowContext();

        if (!selectedContext) {
            MessageBox.error(this.getFactory().getSelectRowError());
            return;
        }

        this.getOwnerParent().setContext(selectedContext);
        this.getOwnerParent().setOperation("Read");
        this.setDialogTitle(this.getReadDialogTitle() || LibraryBundle.getText(
            "ui5AntaresPro.title.readEntry",
            [this.getOwnerParent().getEntitySet()]
        ));

        await this.getMetaContext().load();
        this.getDialogGenerator().generate();
        this.getFormGenerator().generate();

        this.getDialogGenerator().getDialog().addContent(this.getFormGenerator().getForm());
        this.addCustomContentIntoDialog();
        this.getDialogGenerator().getDialog().setBindingContext(this.getOwnerParent().getContext());
        this.getDialogGenerator().getDialog().open();
    }

    private addCustomContentIntoDialog() {
        for (const content of this.getOwnerParent().getCustomContents()) {
            this.getDialogGenerator().getDialog().insertContent(content.getContent(), content.getIndex());
        }
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
            const visibleColumns: string[] = [];
            columns.forEach(column => column.setVisible(false));

            state.Columns.forEach((selectedColumn, index) => {
                const column = columns.find(column => column.data("p13nKey") === selectedColumn.key);

                if (column) {
                    visibleColumns.push(selectedColumn.key);
                    column.setVisible(true);
                    tableInstance.removeColumn(column);
                    tableInstance.insertColumn(column, index);
                }
            });

            this.setVisibleColumns(visibleColumns);
            (tableInstance.getBinding("items") as ListBinding).refresh(true);
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
            this.createNewEntry();
        }
    }

    private createListBindingEntry() {
        const tableInstance = this.getTableInstance();

        if (tableInstance instanceof GridTable) {
            const binding = tableInstance.getBinding("rows") as ODataListBinding;
            const context = binding.create(this.getInitialEntryData(), true);

            this.getOwnerParent().setContext(context);
        } else {
            const binding = tableInstance.getBinding("items") as ODataListBinding;
            const context = binding.create(this.getInitialEntryData(), true);

            this.getOwnerParent().setContext(context);
        }
    }

    private createNewEntry() {
        const factory = this.getFactory();
        const context = factory.getODataModel().createEntry("/" + this.getOwnerParent().getEntitySet(), {
            groupId: factory.getDeferredGroupId()
        }) as Context;

        this.getOwnerParent().setContext(context);
        this.setGuidValuesIntoContext();
        this.inheritValuesIntoContext();
        this.setBooleanValuesIntoContext();
    }

    private getInitialEntryData() {
        const data: Record<string, any> = {};

        this.setGuidValuesIntoInitialData(data);
        this.inheritValuesIntoInitialData(data);
        this.setBooleanValuesIntoInitialData(data);

        if (Object.keys(data).length) {
            return data;
        }

        return;
    }

    private setGuidValuesIntoInitialData(data: Record<string, any>) {
        const properties = this.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Guid");

        for (const property of properties) {
            const factory = this.getFactory();
            const value = data[property.name];
            const hasInheritance = this.getOwnerParent().getInheritValues().some(inherit => inherit.targetProperty === property.name);

            if ((value != null && value !== "") || hasInheritance) {
                continue;
            }

            switch (factory.getGuidGenerationMode()) {
                case "All":
                    data[property.name] = window.crypto.randomUUID();
                    break;
                case "Key":
                    if (property.key) {
                        data[property.name] = window.crypto.randomUUID();
                    }
                    break;
                case "NonKey":
                    if (!property.key) {
                        data[property.name] = window.crypto.randomUUID();
                    }
                    break;
            }
        }
    }

    private inheritValuesIntoInitialData(data: Record<string, any>) {
        const properties = this.getMetaContext().getEntityProperties();

        for (const property of properties) {
            const inheritance = this.getOwnerParent().getInheritValues().find(inherit => inherit.targetProperty === property.name);

            if (!inheritance) {
                continue;
            }

            const originalValue = data[property.name];
            const parentValue = this.getFactory().getContext().getProperty(inheritance.parentProperty);

            if ((originalValue != null && originalValue !== "") || (parentValue == null || parentValue === "")) {
                continue;
            }

            data[property.name] = parentValue;
        }
    }

    private setBooleanValuesIntoInitialData(data: Record<string, any>) {
        if (!this.getFactory().getBooleanFalseByDefault()) {
            return;
        }

        const properties = this.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Boolean");

        for (const property of properties) {
            const value = data[property.name];

            if (value != null && value !== "") {
                continue;
            }

            data[property.name] = false;
        }
    }

    private setGuidValuesIntoContext() {
        const properties = this.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Guid");

        for (const property of properties) {
            const factory = this.getFactory();
            const context = this.getOwnerParent().getContext();
            const value = context.getProperty(property.name);
            const hasInheritance = this.getOwnerParent().getInheritValues().some(inherit => inherit.targetProperty === property.name);

            if ((value != null && value !== "") || hasInheritance) {
                continue;
            }

            switch (factory.getGuidGenerationMode()) {
                case "All":
                    factory.getODataModel().setProperty(context.getPath() + "/" + property.name, window.crypto.randomUUID());
                    break;
                case "Key":
                    if (property.key) {
                        factory.getODataModel().setProperty(context.getPath() + "/" + property.name, window.crypto.randomUUID());
                    }
                    break;
                case "NonKey":
                    if (!property.key) {
                        factory.getODataModel().setProperty(context.getPath() + "/" + property.name, window.crypto.randomUUID());
                    }
                    break;
            }
        }
    }

    private inheritValuesIntoContext() {
        const properties = this.getMetaContext().getEntityProperties();

        for (const property of properties) {
            const inheritance = this.getOwnerParent().getInheritValues().find(inherit => inherit.targetProperty === property.name);

            if (!inheritance) {
                continue;
            }

            const originalValue = this.getOwnerParent().getContext().getProperty(property.name);
            const parentValue = this.getFactory().getContext().getProperty(inheritance.parentProperty);

            if ((originalValue != null && originalValue !== "") || (parentValue == null || parentValue === "")) {
                continue;
            }

            this.getFactory().getODataModel().setProperty(this.getOwnerParent().getContext().getPath() + "/" + property.name, parentValue);
        }
    }

    private setBooleanValuesIntoContext() {
        if (!this.getFactory().getBooleanFalseByDefault()) {
            return;
        }

        const properties = this.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Boolean");

        for (const property of properties) {
            const factory = this.getFactory();
            const context = this.getOwnerParent().getContext();
            const value = context.getProperty(property.name);

            if (value != null && value !== "") {
                continue;
            }

            factory.getODataModel().setProperty(context.getPath() + "/" + property.name, false);
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
        
        const validation = await this.getFormGenerator().validate();

        if (!validation) {
            BusyIndicator.hide();
            MessageBox.error(this.getFactory().getValidationErrorMessage());
            return;
        }

        if (this.getFactory().getOperation() === "Create") {
            BusyIndicator.hide();
            this.getDialogGenerator().getDialog().close();
            return;
        }

        this.submitChanges();
    }

    private delete() {
        BusyIndicator.show(0);

        this.getOwnerParent().getContext().delete({
            groupId: "$auto"
        }).then(() => {
            BusyIndicator.hide();
            this.getDialogGenerator().getDialog().close();
        }).catch((err) => {
            BusyIndicator.hide();
            let message = LibraryBundle.getText("ui5AntaresPro.error.delete");

            if (this.hasResponseText(err)) {
                try {
                    const response = JSON.parse(err.responseText) as ErrorBody;

                    if (response.error?.message?.value) {
                        message = response.error.message.value;
                    }
                } catch (error) {
                    console.log("OData V2 deletion response cannot be parsed.");
                }
            }

            MessageBox.error(message);
        });
    }

    private submitChanges() {
        const factory = this.getFactory();

        if (factory.getODataModel().hasPendingChanges(true)) {
            if (this.getOwnerParent().getOperation() === "Create") {
                factory.getODataModel().submitChanges({
                    groupId: factory.getDeferredGroupId(),
                    success: (response?: SubmitChangesResponse) => {
                        BusyIndicator.hide();
                        this.onSubmitSuccess(response);
                    },
                    error: (err?: Record<string, any>) => {
                        BusyIndicator.hide();
                        this.onSubmitError(err);
                    }
                });
            } else {
                factory.getODataModel().submitChanges({
                    success: (response?: SubmitChangesResponse) => {
                        BusyIndicator.hide();
                        this.onSubmitSuccess(response);
                    },
                    error: (err?: Record<string, any>) => {
                        BusyIndicator.hide();
                        this.onSubmitError(err);
                    }
                });
            }
        } else {
            this.getDialogGenerator().getDialog().close();
        }
    }

    private onSubmitSuccess(response?: SubmitChangesResponse) {
        const factory = this.getFactory();
        const parser = new ResponseParser(response);
        parser.parse();

        if (parser.status === "Success") {
            this.getDialogGenerator().getDialog().close();
        } else {
            if (parser.errorMessage && factory.getShowErrorMessageBox()) {
                MessageBox.error(parser.errorMessage);
            }
        }
    }

    private onSubmitError(err?: Record<string, any>) {
        const factory = this.getFactory();
        const parser = new ResponseParser();
        parser.parseError(err);

        if (parser.errorMessage && factory.getShowErrorMessageBox()) {
            MessageBox.error(parser.errorMessage);
        }
    }

    private getP13nStateChangeHandler() {
        return this.getProperty("p13nStateChangeHandler") as (event: Event) => void;
    }

    private setP13nStateChangeHandler(p13nStateChangeHandler: (event: Event) => void) {
        this.setProperty("p13nStateChangeHandler", p13nStateChangeHandler);
    }

    private hasResponseText(err: any): err is { responseText: string; } {
        return typeof err === "object" &&
            err != null &&
            "responseText" in err &&
            typeof err.responseText === "string";
    }

    private setDefaultTableTitle() {
        if (this.getTableTitle()) {
            return;
        }

        this.setTableTitle(this.getOwnerParent().getEntitySet());
        this.getOwnerParent().setTableTitle(this.getOwnerParent().getEntitySet());
    }

    private getTableModel() {
        return this.getModel("table") as JSONModel;
    }

    private setTableModel() {
        const model = new JSONModel({
            tableTitle: this.getTableTitle(),
            count: this.getCount(),
            dialogTitle: this.getDialogTitle(),
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
                model: "table",
                mode: "TwoWay"
            });
        }
    }
}