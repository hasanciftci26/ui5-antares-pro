import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Context from "sap/ui/model/odata/v2/Context";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { DialogGenerator$ClosedEvent, DialogGenerator$SubmittedEvent } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import ResponsiveTable from "sap/m/Table";
import GridTable from "sap/ui/table/Table";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import { ListMode } from "sap/m/library";
import { SelectionMode } from "sap/ui/table/library";
import { ErrorBody } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class DeleteEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            beforeDelete: { type: "function" },
            contextFound: { type: "boolean", visibility: "hidden" }
        },
        events: {
            deleteSuccess: {
                parameters: {
                    data: { type: "object" },
                    response: { type: "object" }
                }
            },
            deleteError: {
                parameters: {
                    response: { type: "object" }
                }
            }
        }
    };

    constructor(settings: Settings) {
        super(settings, "Delete");

        // Attach events
        this.getDialogGenerator().attachSubmitted(this.onDialogSubmit, this);
        this.getDialogGenerator().attachClosed(this.onDialogClose, this);
    }

    public async run<T extends Record<string, any> = Record<string, any>>(ref: Context | string | T) {
        BusyIndicator.show(0);

        await this.extractContext(ref);

        if (!this.getContextFound()) {
            BusyIndicator.hide();
            return;
        }

        await super.execute();
        this.getDialogGenerator().getDialog().open();

        BusyIndicator.hide();
    }

    private async extractContext<T extends Record<string, any> = Record<string, any>>(ref: Context | string | T) {
        const path = this.getContextPath<T>(ref);

        if (!this.getContextFound()) {
            return;
        }

        await this.createBindingContext(path);
    }

    private getContextPath<T extends Record<string, any> = Record<string, any>>(ref: Context | string | T) {
        if (ref instanceof Context) {
            this.setContextFound(true);
            return ref.getPath();
        }

        if (typeof ref === "string") {
            return this.getContextPathFromTable(ref);
        }

        this.setContextFound(true);
        return this.getODataModel().createKey("/" + this.getEntitySet(), ref);
    }

    private getContextPathFromTable(tableRef: string) {
        const table = this.getView().byId(tableRef);

        switch (true) {
            case table instanceof ResponsiveTable:
                return this.getContextPathFromResponsiveTable(table);
            case table instanceof GridTable:
                return this.getContextPathFromGridTable(table);
            case table instanceof SmartTable:
                return this.getContextPathFromSmartTable(table);
            default:
                throw new Error("Table with id: " + tableRef + " was not found or the table type is not supported.");
        }
    }

    private getContextPathFromResponsiveTable(table: ResponsiveTable) {
        if (![ListMode.SingleSelect, ListMode.SingleSelectLeft, ListMode.SingleSelectMaster].includes(table.getMode())) {
            throw new Error("The mode property of the sap.m.Table must be one of the followings: SingleSelect, SingleSelectLeft, SingleSelectMaster");
        }

        const item = table.getSelectedItem();

        if (!item) {
            MessageBox.error(this.getSelectRowError());
            this.setContextFound(false);
            return "";
        }

        const modelRef = this.getModelRef();

        if (typeof modelRef === "string" && modelRef !== "") {
            const context = item.getBindingContext(modelRef);

            if (context == null) {
                throw new Error("The context from the selected item cannot be accessed.");
            }

            this.setContextFound(true);
            return context.getPath();
        } else {
            const context = item.getBindingContext();

            if (context == null) {
                throw new Error("The context from the selected item cannot be accessed.");
            }

            this.setContextFound(true);
            return context.getPath();
        }
    }

    private getContextPathFromGridTable(table: GridTable) {
        if (table.getSelectionMode() !== SelectionMode.Single) {
            throw new Error("The selectionMode property of the sap.ui.table.Table must be Single.");
        }

        const selectedIndices = table.getSelectedIndices();

        if (!selectedIndices.length) {
            MessageBox.error(this.getSelectRowError());
            this.setContextFound(false);
            return "";
        }

        const context = table.getContextByIndex(selectedIndices[0]);

        if (context == null) {
            throw new Error("The context from the selected item cannot be accessed.");
        }

        this.setContextFound(true);
        return context.getPath();
    }

    private getContextPathFromSmartTable(table: SmartTable) {
        const innerTable = table.getTable();

        switch (true) {
            case innerTable instanceof ResponsiveTable:
                return this.getContextPathFromResponsiveTable(innerTable);
            case innerTable instanceof GridTable:
                return this.getContextPathFromGridTable(innerTable);
            default:
                throw new Error("The inner table of the SmartTable must be sap.m.Table or sap.ui.table.Table to use this feature.");
        }
    }

    private createBindingContext(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const expand = this.getNavigationProperties().map(navigation => navigation.getName()).join();
            let parameters: { expand: string; } | undefined;

            if (expand) {
                parameters = {
                    expand: expand
                };
            }

            this.getODataModel().createBindingContext(path, undefined, parameters, (context: Context | null) => {
                if (context) {
                    this.setContext(context);
                    resolve();
                } else {
                    reject("The BindingContext was not created successfully.");
                }
            });
        });
    }

    private async onDialogSubmit(event: DialogGenerator$SubmittedEvent) {
        BusyIndicator.show(0);

        const beforeDelete = this.getBeforeDelete();

        if (beforeDelete) {
            const proceed = await Promise.resolve(beforeDelete.call(this.getController(), this.getContext()));

            if (!proceed) {
                BusyIndicator.hide();
                return;
            }
        }

        this.delete();
    }

    private onDialogClose(event: DialogGenerator$ClosedEvent) {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().resetChanges([this.getContext().getPath()], true, true);
        }

        this.getNavigationProperties().forEach(property => property.deregisterP13n());
        this.resetDefaultBindingMode();
    }

    private delete() {
        this.getContext().delete({
            groupId: "$auto"
        }).then(() => {
            BusyIndicator.hide();

            this.fireDeleteSuccess({
                deleted: true,
                data: this.getContext().getObject()
            });

            this.resetDefaultBindingMode();
            this.getNavigationProperties().forEach(property => property.deregisterP13n());
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
            this.fireDeleteError({ response: err });
        });
    }

    private getContextFound() {
        return this.getProperty("contextFound") as boolean;
    }

    private setContextFound(contextFound: boolean) {
        this.setProperty("contextFound", contextFound);
    }

    private hasResponseText(err: any): err is { responseText: string; } {
        return typeof err === "object" &&
            err != null &&
            "responseText" in err &&
            typeof err.responseText === "string";
    }
}