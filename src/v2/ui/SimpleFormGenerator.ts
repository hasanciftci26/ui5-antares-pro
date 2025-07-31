import Input from "sap/m/Input";
import Label from "sap/m/Label";
import ManagedObject from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import SimpleFormValidator from "ui5/antares/pro/v2/validation/SimpleFormValidator";

/**
 * **Internal use only.**
 *
 * This class is part of the internal implementation of the **UI5 Antares Pro** library
 * and is not intended for public use or direct consumption.
 *
 * It may change or be removed without notice in future versions.
 *
 * @internal
 * 
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
            title: this.getFormTitle(),
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
            const customElement = this.getCustomElementByProperty(property.name);
            controls.push(new Label({ text: property.label }));

            if (customElement) {
                controls.push(customElement.getElement() as Control);
            } else {
                const control = generator.generate(
                    property,
                    this.getPropertyPath(property.name),
                    this.getValidationLogicByProperty(property.name)
                );

                this.setControlLayoutData(property, control);

                if (control instanceof Input) {
                    this.addValueHelp(property, control);
                }

                controls.push(control);
            }
        }

        return controls;
    }

    private addValueHelp(property: EntityProperty, control: Input) {
        const valueList = this.getValueListByProperty(property.name);

        if ((property.type !== "Edm.String" && property.type !== "Edm.Guid") || !valueList) {
            return;
        }

        control.setShowValueHelp(true);
        control.attachValueHelpRequest(() => {
            valueList.setPathPrefix(this.getPathPrefix());
            valueList.setLocalDataContext(this.getContext());
            valueList.open();
        });
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