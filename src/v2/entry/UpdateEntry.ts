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

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class UpdateEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            beforeSubmit: { type: "function" },
            contextFound: { type: "boolean", visibility: "hidden" }
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

    public async run<T extends Record<string, any> = Record<string, any>>(ref: Context | string | T) {
        BusyIndicator.show(0);

        await this.extractContext(ref);
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
        const table = this.getView().byId("tableRef");

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
            MessageBox.error("");
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
            MessageBox.error("");
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
            const parameters: any = {
                groupId: this.getDeferredGroupId()
            };

            this.getODataModel().createBindingContext(path, undefined, parameters, (context: Context | null) => {
                if (context) {
                    this.setContext(context);
                    resolve();
                } else {
                    reject("The BindingContext was not created successfully.");
                }
            });

            this.getODataModel().submitChanges({ groupId: this.getDeferredGroupId() });
        });
    }

    private async onDialogSubmit(event: DialogGenerator$SubmittedEvent) {
        BusyIndicator.show(0);

        this.correctFixedValueListValues();
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

    private correctFixedValueListValues() {
        const data = this.getContext().getObject() as Record<string, any>;

        for (const property in data) {
            if (data[property] === "UI5_ANTARES_PRO_SELECT_EMPTY_KEY" || data[property] === "00000000-0000-0000-0000-000000000000") {
                this.getODataModel().setProperty(this.getContext().getPath() + `/${property}`, null);
            }
        }
    }

    private submit() {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().submitChanges({
                groupId: this.getDeferredGroupId(),
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
                        this.getNavigationProperties().forEach(property => property.deregisterP13n());
                        this.getDialogGenerator().getDialog().close();
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
            this.getNavigationProperties().forEach(property => property.deregisterP13n());
            this.getDialogGenerator().getDialog().close();
        }
    }

    private getContextFound() {
        return this.getProperty("contextFound") as boolean;
    }

    private setContextFound(contextFound: boolean) {
        this.setProperty("contextFound", contextFound);
    }
}