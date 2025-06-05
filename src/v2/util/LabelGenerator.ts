import ManagedObject from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { MetaModelProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

/**
 * @namespace ui5.antares.pro.v2.util
 */
export default class LabelGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public generate(property: MetaModelProperty) {
        const parent = this.getParent() as MetaContext;
        const content = this.getOwnerContentGenerator();
        const entitySet = parent.getEntitySet();
        const propertyLabel = content.getPropertyLabels().find(prop => prop.name === property.name)?.label;

        if (content.getMetadataLabelEnabled()) {
            const labelExtension = property.extensions?.find(ext => ext.name === "label")?.value;
            const labelAnnotation = property["com.sap.vocabularies.Common.v1.Label"]?.String;

            return labelAnnotation || labelExtension || propertyLabel || property.name;
        } else {
            const bundleKey = "ui5AntaresPro." + entitySet + "." + property.name;
            const bundleLabel = content.getConsumerBundleText(bundleKey);
            const result = this.labelize(property.name);

            return propertyLabel || bundleLabel || result;
        }
    }

    private labelize(propertyName: string) {
        const casing = this.getPropertyCasing(propertyName);

        switch (casing) {
            case "CamelCase":
                return this.labelizeCamelCase(propertyName);
            case "PascalCase":
                return this.labelizePascalCase(propertyName);
            case "ConstantCase":
                return this.labelizeConstantCase(propertyName);
            case "SnakeCase":
                return this.labelizeSnakeCase(propertyName);
            case "KebabCase":
                return this.labelizeKebabCase(propertyName);
            default:
                return propertyName;
        }
    }

    private getPropertyCasing(propertyName: string) {
        if (this.isCamelCase(propertyName)) {
            return "CamelCase";
        }

        if (this.isPascalCase(propertyName)) {
            return "PascalCase";
        }

        if (this.isConstantCase(propertyName)) {
            return "ConstantCase";
        }

        if (this.isSnakeCase(propertyName)) {
            return "SnakeCase";
        }

        if (this.isKebabCase(propertyName)) {
            return "KebabCase";
        }

        return "None";
    }

    private isCamelCase(propertyName: string) {
        const camelCase = /^[a-z][a-zA-Z0-9]*$/;
        return camelCase.test(propertyName);
    }

    private isPascalCase(propertyName: string) {
        const pascalCase = /^[A-Z][a-zA-Z0-9]*$/;
        return pascalCase.test(propertyName);
    }

    private isConstantCase(propertyName: string) {
        const constantCase = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;
        return constantCase.test(propertyName);
    }

    private isSnakeCase(propertyName: string) {
        const snakeCase = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;
        return snakeCase.test(propertyName);
    }

    private isKebabCase(propertyName: string) {
        const kebabCase = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
        return kebabCase.test(propertyName);
    }

    private labelizeCamelCase(propertyName: string) {
        const parts = propertyName.match(/([A-Z]{2,}(?=[A-Z][a-z]|[0-9]|$))|([A-Z]?[a-z]+[0-9]*[a-z]*)|([0-9]+)/g);

        if (!parts) {
            return propertyName;
        }

        const finalWords = [];

        for (const part of parts) {
            const regex = /[a-zA-Z]+|[0-9]+[a-z]+|[0-9]+(?![a-z])/g;
            let match;

            while ((match = regex.exec(part)) !== null) {
                finalWords.push(match[0]);
            }
        }

        return finalWords.map(this.capitalize).join(" ");
    }

    private labelizePascalCase(propertyName: string) {
        const parts = propertyName.match(/([A-Z]{2,}(?=[A-Z][a-z]|[0-9]|$))|([A-Z]?[a-z]+[0-9]*[a-z]*)|([0-9]+)/g);

        if (!parts) {
            return propertyName;
        };

        const finalWords = [];

        for (const part of parts) {
            const regex = /[a-zA-Z]+|[0-9]+[a-z]+|[0-9]+(?![a-z])/g;
            let match;

            while ((match = regex.exec(part)) !== null) {
                finalWords.push(match[0]);
            }
        }

        return finalWords.map(this.capitalize).join(" ");
    }

    private labelizeConstantCase(propertyName: string) {
        const parts = propertyName.split("_");
        return parts.map(word => word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word).join(" ");
    }

    private labelizeSnakeCase(propertyName: string) {
        const parts = propertyName.split("_");
        return parts.map(word => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word).join(" ");
    }

    private labelizeKebabCase(propertyName: string) {
        const parts = propertyName.split("-");
        return parts.map(word => word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word).join(" ");
    }

    private capitalize(word: string) {
        return word.length > 0 ? word[0].toUpperCase() + word.slice(1) : word;
    }

    private getOwnerContentGenerator() {
        const parent = this.getParent()!.getParent()!;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.valuelist.ValueList":
                return parent.getParent() as ContentGenerator;
            default:
                return parent as ContentGenerator;
        }
    }
}