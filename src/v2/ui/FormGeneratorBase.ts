import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { FormUtilityProvider } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class FormGeneratorBase extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true
    };

    public abstract generate(): void;
    public abstract getForm(): Control;
    public abstract setForm(form: Control): void;
    public abstract validate(): Promise<boolean>;

    public getCustomElementByProperty(property: string) {
        return this.getFormUtilityProvider().getCustomElementByProperty(property);
    }    

    protected getDateTimeSettings() {
        return this.getFactory().getDateTimeSettings();
    }

    protected getNumberSettings() {
        return this.getFactory().getNumberSettings();
    }

    protected getRequiredPropertyError() {
        return this.getFactory().getRequiredPropertyError();
    }

    protected getValidationLogicByProperty(property: string) {
        return this.getFormUtilityProvider().getValidationLogicByProperty(property);
    }

    protected getValueListByProperty(property: string) {
        return this.getFormUtilityProvider().getValueListByProperty(property);
    }

    protected getFormLayout() {
        const formLayout = this.getFormUtilityProvider().getFormLayout();

        if (formLayout) {
            return formLayout;
        }

        if (this.isParentFactory() || this.isParentOneNavigationProperty()) {
            const factory = this.getFactory();
            const navigationProperties = factory.getNavigationProperties().filter(prop => prop.getMultiplicity() === "Many");

            if (navigationProperties.length) {
                const operation = this.getFactory().getOperation();

                if (operation === "Create" || operation === "Update") {
                    return FormLayout.getDefaultInstance({
                        labelSpanXL: 4,
                        labelSpanL: 4,
                        labelSpanM: 4,
                        labelSpanS: 4,
                        emptySpanXL: 4,
                        emptySpanL: 4,
                        emptySpanM: 4,
                        emptySpanS: 4
                    });
                } else {
                    return FormLayout.getDefaultInstance({
                        labelSpanXL: 5,
                        labelSpanL: 5,
                        labelSpanM: 5,
                        labelSpanS: 5,
                        emptySpanXL: 3,
                        emptySpanL: 3,
                        emptySpanM: 3,
                        emptySpanS: 3
                    });
                }
            } else {
                return FormLayout.getDefaultInstance();
            }
        } else {
            return FormLayout.getDefaultInstance();
        }
    }

    protected getFactory() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return parent.getParent() as Factory;
            case "ui5.antares.pro.v2.ui.ResponsiveTableGenerator":
            case "ui5.antares.pro.v2.ui.GridTableGenerator":
                return (parent.getParent() as NavigationProperty).getOwnerParent();
            default:
                return parent as Factory;
        }
    }

    protected getPropertyPath(property: string) {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                const navigationProperty = (parent as NavigationProperty).getName();
                return navigationProperty + "/" + property;
            default:
                return property;
        }
    }

    protected getPathPrefix() {
        const parent = this.getParent() as ManagedObject;

        if (parent.getMetadata().getName() === "ui5.antares.pro.v2.metadata.NavigationProperty") {
            return (parent as NavigationProperty).getName();
        } else {
            return "";
        }
    }

    protected getMetaContext() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return (parent as NavigationProperty).getMetaContext();
            case "ui5.antares.pro.v2.ui.ResponsiveTableGenerator":
            case "ui5.antares.pro.v2.ui.GridTableGenerator":
                return (parent.getParent() as NavigationProperty).getMetaContext();
            default:
                return (parent as Factory).getMetaContext();
        }
    }

    protected getFormUtilityProvider() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.ui.ResponsiveTableGenerator":
            case "ui5.antares.pro.v2.ui.GridTableGenerator":
                return parent.getParent() as FormUtilityProvider;
            default:
                return parent as FormUtilityProvider;
        }
    }

    protected getContext() {
        return this.getFormUtilityProvider().getContext();
    }

    protected getPropertySettings() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return (parent as NavigationProperty).getPropertySettings();
            case "ui5.antares.pro.v2.ui.ResponsiveTableGenerator":
            case "ui5.antares.pro.v2.ui.GridTableGenerator":
                return (parent.getParent() as NavigationProperty).getPropertySettings();
            default:
                return (parent as Factory).getPropertySettings();
        }
    }

    protected getSinglePropertySettings(property: string) {
        return this.getPropertySettings().find(prop => prop.name === property);
    }

    protected setControlLayoutData(property: EntityProperty, control: Control) {
        const propertySettings = this.getPropertySettings().find(settings => settings.name === property.name);

        if (propertySettings?.layoutData) {
            control.setLayoutData(propertySettings.layoutData);
        }
    }

    private isParentFactory() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
            case "ui5.antares.pro.v2.ui.ResponsiveTableGenerator":
            case "ui5.antares.pro.v2.ui.GridTableGenerator":
                return false;
            default:
                return true;
        }
    }

    private isParentOneNavigationProperty() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.metadata.NavigationProperty":
                return (parent as NavigationProperty).getMultiplicity() === "One";
            default:
                return false;
        }
    }
}