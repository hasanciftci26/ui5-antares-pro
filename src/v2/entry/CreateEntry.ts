import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Context from "sap/ui/model/odata/v2/Context";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { SubmitChangesResponse } from "ui5/antares/pro/types/v2/entry/ResponseParser.types";
import { DialogGenerator$ClosedEvent, DialogGenerator$SubmittedEvent } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import ResponseParser from "ui5/antares/pro/v2/entry/ResponseParser";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class CreateEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            beforeSubmit: { type: "function" }
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
        super(settings, "Create");

        // Attach events
        this.getDialogGenerator().attachSubmitted(this.onDialogSubmit, this);
        this.getDialogGenerator().attachClosed(this.onDialogClose, this);
    }

    public async run<T extends Record<string, any> = Record<string, any>>(initialData?: T) {
        BusyIndicator.show(0);

        await this.createNewEntry(initialData);
        await super.execute();
        this.addNavigationPropertiesToContext();
        this.setGuidValues();
        this.inheritValues();
        this.setBooleanValues();
        this.getDialogGenerator().getDialog().open();

        BusyIndicator.hide();
    }

    private async createNewEntry(initialData?: Record<string, any>) {
        await this.getODataModel().getMetaModel().loaded();

        const context = this.getODataModel().createEntry("/" + this.getEntitySet(), {
            groupId: this.getDeferredGroupId(),
            properties: initialData,
            expand: this.getNavigationProperties().map(property => property.getName()).join() || undefined
        }) as Context;

        this.setContext(context);
    }

    private addNavigationPropertiesToContext() {
        const navigationProperties = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");

        for (const property of navigationProperties) {
            if (this.getContext().getProperty(property.getName()) == null) {
                this.getODataModel().setProperty(this.getContext().getPath() + "/" + property.getName(), {});
            }
        }
    }

    private setGuidValues() {
        this.setParentGuidValues();
        this.setNavigationGuidValues();
    }

    private setParentGuidValues() {
        const properties = this.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Guid");

        for (const property of properties) {
            const value = this.getContext().getProperty(property.name);

            if (value != null && value !== "") {
                continue;
            }

            switch (this.getGuidGenerationMode()) {
                case "All":
                    this.getODataModel().setProperty(this.getContext().getPath() + "/" + property.name, window.crypto.randomUUID());
                    break;
                case "Key":
                    if (property.key) {
                        this.getODataModel().setProperty(this.getContext().getPath() + "/" + property.name, window.crypto.randomUUID());
                    }
                    break;
                case "NonKey":
                    if (!property.key) {
                        this.getODataModel().setProperty(this.getContext().getPath() + "/" + property.name, window.crypto.randomUUID());
                    }
                    break;
            }
        }
    }

    private setNavigationGuidValues() {
        const navigationProperties = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");

        for (const navigation of navigationProperties) {
            const properties = navigation.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Guid");

            for (const property of properties) {
                const path = navigation.getName() + "/" + property.name;
                const value = this.getContext().getProperty(path);
                const hasInheritance = navigation.getInheritValues().some(inherit => inherit.targetProperty === property.name);

                if ((value != null && value !== "") || hasInheritance) {
                    continue;
                }

                switch (this.getGuidGenerationMode()) {
                    case "All":
                        this.getODataModel().setProperty(this.getContext().getPath() + "/" + path, window.crypto.randomUUID());
                        break;
                    case "Key":
                        if (property.key) {
                            this.getODataModel().setProperty(this.getContext().getPath() + "/" + path, window.crypto.randomUUID());
                        }
                        break;
                    case "NonKey":
                        if (!property.key) {
                            this.getODataModel().setProperty(this.getContext().getPath() + "/" + path, window.crypto.randomUUID());
                        }
                        break;
                }
            }
        }
    }

    private inheritValues() {
        const navigationProperties = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");

        for (const navigation of navigationProperties) {
            const properties = navigation.getMetaContext().getEntityProperties();

            for (const property of properties) {
                const path = navigation.getName() + "/" + property.name;
                const inheritance = navigation.getInheritValues().find(inherit => inherit.targetProperty === property.name);

                if (!inheritance) {
                    continue;
                }

                const originalValue = this.getContext().getProperty(path);
                const parentValue = this.getContext().getProperty(inheritance.parentProperty);

                if ((originalValue != null && originalValue !== "") || (parentValue == null || parentValue === "")) {
                    continue;
                }

                this.getODataModel().setProperty(this.getContext().getPath() + "/" + path, parentValue);
            }
        }
    }

    private setBooleanValues() {
        this.setParentBooleanValues();
        this.setNavigationBooleanValues();
    }

    private setParentBooleanValues() {
        if (!this.getBooleanFalseByDefault()) {
            return;
        }

        const properties = this.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Boolean");

        for (const property of properties) {
            const value = this.getContext().getProperty(property.name);

            if (value != null && value !== "") {
                continue;
            }

            this.getODataModel().setProperty(this.getContext().getPath() + "/" + property.name, false);
        }
    }

    private setNavigationBooleanValues() {
        if (!this.getBooleanFalseByDefault()) {
            return;
        }

        const navigationProperties = this.getNavigationProperties().filter(property => property.getMultiplicity() === "One");

        for (const navigation of navigationProperties) {
            const properties = navigation.getMetaContext().getEntityProperties().filter(property => property.type === "Edm.Boolean");

            for (const property of properties) {
                const path = navigation.getName() + "/" + property.name;
                const value = this.getContext().getProperty(path);

                if (value != null && value !== "") {
                    continue;
                }

                this.getODataModel().setProperty(this.getContext().getPath() + "/" + path, false);
            }
        }
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
}