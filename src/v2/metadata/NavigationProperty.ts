import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Settings } from "ui5/antares/pro/types/v2/metadata/NavigationProperty.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/Factory.types";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.metadata
 */
export default class NavigationProperty extends ManagedObject implements MetaContextOwner {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            name: { type: "string" },
            entitySet: { type: "string" },
            multiplicity: { type: "string" },
            propertySettings: { type: "object[]", defaultValue: [] },
            propertyOrder: { type: "string[]", defaultValue: [] },
            operation: { type: "string", visibility: "hidden" },
        },
        aggregations: {
            metaContext: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
        this.setMetaContext(new MetaContext());
    }

    public async load() {
        const parent = this.getOwnerParent();
        const navigationInfo = await MetaContext.getNavigationInfo(parent.getODataModel(), parent.getEntitySet(), this.getName());

        this.setEntitySet(navigationInfo.entitySet);
        this.setMultiplicity(navigationInfo.multiplicity);

        if (navigationInfo.multiplicity === "One") {
            this.setOperation(this.getOwnerParent().getOperation());
            await this.getMetaContext().load();
        }
    }

    public getOperation() {
        return this.getProperty("operation") as Operation;
    }

    private setOperation(operation: Operation) {
        this.setProperty("operation", operation);
    }

    private getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    private setMetaContext(metaContext: MetaContext) {
        this.setAggregation("metaContext", metaContext);
    }

    private getOwnerParent() {
        return this.getParent() as Factory;
    }
}