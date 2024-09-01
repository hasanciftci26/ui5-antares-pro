import Dialog from "sap/m/Dialog";
import { ButtonType } from "sap/m/library";
import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Content from "ui5/antares/pro/component/v2/Content";
import { EntryType } from "ui5/antares/pro/types/component/v2/Content";
import { IBeforeSubmit, ISubmitSuccess } from "ui5/antares/pro/types/entry/v2/Entry";
import SmartValidator from "ui5/antares/pro/validation/SmartValidator";

/**
 * @namespace ui5.antares.pro.entry.v2
 */
export default abstract class Entry extends Content {
    private context: Context;
    private completeButtonText: string;
    private completeButtonType: ButtonType;
    private closeButtonText: string;
    private closeButtonType: ButtonType;
    private beforeSubmit?: IBeforeSubmit;
    private submitSuccess?: ISubmitSuccess;
    private validationErrorMessage?: string;

    constructor(controller: Controller, entitySetName: string, entryType: EntryType, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, entryType, oDataModelRef);
        this.initializeButtonSettings();
    }

    protected reset() {
        if (this.getODataModel().hasPendingChanges()) {
            this.getODataModel().resetChanges([this.context.getPath()]);
        }
    }

    protected async submit() {
        if (this.getODataModel().hasPendingChanges()) {
            try {
                await this.validateRequiredFields();
            } catch (error) {
                MessageBox.error(this.validationErrorMessage || this.getLibraryText("requiredFailureMessage"));
                return;
            }

            this.callBeforeSubmit();
            BusyIndicator.show(1);

            this.getODataModel().submitChanges({
                success: () => {
                    BusyIndicator.hide();

                    this.callSubmitSuccess();
                },
                error: () => {
                    BusyIndicator.hide();
                }
            });
        }
    }

    protected async resolveContext(): Promise<Context> {
        switch (this.getEntryType()) {
            case "Create":
                this.createEntry();
                break;
            default:
                break;
        }

        return this.context;
    }

    private createEntry() {
        this.context = this.getODataModel().createEntry(this.getEntitySetPath(), {}) as Context;
    }

    private initializeButtonSettings() {
        this.closeButtonText = this.getLibraryText("closeButtonText");
        this.closeButtonType = ButtonType.Default;

        switch (this.getEntryType()) {
            case "Create":
                this.completeButtonText = this.getLibraryText("createButtonText");
                this.completeButtonType = ButtonType.Accept;
                break;
            case "Update":
                this.completeButtonText = this.getLibraryText("updateButtonText");
                this.completeButtonType = ButtonType.Accept;
                break;
            case "Delete":
                this.completeButtonText = this.getLibraryText("deleteButtonText");
                this.completeButtonType = ButtonType.Reject;
                break;
        }
    }

    private async validateRequiredFields() {
        switch (this.getFormType()) {
            case "SmartForm":
                const smartValidator = new SmartValidator(this.getSmartForm());
                await smartValidator.validate();
                break;
            case "SimpleForm":
                break;
        }
    }

    private callBeforeSubmit() {
        if (this.beforeSubmit) {
            this.beforeSubmit.eventHandler.call(this.beforeSubmit.listener, this.context, this.getDialog());
        }
    }

    private callSubmitSuccess() {
        if (this.submitSuccess) {
            this.submitSuccess.eventHandler.call(this.submitSuccess.listener);
        }
    }

    public setCompleteButtonText(text: string) {
        this.completeButtonText = text;
    }

    public getCompleteButtonText() {
        return this.completeButtonText;
    }

    public setCompleteButtonType(type: ButtonType) {
        this.completeButtonType = type;
    }

    public getCompleteButtonType() {
        return this.completeButtonType;
    }

    public setCloseButtonText(text: string) {
        this.closeButtonText = text;
    }

    public getCloseButtonText() {
        return this.closeButtonText;
    }

    public setCloseButtonType(type: ButtonType) {
        this.closeButtonType = type;
    }

    public getCloseButtonType() {
        return this.closeButtonType;
    }

    public attachBeforeSubmit(eventHandler: (context: Context, dialog: Dialog) => void, listener?: object) {
        this.beforeSubmit = {
            eventHandler: eventHandler,
            listener: listener || this.getSourceController()
        };
    }

    public attachSubmitSuccess(eventHandler: () => void, listener?: object) {
        this.submitSuccess = {
            eventHandler: eventHandler,
            listener: listener || this.getSourceController()
        };
    }

    public setValidationErrorMessage(message: string) {
        this.validationErrorMessage = message;
    }
}