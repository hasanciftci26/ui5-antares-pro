import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import TableGeneratorBase from "ui5/antares/pro/v2/ui/TableGeneratorBase";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class GridTableGenerator extends TableGeneratorBase {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            content: { type: "object" },
            table: { type: "object" }
        }
    };

    public generate() {

    }
}