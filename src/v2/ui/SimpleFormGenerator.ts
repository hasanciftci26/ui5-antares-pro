import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SimpleFormGenerator extends FormGeneratorBase {
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