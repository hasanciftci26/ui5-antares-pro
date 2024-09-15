import { ButtonType } from "sap/m/library";
import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Content from "ui5/antares/pro/component/v2/Content";
import { EntryType } from "ui5/antares/pro/types/component/v2/Content";
import { IBeforeSubmit, ISubmitSuccess, SubmitEventHandler } from "ui5/antares/pro/types/entry/v2/Entry";
import SmartValidator from "ui5/antares/pro/validation/SmartValidator";
import ValidationLogic from "ui5/antares/pro/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.entry.v2
 */
export default abstract class Entry<
    EntityT extends Record<string, any> = Record<string, any>,
    EntityKeysT extends Record<string, any> = Record<string, any>
> extends Content {
    private context: Context;
    private completeButtonText: string;
    private completeButtonType: ButtonType;
    private closeButtonText: string;
    private closeButtonType: ButtonType;
    private beforeSubmit?: IBeforeSubmit;
    private submitSuccess?: ISubmitSuccess;
    private validationErrorMessage?: string;
    private validations: ValidationLogic[] = [];

    constructor(controller: Controller, entitySetName: string, entryType: EntryType, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, entryType, oDataModelRef);
        this.initializeButtonSettings();
        this.enableTwoWayBinding();
    }

    protected reset() {
        if (this.getODataModel().hasPendingChanges()) {
            this.getODataModel().resetChanges([this.context.getPath()]);
        }

        this.resetBindingMode();
    }

    protected async submit() {
        if (this.getODataModel().hasPendingChanges()) {
            try {
                await this.validateRequiredFields();
            } catch (error) {
                MessageBox.error(this.validationErrorMessage || this.getLibraryText("requiredFailureMessage"));
                return;
            }

            BusyIndicator.show(1);
            await this.callBeforeSubmit();

            this.getODataModel().submitChanges({
                success: () => {
                    this.callSubmitSuccess().then(() => {
                        BusyIndicator.hide();
                        this.closeDialog();
                        this.resetBindingMode();
                    });
                },
                error: () => {
                    BusyIndicator.hide();
                }
            });
        } else {
            this.closeDialog();
            this.resetBindingMode();
        }
    }

    protected async resolveContext(initialValues?: EntityT): Promise<Context> {
        switch (this.getEntryType()) {
            case "Create":
                this.createEntry(initialValues);
                break;
            default:
                break;
        }

        return this.context;
    }

    private createEntry(initialValues?: EntityT) {
        this.context = this.getODataModel().createEntry(this.getEntitySetPath(), {
            properties: initialValues
        }) as Context;
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
                const smartValidator = new SmartValidator(this.getSmartForm(), this.getEntityProperties(), this.validations);
                await smartValidator.validate();
                break;
            case "SimpleForm":
                break;
        }
    }

    private async callBeforeSubmit() {
        if (this.beforeSubmit) {
            await Promise.resolve(this.beforeSubmit.eventHandler.call(this.beforeSubmit.listener, this.context, this.getDialog()));
        }
    }

    private async callSubmitSuccess() {
        if (this.submitSuccess) {
            await Promise.resolve(this.submitSuccess.eventHandler.call(this.submitSuccess.listener, this.context, this.getDialog()));
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

    public attachBeforeSubmit(eventHandler: SubmitEventHandler, listener?: object) {
        this.beforeSubmit = {
            eventHandler: eventHandler,
            listener: listener || this.getSourceController()
        };
    }

    public attachSubmitSuccess(eventHandler: SubmitEventHandler, listener?: object) {
        this.submitSuccess = {
            eventHandler: eventHandler,
            listener: listener || this.getSourceController()
        };
    }

    public setValidationErrorMessage(message: string) {
        this.validationErrorMessage = message;
    }

    public addValidationLogic(validation: ValidationLogic) {
        validation.validateInitialSettings();
        this.validations.push(validation);
    }
}