import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { FormUtilityProvider } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";

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
}