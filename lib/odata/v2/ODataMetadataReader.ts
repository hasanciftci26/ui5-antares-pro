import Controller from "sap/ui/core/mvc/Controller";
import ODataMetaModel, { EntitySet, EntityType } from "sap/ui/model/odata/ODataMetaModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ModelManager from "ui5/antares/pro/core/v2/ModelManager";
import { IEntityProperty, PropertyVocabLabelExt } from "ui5/antares/pro/types/odata/v2/ODataMetadataReader";
import LabelGenerator from "ui5/antares/pro/util/LabelGenerator";

/**
 * @namespace ui5.antares.pro.odata.v2
 */
export default abstract class ODataMetadataReader extends ModelManager {
    private entitySetName: string;
    private entitySetPath: string;
    private oDataMetaModel: ODataMetaModel;
    private useMetadataLabels = false;
    private i18nPrefix = "antares";
    private requiredProperties: string[] = [];
    private invisibleProperties: string[] = [];
    private readOnlyProperties: string[] = [];
    private displayOrder: string[] = [];
    private forceKeyPropertiesFirst = true;
    private strictOrder = false;
    private strictKeyEnforcement = true;

    constructor(controller: Controller, entitySetName: string, oDataModelRef?: string | ODataModel) {
        super(controller, oDataModelRef);
        this.entitySetName = entitySetName;
        this.entitySetPath = entitySetName.startsWith("/") ? entitySetName : `/${entitySetName}`;
        this.oDataMetaModel = this.getODataModel().getMetaModel();
    }

    private async getEntitySet() {
        await this.oDataMetaModel.loaded();
        const entitySet = this.oDataMetaModel.getODataEntitySet(this.entitySetName);

        if (!entitySet) {
            throw new Error(this.getLibraryText("noEntitySetDetected", [this.entitySetName]));
        }

        return entitySet as EntitySet;
    }

    private async getEntityType() {
        const entitySet = await this.getEntitySet();
        const entityType = this.oDataMetaModel.getODataEntityType(entitySet.entityType);

        if (!entityType) {
            throw new Error(this.getLibraryText("noEntityTypeDetected", [entitySet.entityType]));
        }

        return entityType as EntityType;
    }

    protected async getEntityProperties(): Promise<IEntityProperty[]> {
        const entityType = await this.getEntityType();
        const properties: IEntityProperty[] = [];

        if (!entityType.property) {
            throw new Error(this.getLibraryText("noEntityPropertyDetected", [this.entitySetName]));
        }

        for (const property of entityType.property) {
            const keyProperty = entityType.key.propertyRef.map(ref => ref.name).includes(property.name);
            let precision, scale, displayFormat, label = property.name;

            // If the strict key enforcement is active, the user is not permitted to exclude the key properties
            if (this.strictKeyEnforcement) {
                if (!keyProperty && this.invisibleProperties.includes(property.name)) {
                    continue;
                }
            } else {
                if (this.invisibleProperties.includes(property.name)) {
                    continue;
                }
            }

            if (property.extensions) {
                const displayFormatExtension = property.extensions.find(ext => ext.name === "display-format");

                if (displayFormatExtension) {
                    displayFormat = displayFormatExtension.value;
                }
            }

            if (this.useMetadataLabels) {
                if (property.extensions) {
                    const labelExtension = property.extensions.find(ext => ext.name === "label");

                    if (labelExtension) {
                        label = labelExtension.value;
                    }
                } else {
                    if (property.hasOwnProperty("com.sap.vocabularies.Common.v1.Label")) {
                        label = (property as PropertyVocabLabelExt)["com.sap.vocabularies.Common.v1.Label"].String;
                    }
                }
            } else {
                const labelGenerator = new LabelGenerator(property.name, this.entitySetName, this.i18nPrefix, this.getResourceBundle());
                label = labelGenerator.generate();
            }

            if (property.type === "Edm.Decimal") {
                precision = property.precision;
                scale = property.scale;
            }

            properties.push({
                key: keyProperty,
                name: property.name,
                type: property.type,
                label: label,
                bindingPathWithModel: this.getPathWithModel(property.name),
                bindingPathWithoutModel: this.getPathWithoutModel(property.name),
                nullable: this.requiredProperties.includes(property.name) ? "false" : property.nullable,
                readonly: this.readOnlyProperties.includes(property.name) ? "true" : property.readOnly,
                precision: precision,
                scale: scale,
                displayFormat: displayFormat
            });
        }

        return this.applyDisplayOrder(properties);
    }

    private applyDisplayOrder(properties: IEntityProperty[]): IEntityProperty[] {
        const sortedProperties: IEntityProperty[] = [];
        const uniqueOrder = Array.from(new Set(this.displayOrder));

        if (!uniqueOrder.length) {
            return properties;
        }

        if (this.forceKeyPropertiesFirst) {
            sortedProperties.push(...properties.filter(property => property.key));
        }

        for (const propertyName of uniqueOrder) {
            const property = properties.find(property => property.name === propertyName);

            // If the property does not exist
            if (!property) {
                continue;
            }

            // If the property is key and was added already above
            if (property.key && this.forceKeyPropertiesFirst) {
                continue;
            }

            sortedProperties.push(property);
        }

        /** 
         * If the user does not force key properties to be first, but the strict key enforcement is active,
         * the key properties that are not part of the display order must be added here
         * */
        if (this.strictKeyEnforcement && !this.forceKeyPropertiesFirst) {
            const keyProperties = properties.filter(property => property.key);
            const addedProperties = sortedProperties.map(property => property.name);

            for (const property of keyProperties) {
                // If the key property was already added, then skip it.
                if (addedProperties.includes(property.name)) {
                    continue;
                }

                sortedProperties.push(property);
            }
        }

        // Strict Order means that the properties that are not specified in the order will not be included into the result set.
        // However, when the order is not strict, the properties that have not been added yet, must be added here.
        if (!this.strictOrder) {
            const addedProperties = sortedProperties.map(property => property.name);

            for (const property of properties) {
                // if the property was already added, then skip it.
                if (addedProperties.includes(property.name)) {
                    continue;
                }

                sortedProperties.push(property);
            }
        }

        return sortedProperties;
    }

    private getPathWithModel(propertyName: string): string {
        const modelName = this.getODataModelName();

        if (modelName) {
            return "{" + modelName + ">" + propertyName + "}";
        } else {
            return "{" + propertyName + "}";
        }
    }

    private getPathWithoutModel(propertyName: string): string {
        return "{" + propertyName + "}";
    }

    protected getEntitySetName() {
        return this.entitySetName;
    }

    protected getEntitySetPath() {
        return this.entitySetPath;
    }

    public enableMetadataLabels() {
        this.useMetadataLabels = true;
    }

    public seti18nPrefix(prefix: string) {
        this.i18nPrefix = prefix;
    }

    public setRequiredProperties(requiredProperties: string[]) {
        this.requiredProperties = requiredProperties;
    }

    public setInvisibleProperties(invisibleProperties: string[]) {
        this.invisibleProperties = invisibleProperties;
    }

    public setReadOnlyProperties(readOnlyProperties: string[]) {
        this.readOnlyProperties = readOnlyProperties;
    }

    public setDisplayOrder(properties: string[], strictOrder = false, forceKeyPropertiesFirst = true) {
        this.displayOrder = properties;
        this.strictOrder = strictOrder;
        this.forceKeyPropertiesFirst = forceKeyPropertiesFirst;
    }

    public setStrictKeyEnforcement(strictKeyEnforcement: boolean) {
        this.strictKeyEnforcement = strictKeyEnforcement;
    }
}