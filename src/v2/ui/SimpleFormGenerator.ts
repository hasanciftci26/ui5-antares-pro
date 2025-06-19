import Label from "sap/m/Label";
import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SimpleFormGenerator extends FormGeneratorBase {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            form: { type: "object" }
        }
    };

    public generate() {
        const form = new SimpleForm({
            editable: true,
            content: this.getFormContent()
        });

        this.setForm(form);
    }

    public async validate() {
        return true;
    }

    private getFormContent() {
        const controls: Control[] = [];
        const properties = this.getMetaContext().getEntityProperties();
        const generator = new ControlGenerator({
            generateFor: "SimpleForm",
            requiredPropertyError: ManagedObject.escapeSettingsValue(this.getRequiredPropertyError()),
            dateTimeSettings: this.getDateTimeSettings(),
            numberSettings: this.getNumberSettings()
        });

        for (const property of properties) {
            controls.push(new Label({ text: property.label }));
            controls.push(generator.generate(
                property,
                this.getPropertyPath(property.name),
                this.getValidationLogicByProperty(property.name)
            ));
        }

        return controls;
    }
}