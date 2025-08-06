import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Context from "sap/ui/model/odata/v2/Context";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { SubmitChangesResponse } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import { DialogGenerator$ClosedEvent, DialogGenerator$SubmittedEvent } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import ResponseParser from "ui5/antares/pro/v2/entry/ResponseParser";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import ResponsiveTable from "sap/m/Table";
import GridTable from "sap/ui/table/Table";
import SmartTable from "sap/ui/comp/smarttable/SmartTable";
import { ListMode } from "sap/m/library";
import { SelectionMode } from "sap/ui/table/library";
import VBox from "sap/m/VBox";

/**
 * Facilitates the update of an existing entity using the provided OData V2 model.
 *
 * This class is designed to generate a form-based UI for modifying persisted entities
 * from a specified **EntitySet**. Consumers are required to provide the target entity
 * and configuration details via the constructor or setter methods through the created instance.
 *
 * Depending on the configuration, the library automatically generates either a **dialog**
 * (for modal interaction) or a **component** (for embedded integration), which includes:
 *
 * - Pre-filled form controls corresponding to the entity’s current values
 * - Generated controls for each updatable property (e.g., Input, DatePicker)
 * - Support for navigation properties, including both 1:1 forms and 1:N tables
 * - Custom layout and content injection
 * - Built-in support for **value helps**, **validation logic**, and **required field checks**
 *
 * Upon submission, the library:
 * - Validates the user-modified data
 * - Runs any configured custom validation logic
 * - Submits the updated entity using a **PATCH** or **MERGE** request via the ODataModel
 * - Automatically displays error messages or uses consumer-defined ones
 * - Fires events to signal **successful** or **failed** updates
 *
 * This class encapsulates the complexity of update flows by providing
 * a structured, configurable, and reusable mechanism for entity editing.
 * 
 * @namespace ui5.antares.pro.v2.entry
 */
