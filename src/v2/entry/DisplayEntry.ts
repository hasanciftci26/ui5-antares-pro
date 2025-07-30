import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Context from "sap/ui/model/odata/v2/Context";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { DialogGenerator$ClosedEvent } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import ResponsiveTable from "sap/m/Table";
import GridTable from "sap/ui/table/Table";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import { ListMode } from "sap/m/library";
import { SelectionMode } from "sap/ui/table/library";
import VBox from "sap/m/VBox";

/**
 * Displays the details of an existing entity in a read-only format using the provided OData V2 model.
 *
 * The **DisplayEntry** class is intended for use cases where an entity’s data must be presented
 * to the end user without allowing any modifications. It provides a clean, consistent, and
 * fully read-only UI for inspecting the contents of a specific **EntitySet**.
 *
 * Depending on the configuration, the library generates either a **dialog** or a **component**
 * that includes:
 *
 * - Pre-filled, read-only form controls representing the entity’s current values
 * - Display of associated navigation properties, including both 1:1 and 1:N relationships
 * - Optional integration of custom layout and additional content elements
 *
 * No user interaction or submission is required. The content is rendered for informational purposes only.
 *
 * This class is ideal for detail views or entity inspection scenarios where data integrity
 * must be preserved while still allowing full visibility into the entity's structure.
 * 
 * @namespace ui5.antares.pro.v2.entry
 */
export default class DisplayEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            contextFound: { type: "boolean", visibility: "hidden" },
            componentRoot: { type: "object", visibility: "hidden" }
        }
    };

    constructor(settings: Settings) {
        super(settings, "Read");

        // Attach events
        this.getDialogGenerator().attachClosed(this.onDialogClose, this);
    }

    /**
     * Initiates the display process by extracting the context of the existing entity based on the provided reference,
     * then generates and opens the dialog for read-only viewing of the entity data.
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
     * The generated dialog contains the extracted entity data in a read-only mode to prevent any modifications.
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
     * Initializes the display process in Component mode by extracting the context of the existing entity based on the provided reference,
     * and rendering the read-only display UI inside the specified container.
     * This method is intended for internal use only and **must not be called by the consumer**.
     * 
     * The reference to extract the context follows the same rules as the dialog mode run method:
     * - An instance of sap.ui.model.odata.v2.Context.
     * - Key values of the entity for a read request.
     * - A string representing a table ID to derive the selected row context.
     * 
     * If the context is not found, the method returns early without rendering.
     * 
     * @param container The VBox container in which the display UI will be rendered.
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
     * Re-initializes the component by extracting and setting the context of an existing persisted entity
     * within the ODataModel.
     *
     * This method is designed for use in **Component mode**, where the **DisplayEntry** instance is maintained
     * throughout the component's lifecycle. It enables the reuse of the same component container
     * to load a different entity without reinstantiating the entire component.
     *
     * The following operations are performed:
     *
     * - A global busy indicator is shown during the process.
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
        await this.extractContext(ref);
        this.getComponentRoot().setBindingContext(this.getContext());
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

    private onDialogClose(event: DialogGenerator$ClosedEvent) {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().resetChanges([this.getContext().getPath()], true, true);
        }

        this.getNavigationProperties().forEach(property => property.deregisterP13n());
        this.resetDefaultBindingMode();
    }

    private getContextFound() {
        return this.getProperty("contextFound") as boolean;
    }

    private setContextFound(contextFound: boolean) {
        this.setProperty("contextFound", contextFound);
    }

    private getComponentRoot() {
        return this.getProperty("componentRoot") as VBox;
    }

    private setComponentRoot(componentRoot: VBox) {
        this.setProperty("componentRoot", componentRoot);
    }
}