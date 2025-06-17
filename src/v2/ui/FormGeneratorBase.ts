import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class FormGeneratorBase extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true
    };

    public abstract generate(): void;
    public abstract getForm(): Control;
    public abstract setForm(form: Control): void;

    protected getFactory() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return parent.getParent() as Factory;
            default:
                return parent as Factory;
        }
    }
}