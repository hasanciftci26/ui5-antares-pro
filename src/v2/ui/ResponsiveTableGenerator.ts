import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
import TableGeneratorBase from "ui5/antares/pro/v2/ui/TableGeneratorBase";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class ResponsiveTableGenerator extends TableGeneratorBase {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            content: { type: "object" },
            table: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings);
    }

    public async generate() {
        this.initialize();
    }
}