import BaseObject from "sap/ui/base/Object";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace ui5.antares.pro.util
 */
export default class LabelGenerator extends BaseObject {
    private propertyName: string;
    private entitySetName: string;
    private i18nPrefix: string;
    private resourceBundle?: ResourceBundle;

    constructor(propertyName: string, entitySetName: string, i18nPrefix: string, resourceBundle?: ResourceBundle) {
        super();
        this.propertyName = propertyName;
        this.entitySetName = entitySetName;
        this.i18nPrefix = i18nPrefix;
        resourceBundle = resourceBundle;
    }

    public generate(): string {
        if (this.resourceBundle) {
            const i18nKey = this.i18nPrefix + this.entitySetName + this.propertyName;

            if (this.resourceBundle.hasText(i18nKey)) {
                return this.resourceBundle.getText(i18nKey) as string;
            } else {
                return this.formatBasedSplitter();
            }
        } else {
            return this.formatBasedSplitter();
        }
    }

    private formatBasedSplitter(): string {
        const format = this.identifyFormat();

        switch (format) {
            case "camelCase":
                return this.splitCamelCase();
            case "PascalCase":
                return this.splitPascalCase();
            case "CONSTANT_CASE":
                return this.splitConstantCase();
            case "snake_case":
                return this.splitSnakeCase();
            case "kebab-case":
                return this.splitKebabCase();
            default:
                return this.propertyName;
        }
    }

    private identifyFormat(): "camelCase" | "PascalCase" | "CONSTANT_CASE" | "snake_case" | "kebab-case" | "none" {
        if (this.isCamelCase()) {
            return "camelCase";
        }

        if (this.isPascalCase()) {
            return "PascalCase";
        }

        if (this.isConstantCase()) {
            return "CONSTANT_CASE";
        }

        if (this.isSnakeCase()) {
            return "snake_case";
        }

        if (this.isKebabCase()) {
            return "kebab-case";
        }

        return "none";
    }

    private isCamelCase(): boolean {
        const regex = /^[a-z][a-zA-Z0-9]*$/;
        return regex.test(this.propertyName);
    }

    private isPascalCase(): boolean {
        const regex = /^[A-Z][a-zA-Z0-9]*$/;
        return regex.test(this.propertyName);
    }

    private isConstantCase(): boolean {
        const regex = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)*$/;
        return regex.test(this.propertyName);
    }

    private isSnakeCase(): boolean {
        const regex = /^[a-z][a-z0-9]*(_[a-z0-9]+)*$/;
        return regex.test(this.propertyName);
    }

    private isKebabCase(): boolean {
        const regex = /^[a-z]+(-[a-z0-9]+)*$/;
        return regex.test(this.propertyName);
    }

    private splitCamelCase(): string {
        return this.propertyName
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .replace(/([0-9])([A-Z])/g, "$1 $2")
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }

    private splitPascalCase(): string {
        return this.propertyName
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
            .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }

    private splitConstantCase(): string {
        return this.propertyName
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }

    private splitSnakeCase(): string {
        return this.propertyName
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }

    private splitKebabCase(): string {
        return this.propertyName
            .replace(/-/g, " ")
            .toLowerCase()
            .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    }
}