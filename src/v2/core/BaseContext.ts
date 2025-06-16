import ManagedObject from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";

/**
 * @namespace ui5.antares.pro.v2.core
 */
export default abstract class BaseContext extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            controller: { type: "object" },
            view: { type: "object", visibility: "hidden" },
            component: { type: "object", visibility: "hidden" },
            entitySet: { type: "string" },
            entitySetPath: { type: "string", visibility: "hidden" },
            modelRef: { type: "any", visibility: "public" },
            deferredGroupId: { type: "string", visibility: "public", defaultValue: "ui5AntaresPro" },
            consumerBindingMode: { type: "string", visibility: "hidden" }
        }
    };

    constructor() {
        super();
    }
}