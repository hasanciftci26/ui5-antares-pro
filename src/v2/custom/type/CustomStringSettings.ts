import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/type/CustomNumberSettings.types";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomStringSettings extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entityProperty: { type: "object" },
            requiredPropertyError: { type: "string" },
            fieldType: { type: "string", defaultValue: "Non-Smart" },
            validationLogic: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }
}