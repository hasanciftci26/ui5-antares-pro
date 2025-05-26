import ManagedObject from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import Root from "ui5/antares/pro/v2/core/Root";

/**
 * @namespace ui5.antares.pro.v2.metadata
 */
export default class MetaContext extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            primary: { type: "boolean", visibility: "public" }
        }
    };

    constructor(settings: ISettings) {
        super(settings);
    }

    public async load(navigationProperty?: string) {
        const root = this.getParent() as Root;
        const entitySet = root.getEntitySet();
    }
}