export default class UpdateEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            beforeSubmit: { type: "function" },
            contextFound: { type: "boolean", visibility: "hidden" },
            componentRoot: { type: "object", visibility: "hidden" }
        },
        events: {
            submitSuccess: {
                parameters: {
                    data: { type: "object" },
                    response: { type: "object" }
                }
            },
            submitError: {
                parameters: {
                    response: { type: "object" }
                }
            }
        }
    };

    constructor(settings: Settings) {
        super(settings, "Update");

        // Attach events
        this.getDialogGenerator().attachSubmitted(this.onDialogSubmit, this);
        this.getDialogGenerator().attachClosed(this.onDialogClose, this);
    }

    /**
     * Initiates the update process by extracting the context of the existing entity based on the provided reference,
     * then generates and opens the dialog for editing.
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
     * Initializes the update process in Component mode by extracting the context of the existing entity based on the provided reference,
     * and rendering the update UI inside the specified container. 
     * This method is intended for internal use only and **must not be called by the consumer**.
     * 
     * The reference to extract the context follows the same rules as the dialog mode run method:
     * - An instance of sap.ui.model.odata.v2.Context.
     * - Key values of the entity for a read request.
     * - A string representing a table ID to derive the selected row context.
     * 
     * If the context is not found, the method returns early without rendering.
     * 
     * @param container The VBox container in which the update UI will be rendered.
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
     * Submits the updated entity data to the backend.
     *
     * This method is intended to be used **only in Component mode**, where no default submission buttons
     * are generated by the library. The consumer is responsible for creating and managing their own button,
     * and must call this method programmatically to trigger the submission process.
     *
     * The following operations are performed internally:
     *
     * - A global busy indicator is shown during the entire process.
     * - All generated forms are validated. If validation fails, a localized error **MessageBox** is displayed.
     * - If a **beforeSubmit** callback is defined by the consumer, it is executed. If the callback returns **false**, the process is stopped.
     * - If all validations and checks pass, the entity update is submitted to the backend.
     *
     * The library automatically fires **submitSuccess** or **submitError** events based on the result of the submission.
     */
    public async commit() {
        BusyIndicator.show(0);

        const formValidation = await this.validateForms();

        if (!formValidation) {
            BusyIndicator.hide();
            MessageBox.error(this.getValidationErrorMessage());
            return;
        }

        const beforeSubmit = this.getBeforeSubmit();

        if (beforeSubmit) {
            const proceed = await Promise.resolve(beforeSubmit.call(this.getController(), this.getContext()));

            if (!proceed) {
                BusyIndicator.hide();
                return;
            }
        }

        this.submit(true);
    }

    /**
     * Re-initializes the component by extracting and setting the context of an existing persisted entity
     * within the ODataModel.
     *
     * This method is designed for use in **Component mode**, where the **UpdateEntry** instance is maintained
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
     * after a successful submission.
     *
     * @returns The generated Dialog instance.
     */
    public getDialogInstance() {
        return this.getDialogGenerator().getDialog();
    }

    /**
     * Resets any pending changes on the existing persisted entity within the ODataModel.
     *
     * This method is intended for use in **Component mode** to discard unsaved modifications
     * that may exist when the user navigates away or cancels the update operation without submitting.
     * 
     * Invoking this method ensures that any pending changes on the entity are discarded,
     * preventing conflicts during subsequent submissions or model operations.
     *
     * Additionally, the default binding mode is restored.
     */
    public reset() {
        this.resetDefaultBindingMode();

        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().resetChanges([this.getContext().getPath()]);
        }
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

        const formValidation = await this.validateForms();

        if (!formValidation) {
            BusyIndicator.hide();
            MessageBox.error(this.getValidationErrorMessage());
            return;
        }

        const beforeSubmit = this.getBeforeSubmit();

        if (beforeSubmit) {
            const proceed = await Promise.resolve(beforeSubmit.call(this.getController(), this.getContext()));

            if (!proceed) {
                BusyIndicator.hide();
                return;
            }
        }

        this.submit();
    }

    private onDialogClose(event: DialogGenerator$ClosedEvent) {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().resetChanges([this.getContext().getPath()], true, true);
        }

        this.getNavigationProperties().forEach(property => property.deregisterP13n());
        this.resetDefaultBindingMode();
    }

    private async validateForms() {
        const validations: boolean[] = [true];
        const mainFormGenerator = this.getFormGenerator();
        const navigationProperties = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");

        validations.push(await mainFormGenerator.validate());

        for (const property of navigationProperties) {
            validations.push(await property.validate());
        }

        return validations.every(validation => validation);
    }

    private submit(submittedByComponent = false) {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().submitChanges({
                success: (response?: SubmitChangesResponse) => {
                    BusyIndicator.hide();

                    const parser = new ResponseParser(response);
                    parser.parse();

                    if (parser.status === "Success") {
                        this.fireSubmitSuccess({
                            submitted: true,
                            data: parser.data,
                            response: parser.response
                        });

                        this.resetDefaultBindingMode();

                        if (!submittedByComponent) {
                            this.getNavigationProperties().forEach(property => property.deregisterP13n());

                            if (this.getAutoCloseOnSuccess()) {
                                this.getDialogGenerator().getDialog().close();
                            }
                        }
                    } else {
                        this.fireSubmitError({
                            response: parser.response
                        });

                        if (parser.errorMessage && this.getShowErrorMessageBox()) {
                            MessageBox.error(parser.errorMessage);
                        }
                    }
                },
                error: (err?: Record<string, any>) => {
                    BusyIndicator.hide();

                    const parser = new ResponseParser();
                    parser.parseError(err);

                    this.fireSubmitError({
                        response: err
                    });

                    if (parser.errorMessage && this.getShowErrorMessageBox()) {
                        MessageBox.error(parser.errorMessage);
                    }
                }
            });
        } else {
            this.resetDefaultBindingMode();

            if (!submittedByComponent) {
                this.getNavigationProperties().forEach(property => property.deregisterP13n());
                this.getDialogGenerator().getDialog().close();
            }
        }
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