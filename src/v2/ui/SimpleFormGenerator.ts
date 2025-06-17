import ManagedObject from "sap/ui/base/ManagedObject";
import { ClassMetadata, FormGenerator } from "ui5/antares/pro/types/Global.types";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SimpleFormGenerator extends ManagedObject implements FormGenerator {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            form: { type: "object" }
        }
    };

    public generate() {

    }
}