import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/validation/ValidationLogic.types";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class ValidationLogic extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string", visibility: "public", defaultValue: "" },
            operator: { type: "string", visibility: "public", defaultValue: "EQ" },
            value1: { type: "any", visibility: "public" },
            value2: { type: "any", visibility: "public" },
            errorMessage: { type: "string", visibility: "public", defaultValue: "" },
            logicalOperator: { type: "string", visibility: "public", defaultValue: "And" },
            conditions: { type: "object[]", visibility: "public", defaultValue: [] }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public evaluate() {
        
    }
}