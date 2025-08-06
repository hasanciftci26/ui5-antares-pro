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
import VBox from "sap/m/VBox";

/**
 * Facilitates the deletion of an existing entity using the provided OData V2 model.
 *
 * This class generates a UI for reviewing and confirming the removal of a persisted entity
 * from a specified **EntitySet**. The existing entity’s data is displayed in a **read-only**
 * form to allow the end user to review the content before deletion.
 *
 * Based on the configuration, either a **dialog** or a **component** is rendered, containing:
 *
 * - Pre-filled form controls representing the current state of the entity
 * - Read-only access to all fields to prevent unintended modifications
 * - Option to trigger the deletion process with a user action (e.g., button press)
 *
 * Upon user confirmation, the library:
 * - Sends a **DELETE** request to the backend via the ODataModel
 * - Automatically handles error responses and messaging
 * - Fires an event upon **successful deletion** or **failure**, allowing the consumer to react accordingly
 *
 * This class provides a controlled and user-friendly mechanism for entity deletion,
 * ensuring transparency and safety before destructive actions are executed.
 * 
 * @namespace ui5.antares.pro.v2.entry
 */
export default class DeleteEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            beforeDelete: { type: "function" },
            contextFound: { type: "boolean", visibility: "hidden" },
            componentRoot: { type: "object", visibility: "hidden" }
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

    /**
     * Initiates the deletion process by extracting the context of the existing entity based on the provided reference,
     * then generates and opens the dialog for deletion confirmation.
     * 
     * The dialog displays the extracted entity data in **read-only mode** to prevent any modifications.
     * 
     * The context can be provided as:
     * 1) An instance of sap.ui.model.odata.v2.Context.
     * 2) Key values of the entity, which are used to fetch the context via a read request.
     * 3) A string representing the ID of a table in the consumer application, from which the selected row’s context is automatically retrieved.
     * 
     * Supported tables for context extraction by ID:
     * - sap.m.Table (selection mode: SingleSelect, SingleSelectMaster, or SingleSelectLeft)
     * - sap.ui.table.Table (selection mode: Single)
     * - sap.ui.comp.smarttable.SmartTable (inner table must be sap.m.Table or sap.ui.table.Table with the supported modes above)
     * 
     * If no context is found or no row is selected when using table ID, the operation aborts and an error MessageBox is displayed.
     * 
     * @param ref Reference used to determine the entity context (Context instance, key object, or table ID string).
     */
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

    /**
     * Initializes the deletion process in Component mode by extracting the context of the existing entity based on the provided reference,
     * and rendering the deletion UI inside the specified container.
     * 
     * This method is intended for internal use only and **must not be called by the consumer**.
     * 
     * The reference to extract the context follows the same rules as the dialog mode run method:
     * - An instance of sap.ui.model.odata.v2.Context.
     * - Key values of the entity for a read request.
     * - A string representing a table ID to derive the selected row context.
     * 
     * If the context is not found, the method returns early without rendering.
     * 
     * @param container The VBox container in which the deletion UI will be rendered.
     * @param ref Reference used to determine the entity context (Context instance, key object, or table ID string).
     * 
     * @internal
     */
    public async initComponent(container: VBox, ref: Context | string | Record<string, any>) {
        container.setBusy(true);
        this.setComponentRoot(container);
        await this.extractContext(ref);

        if (!this.getContextFound()) {
            return;
        }

        await super.executeComponent(container);
        container.setBusy(false);
    }

    /**
     * Initiates the deletion of the entity from the backend.
     *
     * This method is intended to be used **only in Component mode**, where no default deletion buttons
     * are generated by the library. The consumer is responsible for creating and managing their own button,
     * and must call this method programmatically to trigger the deletion process.
     *
     * The following operations are performed internally:
     *
     * - A global busy indicator is shown during the entire process.
     * - If a **beforeDelete** callback is defined by the consumer, it is executed. If the callback returns **false**, the process is stopped.
     * - If all checks pass, the entity deletion is submitted to the backend.
     *
     * The library automatically fires **deleteSuccess** or **deleteError** events based on the result of the deletion.
     */
    public async commit() {
        BusyIndicator.show(0);

        const beforeDelete = this.getBeforeDelete();

        if (beforeDelete) {
            const proceed = await Promise.resolve(beforeDelete.call(this.getController(), this.getContext()));

            if (!proceed) {
                BusyIndicator.hide();
                return;
            }
        }

        this.delete(true);
    }

    /**
     * Re-initializes the component by extracting and setting the context of an existing persisted entity
     * within the ODataModel.
     *
     * This method is designed for use in **Component mode**, where the **DeleteEntry** instance is maintained
     * throughout the component's lifecycle. It enables the reuse of the same component container
     * to load a different entity without reinstantiating the entire component.
     *
     * The following operations are performed:
     *
     * - A global busy indicator is shown during the process.
     * - Two-way data binding is enabled to keep the UI in sync with the model.
     * - The entity context is extracted based on the provided **ref**, which can be an OData context, key object, or table ID.
     * - The component container’s binding context is updated with the extracted entity.
     * - The busy indicator is hidden after completion.
     *
     * This method is not required in Dialog mode, where a new dialog is generated for each use.
     *
     * @param ref Reference used to identify the existing entity. It can be an OData context, key object, or a string table ID.
     */
    public async reload<T extends Record<string, any> = Record<string, any>>(ref: Context | string | T) {
        BusyIndicator.show(0);
        this.enableTwoWayBinding();
        await this.extractContext(ref);
        this.getComponentRoot().setBindingContext(this.getContext());
        BusyIndicator.hide();
    }

    /**
     * Returns the instance of the dialog generated by the library.
     *
     * This method is particularly useful when the auto-close feature is disabled,
     * allowing the consumer to access or manipulate custom content within the dialog
     * after a successful deletion.
     *
     * @returns The generated Dialog instance.
     */
    public getDialogInstance() {
        return this.getDialogGenerator().getDialog();
    }

    /**
     * Closes the dialog generated by the library.
     *
     * This method is useful when the auto-close mechanism is disabled,
     * allowing the consumer to manually close the dialog as needed.
     */
    public close() {
        this.getDialogInstance().close();
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
        if (![ListMode.SingleSelect, ListMode.SingleSelectLeft, ListMode.SingleSelectMaster].includes(table.getMode() as ListMode)) {
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

    private delete(deletedByComponent = false) {
        this.getContext().delete({
            groupId: "$auto"
        }).then(() => {
            BusyIndicator.hide();

            this.fireDeleteSuccess({
                deleted: true,
                data: this.getContext().getObject()
            });

            this.resetDefaultBindingMode();

            if (!deletedByComponent) {
                this.getNavigationProperties().forEach(property => property.deregisterP13n());

                if (this.getAutoCloseOnSuccess()) {
                    this.getDialogGenerator().getDialog().close();
                }
            }
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

    private getComponentRoot() {
        return this.getProperty("componentRoot") as VBox;
    }

    private setComponentRoot(componentRoot: VBox) {
        this.setProperty("componentRoot", componentRoot);
    }
}