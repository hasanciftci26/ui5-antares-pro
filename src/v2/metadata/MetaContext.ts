import ManagedObject from "sap/ui/base/ManagedObject";
import { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import {
    EntityProperty,
    MetaContextOwner,
    MetaModelProperty,
    NavigationInfo,
    PropertyDisplayFormat
} from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import LabelGenerator from "ui5/antares/pro/v2/util/LabelGenerator";

/**
 * @namespace ui5.antares.pro.v2.metadata
 */
export default class MetaContext extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entityProperties: { type: "object[]", defaultValue: [] }
        },
        aggregations: {
            labelGenerator: {
                type: "ui5.antares.pro.v2.util.LabelGenerator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor() {
        super();
        this.setLabelGenerator(new LabelGenerator());
    }

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
        const properties: EntityProperty[] = [];

        if (!entityType.property) {
            throw new Error("No property was found for the Entity Set: " + this.getOwnerParent().getEntitySet());
        }

        for (const property of entityType.property as MetaModelProperty[]) {
            if (this.isPropertyExcluded(entityType, property)) {
                continue;
            }

            properties.push({
                key: this.isKeyProperty(entityType, property),
                name: property.name,
                type: property.type,
                label: this.getLabelGenerator().generate(property),
                readonly: this.isPropertyReadonly(entityType, property),
                required: this.isPropertyRequired(entityType, property),
                visible: this.isPropertyVisible(entityType, property),
                displayFormat: this.getPropertyDisplayFormat(property),
                precision: this.getPropertyPrecision(property),
                scale: this.getPropertyScale(property),
                maxLength: this.getPropertyMaxLength(property)
            });
        }

        const sortedProperties = this.sortProperties(properties);
        this.setEntityProperties(sortedProperties);
    }

    public getOwnerParent() {
        return this.getParent() as MetaContextOwner;
    }

    public getFactory() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return parent.getParent() as Factory;
            default:
                return parent as Factory;
        }
    }

    private isKeyProperty(entityType: EntityType, property: MetaModelProperty) {
        return entityType.key.propertyRef.some(ref => ref.name === property.name);
    }

    private isPropertyExcluded(entityType: EntityType, property: MetaModelProperty) {
        const factory = this.getFactory();

        if (factory.getKeyEnforcementEnabled() && this.isKeyProperty(entityType, property)) {
            return false;
        }

        return this.getExcludedProperties().includes(property.name);
    }

    private isPropertyReadonly(entityType: EntityType, property: MetaModelProperty) {
        if (property.readOnly === "true") {
            return true;
        }

        const operation = this.getOwnerParent().getOperation();

        switch (operation) {
            case "Read":
            case "Delete":
                return true;
            case "Update":
                if (this.isKeyProperty(entityType, property)) {
                    return true;
                } else {
                    return this.getReadonlyProperties().includes(property.name);
                }
            default:
                return this.getReadonlyProperties().includes(property.name);
        }
    }

    private isPropertyRequired(entityType: EntityType, property: MetaModelProperty) {
        if (property.nullable === "false") {
            return true;
        }

        const operation = this.getOwnerParent().getOperation();

        switch (operation) {
            case "Read":
            case "Delete":
                return false;
            default:
                if (this.isKeyProperty(entityType, property)) {
                    return true;
                } else {
                    return this.getRequiredProperties().includes(property.name);
                }
        }
    }

    private isPropertyVisible(entityType: EntityType, property: MetaModelProperty) {
        if (property.type !== "Edm.Guid") {
            return true;
        }

        const factory = this.getFactory();

        switch (factory.getGuidVisibilityMode()) {
            case "All":
                return true;
            case "Key":
                return this.isKeyProperty(entityType, property);
            case "NonKey":
                return this.isKeyProperty(entityType, property) === false;
            default:
                return false;
        }
    }

    private getPropertyDisplayFormat(property: MetaModelProperty) {
        const displayFormat = property.extensions?.find(ext => ext.name === "display-format");
        return displayFormat?.value as PropertyDisplayFormat | undefined;
    }

    private getPropertyPrecision(property: MetaModelProperty) {
        if (property.type !== "Edm.Decimal") {
            return;
        }

        if (property.precision) {
            return parseInt(property.precision);
        }
    }

    private getPropertyScale(property: MetaModelProperty) {
        if (property.type !== "Edm.Decimal") {
            return;
        }

        if (property.scale) {
            return parseInt(property.scale);
        }
    }

    private getPropertyMaxLength(property: MetaModelProperty) {
        if (property.type === "Edm.String") {
            if (property.maxLength) {
                return parseInt(property.maxLength);
            }
        }
    }

    private getExcludedProperties() {
        const parent = this.getOwnerParent();
        const propertySettings = parent.getPropertySettings();
        return propertySettings.filter(settings => settings.excluded).map(settings => settings.name);
    }

    private getReadonlyProperties() {
        const parent = this.getOwnerParent();
        const propertySettings = parent.getPropertySettings();
        return propertySettings.filter(settings => settings.readonly).map(settings => settings.name);
    }

    private getRequiredProperties() {
        const parent = this.getOwnerParent();
        const propertySettings = parent.getPropertySettings();
        return propertySettings.filter(settings => settings.required).map(settings => settings.name);
    }

    private sortProperties(properties: EntityProperty[]) {
        const parent = this.getOwnerParent();
        const factory = this.getFactory();
        const orderMap = new Map<string, number>();
        let orderIndex = 0;

        if (factory.getKeyEnforcementEnabled()) {
            for (const name of parent.getPropertyOrder()) {
                const prop = properties.find(prop => prop.name === name && prop.key);

                if (prop && !orderMap.has(prop.name)) {
                    orderMap.set(prop.name, orderIndex++);
                }
            }

            for (const prop of properties) {
                if (prop.key && !orderMap.has(prop.name)) {
                    orderMap.set(prop.name, orderIndex++);
                }
            }
        }

        for (const name of parent.getPropertyOrder()) {
            if (!orderMap.has(name)) {
                orderMap.set(name, orderIndex++);
            }
        }

        for (const prop of properties) {
            if (!orderMap.has(prop.name)) {
                orderMap.set(prop.name, orderIndex++);
            }
        }

        return [...properties].sort((a, b) => {
            return (orderMap.get(a.name) ?? Infinity) - (orderMap.get(b.name) ?? Infinity);
        });
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

    private getLabelGenerator() {
        return this.getAggregation("labelGenerator") as LabelGenerator;
    }

    private setLabelGenerator(labelGenerator: LabelGenerator) {
        this.setAggregation("labelGenerator", labelGenerator);
    }
}