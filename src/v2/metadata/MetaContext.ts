import ManagedObject from "sap/ui/base/ManagedObject";
import { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { NavigationInfo } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * @namespace ui5.antares.pro.v2.metadata
 */
export default class MetaContext extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    public static async getNavigationInfo(model: ODataModel, ownerEntitySet: string, navigationProperty: string): Promise<NavigationInfo> {
        const metaModel = model.getMetaModel();
        await metaModel.loaded();
        const entitySet = metaModel.getODataEntitySet(ownerEntitySet, false) as EntitySet;
        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType;
        const association = metaModel.getODataAssociationEnd(entityType, navigationProperty);

        if (!association) {
            throw new Error(`Navigation Property: ${navigationProperty} was not found in the Entity Set: ${ownerEntitySet}.`);
        }

        return {
            entitySet: association.role,
            multiplicity: association.multiplicity === "*" ? "Many" : "One"
        };
    }

    public async load() {
        const entityType = await this.getMetaModelEntityType();
    }

    private async getMetaModelEntityType() {
        const metaModel = await this.getMetaModel();
        const entitySet = await this.getMetaModelEntitySet();
        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType | null | undefined;

        if (!entityType) {
            throw new Error(`Entity Type for the Entity Set: ${this.getOwnerParent().getEntitySet()} was not found.`);
        }

        return entityType;
    }

    private async getMetaModelEntitySet() {
        const metaModel = await this.getMetaModel();
        const entitySet = metaModel.getODataEntitySet(this.getOwnerParent().getEntitySet(), false) as EntitySet | null | undefined;

        if (!entitySet) {
            throw new Error(`Entity Set: ${this.getOwnerParent().getEntitySet()} was not found.`);
        }

        return entitySet;
    }

    private async getMetaModel() {
        const metaModel = this.getFactory().getODataModel().getMetaModel();
        await metaModel.loaded();
        return metaModel;
    }

    private getOwnerParent() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return parent as NavigationProperty;
            default:
                return parent as Factory;
        }
    }

    private getFactory() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return parent.getParent() as Factory;
            default:
                return parent as Factory;
        }
    }
}