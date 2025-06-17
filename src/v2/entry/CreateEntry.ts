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
        super(settings);
    }

    public override async execute<T extends Record<string, any> = Record<string, any>>(initialData?: T) {
        await super.execute();
    }
}