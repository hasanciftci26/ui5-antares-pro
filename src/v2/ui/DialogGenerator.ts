import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class DialogGenerator extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            modelName: { type: "string" },
            dialog: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public generate() {

    }
}