import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/CustomContent.types";

/**
 * @namespace ui5.antares.pro.v2.custom
 */
export default class CustomContent extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            content: { type: "object" },
            index: { type: "int", defaultValue: 999 }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }
}