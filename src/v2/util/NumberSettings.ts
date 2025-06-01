import ManagedObject from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { INumberSettings } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";

/**
 * @namespace ui5.antares.pro.v2.util
 */
export default class NumberSettings extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public static prepare(settings?: INumberSettings) {
        if (!settings) {
            return;
        }

        const newSettings: INumberSettings = {
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