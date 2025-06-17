import Context from "sap/ui/model/odata/v2/Context";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.entry
 */
export default class CreateEntry extends Factory {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor(settings: Settings) {
        super(settings, "Create");
    }

    public override async execute<T extends Record<string, any> = Record<string, any>>(initialData?: T) {
        await this.createNewEntry(initialData);
        await super.execute();
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
}