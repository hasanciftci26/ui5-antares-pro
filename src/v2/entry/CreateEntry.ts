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
        this.getDialogGenerator().attachSubmitted(this.onSubmit, this);
        this.getDialogGenerator().attachClosed(this.onClose, this);
    }

    public async execute(initialData?: EntityT) {
        BusyIndicator.show(0);

        const context = await this.createContext(initialData);
        this.setContext(context);
        await this.generate();

        BusyIndicator.hide();
    }

    private async createContext(initialData?: EntityT) {
        await this.getODataModel().getMetaModel().loaded();

        return this.getODataModel().createEntry(this.getEntitySetPath(), {
            groupId: this.getDeferredGroupId(),
            properties: initialData
        }) as Context;
    }

    private onSubmit(event: DialogGenerator$SubmittedEvent) {
        event.getParameter("dialog");
    }

    private onClose(event: DialogGenerator$ClosedEvent) {
        if (this.getODataModel().hasPendingChanges(true)) {
            this.getODataModel().resetChanges([this.getContext().getPath()], true, true);
        }
    }
}