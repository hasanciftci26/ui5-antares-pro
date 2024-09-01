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
        const newInitialValues = await this.generateRandomGuid(initialValues);
        const context = await this.resolveContext(newInitialValues);

        await this.createContent(context);
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

    private async generateRandomGuid(initialValues?: EntityT): Promise<EntityT | undefined> {
        if (!this.getGuidMode().generate) {
            return initialValues;
        }

        const properties = await this.getEntityProperties();
        const guidProperties = properties.filter(property => property.type === "Edm.Guid");

        if (initialValues) {
            for (const property of guidProperties) {
                if (this.getGuidMode().onlyForKeys && !property.key) {
                    continue;
                }

                if (!initialValues.hasOwnProperty(property.name)) {
                    (initialValues[property.name as keyof typeof initialValues] as string) = window.crypto.randomUUID() as string;
                }
            }

            return initialValues;
        } else {
            if (!guidProperties.length) {
                return;
            } else {
                const newInitialValues = {};

                for (const property of guidProperties) {
                    if (this.getGuidMode().onlyForKeys && !property.key) {
                        continue;
                    }

                    (newInitialValues[property.name as keyof typeof newInitialValues] as string) = window.crypto.randomUUID() as string;
                }

                if (Object.keys(newInitialValues).length) {
                    return newInitialValues as EntityT | undefined;
                } else {
                    return;
                }
            }
        }
    }
}