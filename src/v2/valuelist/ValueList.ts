import ManagedObject from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Operation, PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

/**
 * @namespace ui5.antares.pro.v2.valuelist
 */
export default class ValueList extends ManagedObject implements MetaContextOwner {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            localDataProperty: { type: "string" },
            entitySet: { type: "string" },
            propertyOrder: { type: "string[]", defaultValue: [] },
            propertyLabels: { type: "object[]", defaultValue: [] }
        }
    };

    public checkValidity() {

    }

    public getOperation() {
        return "Create" as Operation;
    };

    public getPropertySettings() {
        const settings: PropertySettings[] = this.getPropertyLabels().map((property) => {
            return {
                name: property.name,
                label: property.label
            };
        });

        return settings;
    }
}