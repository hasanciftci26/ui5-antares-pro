import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ManagedObject from "sap/ui/base/ManagedObject";
import Lib from "sap/ui/core/Lib";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";

/**
 * @namespace ui5.antares.pro.v2.util
 */
export default class LibraryBundle extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public static getText(key: string, parameters?: (string | number | boolean)[]) {
        const bundle = Lib.getResourceBundleFor("ui5.antares.pro");

        if (bundle instanceof ResourceBundle === false) {
            return;
        }

        if (bundle.hasText(key)) {
            return bundle.getText(key, parameters);
        }
    }
}