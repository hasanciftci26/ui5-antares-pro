import Label from "sap/m/Label";
import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import SimpleFormValidator from "ui5/antares/pro/v2/validation/SimpleFormValidator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SimpleFormGenerator extends FormGeneratorBase {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            form: { type: "object" }
        },
        aggregations: {
            validator: {
                type: "ui5.antares.pro.v2.validation.SimpleFormValidator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor() {
        super();
        this.setValidator(new SimpleFormValidator());
    }

    public generate() {
        const form = new SimpleForm({
            editable: true,
            adjustLabelSpan: false,
            content: this.getFormContent()
        });

        this.setFormLayoutData(form);
        this.setForm(form);
    }

    public async validate() {
        return this.getValidator().validate();
    }

    private getValidator() {
        return this.getAggregation("validator") as SimpleFormValidator;
    }

    private setValidator(validator: SimpleFormValidator) {
        this.setAggregation("validator", validator);
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
            const control = generator.generate(
                property,
                this.getPropertyPath(property.name),
                this.getValidationLogicByProperty(property.name)
            );

            this.setControlLayoutData(property, control);
            controls.push(new Label({ text: property.label }));
            controls.push(control);
        }

        return controls;
    }

    private setFormLayoutData(form: SimpleForm) {
        const formLayout = this.getFormLayout();
        const layoutData = formLayout.getLayoutData();

        form.setLayout(formLayout.getLayoutType());
        form.setColumnsXL(formLayout.getColumnsXL());
        form.setColumnsL(formLayout.getColumnsL());
        form.setColumnsM(formLayout.getColumnsM());
        form.setLabelSpanXL(formLayout.getLabelSpanXL());
        form.setLabelSpanL(formLayout.getLabelSpanL());
        form.setLabelSpanM(formLayout.getLabelSpanM());
        form.setLabelSpanS(formLayout.getLabelSpanS());
        form.setEmptySpanXL(formLayout.getEmptySpanXL());
        form.setEmptySpanL(formLayout.getEmptySpanL());
        form.setEmptySpanM(formLayout.getEmptySpanM());
        form.setEmptySpanS(formLayout.getEmptySpanS());

        if (layoutData) {
            form.setLayoutData(layoutData);
        }
    }
}