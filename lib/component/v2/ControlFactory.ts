import Dialog from "sap/m/Dialog";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import Control from "sap/ui/core/Control";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ODataMetadataReader from "ui5/antares/pro/odata/v2/ODataMetadataReader";
import { FormType, EntryType, IGuidBehaviour, IFormElement } from "ui5/antares/pro/types/component/v2/ControlFactory";
import { IEntityProperty } from "ui5/antares/pro/types/odata/v2/ODataMetadataReader";

/**
 * @namespace ui5.antares.pro.component.v2
 */
export default abstract class ControlFactory extends ODataMetadataReader {
    private formType: FormType = "SmartForm";
    private dialog: Dialog;
    private smartForm: SmartForm;
    private formElements: IFormElement[] = [];
    private dialogTitle: string;
    private entryType: EntryType;
    private oDataContext: Context;
    private guidBehaviour: IGuidBehaviour = {
        generate: true,
        display: false,
        keys: true,
        properties: []
    };

    constructor(controller: Controller, entitySetName: string, entryType: EntryType, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, oDataModelRef);
        this.entryType = entryType;
        this.createDialogTitle();
    }

    protected async createControls(context: Context) {
        this.oDataContext = context;
        this.createDialog();

        switch (this.formType) {
            case "SmartForm":
                await this.createSmartForm();
                this.dialog.addContent(this.smartForm);
                this.dialog.setModel(this.getODataModel());
                this.dialog.setBindingContext(context);
                break;
            case "SimpleForm":
                this.dialog.setModel(this.getODataModel(), this.getODataModelName());
                this.dialog.setBindingContext(context, this.getODataModelName());
                break;
        }

        this.getSourceView().addDependent(this.dialog);
    }

    private createDialogTitle() {
        switch (this.entryType) {
            case "Create":
                this.dialogTitle = this.getLibraryText("createEntryDialogTitle", [this.getEntitySetName()]);
                break;
            case "Update":
                this.dialogTitle = this.getLibraryText("updateEntryDialogTitle", [this.getEntitySetName()]);
                break;
            case "Delete":
                this.dialogTitle = this.getLibraryText("deleteEntryDialogTitle", [this.getEntitySetName()]);
                break;
            case "Display":
                this.dialogTitle = this.getLibraryText("displayEntryDialogTitle", [this.getEntitySetName()]);
                break;
        }
    }

    private createDialog() {
        this.dialog = new Dialog({
            title: this.dialogTitle,
            draggable: true,
            resizable: true,
            showHeader: true
        });
    }

    private async createSmartForm() {
        const groups = await this.createSmartFormGroups();

        this.smartForm = new SmartForm({
            editTogglable: false,
            editable: this.entryType === "Create" || this.entryType === "Update",
            validationMode: "Async",
            groups: groups
        });
    }

    private async createSmartFormGroups(): Promise<Group> {
        const smartFields = await this.createSmartFields();

        const group = new Group({
            groupElements: smartFields
        });

        return group;
    }

    private async createSmartFields(): Promise<GroupElement[]> {
        const properties = await this.loadEntityProperties();
        const groupElements: GroupElement[] = [];

        for (const property of properties) {
            const smartField = new SmartField({
                value: property.bindingPathWithoutModel,
                mandatory: property.nullable === "false",
                editable: property.readonly !== "true"
            });

            switch (this.entryType) {
                case "Delete":
                case "Display":
                    smartField.setEditable(false);
                    break;
                case "Update":
                    if (property.key) {
                        smartField.setEditable(false);
                    }
                    break;
            }

            if (property.type === "Edm.Guid") {
                this.applyGuidBehaviour(property, smartField);
            }

            groupElements.push(new GroupElement({
                label: property.label,
                elements: smartField
            }));

            this.formElements.push({
                control: smartField,
                property: property,
                standard: true
            });
        }

        return groupElements;
    }

    private applyGuidBehaviour(property: IEntityProperty, control: SmartField) {
        if (this.guidBehaviour.keys) {
            if (property.key && !this.guidBehaviour.display) {
                control.setVisible(false);
            }

            if (property.key && this.guidBehaviour.generate) {
                control.setEditable(false);
                this.generateRandomUUID(property.name);
            }
        } else {
            if (this.guidBehaviour.properties.includes(property.name) && !this.guidBehaviour.display) {
                control.setVisible(false);
            }

            if (this.guidBehaviour.properties.includes(property.name) && this.guidBehaviour.generate) {
                control.setEditable(false);
                this.generateRandomUUID(property.name);
            }
        }
    }

    private generateRandomUUID(propertyName: string) {
        if (this.entryType !== "Create") {
            return;
        }

        const initialEntryContains = this.oDataContext.getProperty(`${propertyName}`) !== undefined;

        if (initialEntryContains) {
            return;
        }

        this.getODataModel().setProperty(this.oDataContext.getPath() + `/${propertyName}`, window.crypto.randomUUID());
    }

    protected getEntryType(): EntryType {
        return this.entryType;
    }

    protected closeDialog() {
        this.dialog.close();
        this.dialog.destroy();
    }

    public getSmartForm(): SmartForm {
        return this.smartForm;
    }

    public getFormElements(): IFormElement[] {
        return this.formElements;
    }

    public setFormType(formType: FormType) {
        this.formType = formType;
    }

    public getFormType() {
        return this.formType;
    }

    public setDialogTitle(title: string) {
        this.dialogTitle = title;
    }

    public getDialog(): Dialog {
        return this.dialog;
    }

    public setGuidBehaviour(generate: boolean, display: boolean, properties: string[] = []) {
        this.guidBehaviour = {
            generate: generate,
            display: display,
            keys: properties.length === 0,
            properties: properties
        };
    }

    public getGuidBehaviour(): IGuidBehaviour {
        return this.guidBehaviour;
    }
}