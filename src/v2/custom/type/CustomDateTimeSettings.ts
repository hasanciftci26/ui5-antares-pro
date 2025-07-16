import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/type/CustomDateTimeSettings.types";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomDateTimeSettings extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entityProperty: { type: "object" },
            requiredPropertyError: { type: "string" },
            fieldType: { type: "string", defaultValue: "Non-Smart" },
            constraints: { type: "object" },
            formatOptions: { type: "object" },
            validationLogic: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public getRequiredPropertyError() {
        const error = this.getProperty("requiredPropertyError") as string;
        return error.replace(/\\\{/g, "{").replace(/\\\}/g, "}");
    }

    public setRequiredPropertyError(error: string) {
        this.setProperty("requiredPropertyError", error);
    }    
}