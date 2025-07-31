import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/type/CustomNumberSettings.types";

/**
 * **Internal use only.**
 *
 * This class is part of the internal implementation of the **UI5 Antares Pro** library
 * and is not intended for public use or direct consumption.
 *
 * It may change or be removed without notice in future versions.
 *
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomStringSettings extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entityProperty: { type: "object" },
            requiredPropertyError: { type: "string" },
            fieldType: { type: "string", defaultValue: "Non-Smart" },
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