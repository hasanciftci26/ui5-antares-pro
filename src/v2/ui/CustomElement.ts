import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/CustomElement.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class CustomElement extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string", visibility: "public" },
            element: { type: "object", visibility: "public" },
            validator: { type: "function", visibility: "public" }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
    }

    public async validate() {
        const parent = this.getParent() as ContentGenerator;
        const validator = this.getValidator();

        if (!validator) {
            return true;
        }

        return Promise.resolve(validator.call(parent.getController(), this.getElement()));
    }
}