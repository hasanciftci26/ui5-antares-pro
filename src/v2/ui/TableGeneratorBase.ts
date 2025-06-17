import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class TableGeneratorBase extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true
    };

    public abstract generate(): void;
    public abstract getContent(): Control;
    public abstract setContent(content: Control): void;
    public abstract getTable(): Control;
    public abstract setTable(content: Control): void;

    protected getFactory() {
        const parent = this.getParent() as NavigationProperty;
        return parent.getParent() as Factory;
    }
}