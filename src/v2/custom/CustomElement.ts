import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import UI5Element from "sap/ui/core/Element";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/CustomElement.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.custom
 */
export default class CustomElement<T extends UI5Element = UI5Element> extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string" },
            element: { type: "object" },
            validator: { type: "function" }
        }
    };

    constructor(settings: Settings<T>) {
        super(settings as $ManagedObjectSettings);
    }

    public async validate() {
        const validator = this.getValidator();

        if (!validator) {
            return true;
        }

        return Promise.resolve(validator.call(this.getFactory().getController(), this.getElement()));
    }

    private getFactory() {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA<NavigationProperty>("ui5.antares.pro.v2.metadata.NavigationProperty")) {
            return parent.getParent() as Factory;
        }

        return parent as Factory;
    }
}