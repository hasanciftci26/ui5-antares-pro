import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
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
    }

    public async execute(initialData?: EntityT) {
        await this.generate();
    }
}