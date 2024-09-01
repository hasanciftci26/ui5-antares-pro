import Dialog from "sap/m/Dialog";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ODataMetadataReader from "ui5/antares/pro/odata/v2/ODataMetadataReader";
import { FormType, EntryType } from "ui5/antares/pro/types/component/v2/Content";

/**
 * @namespace ui5.antares.pro.component.v2
 */
export default abstract class Content extends ODataMetadataReader {
    private formType: FormType = "SmartForm";
    private dialog: Dialog;
    private smartForm: SmartForm;
    private dialogTitle: string;
    private entryType: EntryType;

    constructor(controller: Controller, entitySetName: string, entryType: EntryType, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, oDataModelRef);
        this.entryType = entryType;
        this.createDialogTitle();
    }

    protected async createContent(context: Context): Promise<Dialog> {
        this.createDialog();

        switch (this.formType) {
            case "SimpleForm":
                break;
            case "SmartForm":
                await this.createSmartForm();
                this.dialog.addContent(this.smartForm);
                break;
        }

        this.dialog.setModel(this.getODataModel());
        this.dialog.setBindingContext(context);
        return this.dialog;
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
        const properties = await this.getEntityProperties();
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

            groupElements.push(new GroupElement({
                label: property.label,
                elements: smartField
            }));
        }

        return groupElements;
    }

    protected getEntryType(): EntryType {
        return this.entryType;
    }

    protected getSmartForm(): SmartForm {
        return this.smartForm;
    }

    public setFormType(formType: FormType) {
        this.formType = formType;
    }

    public setDialogTitle(title: string) {
        this.dialogTitle = title;
    }
}