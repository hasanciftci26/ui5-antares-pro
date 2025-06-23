import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/FormLayout.types";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class FormLayout extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            layoutType: { type: "string", defaultValue: "ResponsiveGridLayout" },
            columnsXL: { type: "int", defaultValue: 1 },
            columnsL: { type: "int", defaultValue: 1 },
            columnsM: { type: "int", defaultValue: 1 },
            labelSpanXL: { type: "int", defaultValue: 12 },
            labelSpanL: { type: "int", defaultValue: 12 },
            labelSpanM: { type: "int", defaultValue: 12 },
            labelSpanS: { type: "int", defaultValue: 12 },
            emptySpanXL: { type: "int", defaultValue: 0 },
            emptySpanL: { type: "int", defaultValue: 0 },
            emptySpanM: { type: "int", defaultValue: 0 },
            emptySpanS: { type: "int", defaultValue: 0 }
        }
    };

    constructor(settings?: Settings) {
        super(settings as $ManagedObjectSettings | undefined);
    }

    public static getDefaultInstance(settings?: Settings) {
        return new FormLayout(settings);
    }
}