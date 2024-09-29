import Button from "sap/m/Button";
import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Entry from "ui5/antares/pro/entry/v2/Entry";

/**
 * @namespace ui5.antares.pro.entry.v2
 */
export default class EntryCreate<
    EntityT extends Record<string, any> = Record<string, any>,
    EntityKeysT extends Record<string, any> = Record<string, any>
> extends Entry<
    EntityT,
    EntityKeysT
> {
    constructor(controller: Controller, entitySetName: string, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, "Create", oDataModelRef);
    }

    public async create(initialValues?: EntityT) {
        const context = await this.resolveContext(initialValues);

        await this.createControls(context);
        this.addButtons();
        this.getDialog().open();
    }

    private addButtons() {
        this.getDialog().setBeginButton(new Button({
            text: this.getCompleteButtonText(),
            type: this.getCompleteButtonType(),
            press: this.onComplete.bind(this)
        }));

        this.getDialog().setEndButton(new Button({
            text: this.getCloseButtonText(),
            type: this.getCloseButtonType(),
            press: this.onClose.bind(this)
        }));

        this.getDialog().setEscapeHandler(this.onEscapePressed.bind(this));
    }

    private onComplete() {
        this.submit();
    }

    private onClose() {
        this.reset();
        this.closeDialog();
    }

    private onEscapePressed(event: { resolve: Function; reject: Function; }) {
        event.reject();
        this.reset();
        this.closeDialog();
    }
}