import ManagedObject from "sap/ui/base/ManagedObject";
import { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import {
    INavPropertyExtraction,
    INavPropertyExtractionParams,
    IProp,
    ISettings,
    MetaModelProperty,
    PropertyDisplayFormat
} from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/ContentGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import LabelGenerator from "ui5/antares/pro/v2/util/LabelGenerator";

/**
 * @namespace ui5.antares.pro.v2.metadata
 */
export default class MetaContext extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entitySet: { type: "string", visibility: "public" },
            entitySetType: { type: "string", visibility: "public" },
            navProperty: { type: "object", visibility: "public" },
            props: { type: "object[]", visibility: "public", defaultValue: [] }
        },
        aggregations: {
            labelGenerator: {
                type: "ui5.antares.pro.v2.util.LabelGenerator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: ISettings) {
        super(settings);
        this.setLabelGenerator(new LabelGenerator());
    }

    public static async extractNavProperties(params: INavPropertyExtractionParams) {
        const extractions: INavPropertyExtraction[] = [];
        const metaModel = params.model.getMetaModel();

        await metaModel.loaded();

        const entitySet = metaModel.getODataEntitySet(params.entitySet, false) as EntitySet | null | undefined;

        if (!entitySet) {
            throw new Error(`Entity Set: ${params.entitySet} was not found.`);
        }

        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType | null | undefined;

        if (!entityType) {
            throw new Error(`Entity Type for the Entity Set: ${params.entitySet} was not found.`);
        }

        for (const property of params.navProperties) {
            const association = metaModel.getODataAssociationEnd(entityType, property);

            if (association) {
                extractions.push({
                    name: property,
                    entitySet: association.role,
                    multiplicity: association.multiplicity === "*" ? "Many" : "One"
                });
            }
        }

        return extractions;
    }

    public async load() {
        const entityType = await this.getMetaModelEntityType();
        const props: IProp[] = [];

        if (!entityType.property) {
            throw new Error("No property was found for the Entity Set: " + this.getEntitySet());
        }

        for (const property of entityType.property as MetaModelProperty[]) {
            if (this.isPropExcluded(entityType, property)) {
                continue;
            }

            props.push({
                key: this.isKeyProp(entityType, property),
                name: property.name,
                type: property.type,
                label: this.getLabelGenerator().generate(property),
                readonly: this.isPropReadonly(entityType, property),
                required: this.isPropRequired(entityType, property),
                visible: this.isPropVisible(entityType, property),
                displayFormat: this.getPropDisplayFormat(property),
                precision: this.getPropPrecision(property),
                scale: this.getPropScale(property),
                maxLength: this.getPropMaxLength(property)
            });
        }

        const sortedProperties = this.sortProperties(props);
        this.setProps(sortedProperties);
    }

    protected getLabelGenerator() {
        return this.getAggregation("labelGenerator") as LabelGenerator;
    }

    protected setLabelGenerator(labelGenerator: LabelGenerator) {
        this.setAggregation("labelGenerator", labelGenerator);
    }

    protected destroyLabelGenerator() {
        this.destroyAggregation("labelGenerator");
    }

    private async getMetaModelEntityType() {
        const metaModel = await this.getMetaModel();
        const entitySet = await this.getMetaModelEntitySet();
        const entityType = metaModel.getODataEntityType(entitySet.entityType, false) as EntityType | null | undefined;

        if (!entityType) {
            throw new Error(`Entity Type for the Entity Set: ${this.getEntitySet()} was not found.`);
        }

        return entityType;
    }

    private async getMetaModelEntitySet() {
        const metaModel = await this.getMetaModel();
        const entitySet = metaModel.getODataEntitySet(this.getEntitySet(), false) as EntitySet | null | undefined;

        if (!entitySet) {
            throw new Error(`Entity Set: ${this.getEntitySet()} was not found.`);
        }

        return entitySet;
    }

    private async getMetaModel() {
        const parent = this.getOwnerContentGenerator();
        const model = parent.getODataModel();
        const metaModel = model.getMetaModel();

        await metaModel.loaded();
        return metaModel;
    }

    private isKeyProp(entityType: EntityType, property: MetaModelProperty) {
        return entityType.key.propertyRef.some(ref => ref.name === property.name);
    }

    private isPropExcluded(entityType: EntityType, property: MetaModelProperty) {
        const parent = this.getOwnerContentGenerator();

        if (parent.getKeyEnforcementEnabled() && this.isKeyProp(entityType, property)) {
            return false;
        }

        return this.getExcludedProperties().includes(property.name);
    }

    private isPropReadonly(entityType: EntityType, property: MetaModelProperty) {
        const parent = this.getOwnerContentGenerator();
        const operation = parent.getProperty("operation") as Operation;

        switch (operation) {
            case "Read":
            case "Delete":
                return true;
            case "Update":
                if (this.isKeyProp(entityType, property)) {
                    return true;
                } else {
                    return this.getReadonlyProperties().includes(property.name);
                }
            default:
                return this.getReadonlyProperties().includes(property.name);
        }
    }

    private isPropRequired(entityType: EntityType, property: MetaModelProperty) {
        const parent = this.getOwnerContentGenerator();
        const operation = parent.getProperty("operation") as Operation;

        switch (operation) {
            case "Read":
            case "Delete":
                return false;
            default:
                if (this.isKeyProp(entityType, property)) {
                    return true;
                } else {
                    return this.getRequiredProperties().includes(property.name);
                }
        }
    }

    private isPropVisible(entityType: EntityType, property: MetaModelProperty) {
        if (property.type !== "Edm.Guid") {
            return true;
        }

        const parent = this.getOwnerContentGenerator();

        switch (parent.getGuidVisibilityMode()) {
            case "All":
                return true;
            case "Key":
                return this.isKeyProp(entityType, property);
            case "NonKey":
                return this.isKeyProp(entityType, property) === false;
            default:
                return false;
        }
    }

    private getPropDisplayFormat(property: MetaModelProperty) {
        const displayFormat = property.extensions?.find(ext => ext.name === "display-format");
        return displayFormat?.value as PropertyDisplayFormat | undefined;
    }

    private getPropPrecision(property: MetaModelProperty) {
        if (property.type !== "Edm.Decimal") {
            return;
        }

        if (property.precision) {
            return parseInt(property.precision);
        }
    }

    private getPropScale(property: MetaModelProperty) {
        if (property.type !== "Edm.Decimal") {
            return;
        }

        if (property.scale) {
            return parseInt(property.scale);
        }
    }

    private getPropMaxLength(property: MetaModelProperty) {
        if (property.type === "Edm.String") {
            if (property.maxLength) {
                return parseInt(property.maxLength);
            }
        }
    }

    private getExcludedProperties() {
        const parent = this.getOwnerContentGenerator();
        const propertySettings = parent.getPropertySettings();

        if (this.getEntitySetType() === "Parent") {
            return propertySettings.filter(prop => prop.excluded && prop.name.includes("/") === false).map(prop => prop.name);
        } else {
            const excludedProperties = propertySettings.filter(
                prop => prop.excluded && prop.name.startsWith(this.getNavProperty()!.name + "/")
            );

            return excludedProperties.map(prop => prop.name.split("/")[1]);
        }
    }

    private getReadonlyProperties() {
        const parent = this.getOwnerContentGenerator();
        const propertySettings = parent.getPropertySettings();

        if (this.getEntitySetType() === "Parent") {
            return propertySettings.filter(prop => prop.readonly && prop.name.includes("/") === false).map(prop => prop.name);
        } else {
            const readonlyProperties = propertySettings.filter(
                prop => prop.readonly && prop.name.startsWith(this.getNavProperty()!.name + "/")
            );

            return readonlyProperties.map(prop => prop.name.split("/")[1]);
        }
    }

    private getRequiredProperties() {
        const parent = this.getOwnerContentGenerator();
        const propertySettings = parent.getPropertySettings();

        if (this.getEntitySetType() === "Parent") {
            return propertySettings.filter(prop => prop.required && prop.name.includes("/") === false).map(prop => prop.name);
        } else {
            const requiredProperties = propertySettings.filter(
                prop => prop.required && prop.name.startsWith(this.getNavProperty()!.name + "/")
            );

            return requiredProperties.map(prop => prop.name.split("/")[1]);
        }
    }

    private getPropertyOrder() {
        const parent = this.getOwnerContentGenerator();

        if (this.getEntitySetType() === "Parent") {
            return parent.getPropertyOrder().filter(prop => prop.includes("/") === false);
        } else {
            const propertyOrder = parent.getPropertyOrder().filter(
                prop => prop.startsWith(this.getNavProperty()!.name + "/")
            );

            return propertyOrder.map(prop => prop.split("/")[1]);
        }
    }

    private sortProperties(props: IProp[]) {
        const parent = this.getOwnerContentGenerator();
        const orderMap = new Map<string, number>();
        let orderIndex = 0;

        if (parent.getKeyEnforcementEnabled()) {
            for (const name of this.getPropertyOrder()) {
                const prop = props.find(prop => prop.name === name && prop.key);

                if (prop && !orderMap.has(prop.name)) {
                    orderMap.set(prop.name, orderIndex++);
                }
            }

            for (const prop of props) {
                if (prop.key && !orderMap.has(prop.name)) {
                    orderMap.set(prop.name, orderIndex++);
                }
            }
        }

        for (const name of this.getPropertyOrder()) {
            if (!orderMap.has(name)) {
                orderMap.set(name, orderIndex++);
            }
        }

        for (const prop of props) {
            if (!orderMap.has(prop.name)) {
                orderMap.set(prop.name, orderIndex++);
            }
        }

        return [...props].sort((a, b) => {
            return (orderMap.get(a.name) ?? Infinity) - (orderMap.get(b.name) ?? Infinity);
        });
    }

    private getOwnerContentGenerator() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.valuelist.ValueList":
                return parent.getParent() as ContentGenerator;
            default:
                return parent as ContentGenerator;
        }
    }
}