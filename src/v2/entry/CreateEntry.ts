import BusyIndicator from "sap/ui/core/BusyIndicator";
import Context from "sap/ui/model/odata/v2/Context";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
import { DialogGenerator$ClosedEvent, DialogGenerator$SubmittedEvent } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class CreateEntry<EntityT extends Record<string, any> = Record<string, any>> extends ContentGenerator {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor(settings: ISettings) {
        super(settings, "Create");

        // Attach events
        this.getDialogGenerator().attachSubmitted(this.onDialogSubmit, this);
        this.getDialogGenerator().attachClosed(this.onDialogClose, this);
    }

    public async execute(initialData?: EntityT) {
        BusyIndicator.show(0);

        const context = await this.createContext(initialData);
        this.setContext(context);

        await this.generate();

        this.addNavPropertiesToContext();
        this.generateGuid();

        BusyIndicator.hide();
    }

    private async createContext(initialData?: EntityT) {
        await this.getODataModel().getMetaModel().loaded();

        return this.getODataModel().createEntry(this.getEntitySetPath(), {
            groupId: this.getDeferredGroupId(),
            properties: initialData
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

    private onDialogSubmit(event: DialogGenerator$SubmittedEvent) {
        this.correctFixedValueListValues();
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
            if (data[property] === "UI5_ANTARES_PRO_SELECT_EMPTY_KEY") {
                this.getODataModel().setProperty(this.getContext().getPath() + `/${property}`, null);
            }
        }
    }
}