import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Context from "sap/ui/model/odata/v2/Context";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
import { ISubmitChangesResponse } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import { DialogGenerator$ClosedEvent, DialogGenerator$SubmittedEvent } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import ResponseParser from "ui5/antares/pro/v2/entry/ResponseParser";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class CreateEntry extends ContentGenerator {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            beforeSubmit: { type: "function", visibility: "public" }
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

    constructor(settings: ISettings) {
        super(settings, "Create");

        // Attach events
        this.getDialogGenerator().attachSubmitted(this.onDialogSubmit, this);
        this.getDialogGenerator().attachClosed(this.onDialogClose, this);
    }

    public async execute<EntityT extends Record<string, any> = Record<string, any>>(initialData?: EntityT) {
        BusyIndicator.show(0);

        const context = await this.createContext<EntityT>(initialData);
        this.setContext(context);

        await this.generate();

        this.addNavPropertiesToContext();
        this.generateGuid();

        BusyIndicator.hide();
    }

    private async createContext<EntityT extends Record<string, any>>(initialData?: EntityT) {
        await this.getODataModel().getMetaModel().loaded();

        return this.getODataModel().createEntry(this.getEntitySetPath(), {
            groupId: this.getDeferredGroupId(),
            properties: initialData,
            expand: this.getNavProperties().join() || undefined
        }) as Context;
    }

    private addNavPropertiesToContext() {
        const children = this.getChildMetaContexts();

        for (const child of children) {
            const navProperty = child.getNavProperty()!;

            if (this.getContext().getProperty(navProperty.name)) {
                continue;
            }

            const path = this.getContext().getPath() + "/" + navProperty.name;

            if (navProperty.multiplicity === "Many") {
                this.getODataModel().setProperty(path, []);
            } else {
                this.getODataModel().setProperty(path, {});
            }
        }
    }

    private generateGuid() {
        const parent = this.getParentMetaContext();
        const guidProperties = parent.getProps().filter(prop => prop.type === "Edm.Guid");

        for (const property of guidProperties) {
            if (this.getContext().getProperty(property.name)) {
                continue;
            }

            const path = this.getContext().getPath() + "/" + property.name;

            switch (this.getGuidGenerationMode()) {
                case "All":
                    this.getODataModel().setProperty(path, window.crypto.randomUUID());
                    break;
                case "Key":
                    if (property.key) {
                        this.getODataModel().setProperty(path, window.crypto.randomUUID());
                    }
                    break;
                case "NonKey":
                    if (!property.key) {
                        this.getODataModel().setProperty(path, window.crypto.randomUUID());
                    }
                    break;
            }
        }
    }

    private async onDialogSubmit(event: DialogGenerator$SubmittedEvent) {
        BusyIndicator.show(0);

        this.correctFixedValueListValues();
        const validation = await this.validate();

        if (!validation) {
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

        this.resetODataBindingMode();
    }

    private correctFixedValueListValues() {
        const data = this.getContext().getObject() as Record<string, any>;

        for (const property in data) {
            if (data[property] === "UI5_ANTARES_PRO_SELECT_EMPTY_KEY" || data[property] === "00000000-0000-0000-0000-000000000000") {
                this.getODataModel().setProperty(this.getContext().getPath() + `/${property}`, null);
            }
        }
    }

    private async validate() {
        const validations: boolean[] = [true];

        if (this.getFormType() === "SimpleForm") {
            for (const generator of this.getSimpleFormGenerators()) {
                validations.push(await generator.validate());
            }
        } else {
            for (const generator of this.getSmartFormGenerators()) {
                validations.push(await generator.validate());
            }
        }

        return validations.every(validation => validation);
    }

    private submit() {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().submitChanges({
                groupId: this.getDeferredGroupId(),
                success: (response?: ISubmitChangesResponse) => {
                    BusyIndicator.hide();

                    const parser = new ResponseParser(response);
                    parser.parse();

                    if (parser.status === "Success") {
                        this.fireSubmitSuccess({
                            submitted: true,
                            data: parser.data,
                            response: parser.response
                        });

                        this.resetODataBindingMode();
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
            this.resetODataBindingMode();
            this.getDialogGenerator().getDialog().close();
        }
    }
}