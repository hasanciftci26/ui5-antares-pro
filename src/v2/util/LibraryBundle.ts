import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ManagedObject from "sap/ui/base/ManagedObject";
import Lib from "sap/ui/core/Lib";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";

/**
 * @namespace ui5.antares.pro.v2.util
 */
export default class LibraryBundle extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public static getText(key: string, parameters?: any[]) {
        const bundle = Lib.getResourceBundleFor("ui5.antares.pro");

        if (bundle instanceof ResourceBundle === false) {
            throw new Error("Library Bundle was not loaded.");
        }

        const text = bundle.getText(key, parameters, true);

        if (!text) {
            throw new Error("Library text with the following key was not found: " + key);
        }

        return text;
    }
}