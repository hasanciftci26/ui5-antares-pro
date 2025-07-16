import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/type/CustomFilterBarSettings.types";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomFilterBarSettings extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entityProperty: { type: "object" },
            dateTimeSettings: { type: "object" },
            numberSettings: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }   
}