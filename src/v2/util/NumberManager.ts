import ManagedObject from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { NumberSettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

/**
 * @namespace ui5.antares.pro.v2.util
 */
export default class NumberManager extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public static prepare(settings?: NumberSettings) {
        if (!settings) {
            return;
        }

        const newSettings: NumberSettings = {
            groupingEnabled: settings.groupingEnabled,
            groupingSize: settings.groupingSize
        };

        if (settings.groupingSeparator && settings.groupingSeparator === settings.decimalSeparator) {
            throw new Error("Grouping Separator and Decimal Separator cannot be identical.");
        }

        if (settings.groupingSeparator && settings.decimalSeparator) {
            newSettings.groupingSeparator = settings.groupingSeparator;
            newSettings.decimalSeparator = settings.decimalSeparator;
        } else if (settings.groupingSeparator) {
            newSettings.groupingSeparator = settings.groupingSeparator;
            newSettings.decimalSeparator = newSettings.groupingSeparator === "." ? "," : ".";
        } else if (settings.decimalSeparator) {
            newSettings.decimalSeparator = settings.decimalSeparator;
            newSettings.groupingSeparator = newSettings.decimalSeparator === "." ? "," : ".";
        }

        if (Object.values(newSettings).every(value => value == null)) {
            return;
        }

        return newSettings;
    }
}