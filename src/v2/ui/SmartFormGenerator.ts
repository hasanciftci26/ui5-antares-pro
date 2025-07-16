import Label from "sap/m/Label";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import ColumnLayout from "sap/ui/comp/smartform/ColumnLayout";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import Layout from "sap/ui/comp/smartform/Layout";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import CustomData from "sap/ui/core/CustomData";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import CustomTypeInitializer from "ui5/antares/pro/v2/custom/type/CustomTypeInitializer";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";
import SmartFormValidator from "ui5/antares/pro/v2/validation/SmartFormValidator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SmartFormGenerator extends FormGeneratorBase {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            form: { type: "object" }
        },
        aggregations: {
            validator: {
                type: "ui5.antares.pro.v2.validation.SmartFormValidator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor() {
        super();
        this.setValidator(new SmartFormValidator());
    }

    public generate() {
        const form = new SmartForm({
            editable: true,
            editTogglable: false,
            validationMode: "Standard",
            groups: new Group({
                groupElements: this.getGroupElements()
            })
        });

        this.setFormLayoutData(form);
        this.setForm(form);
    }

    public async validate() {
        return this.getValidator().validate();
    }

    private getValidator() {
        return this.getAggregation("validator") as SmartFormValidator;
    }

    private setValidator(validator: SmartFormValidator) {
        this.setAggregation("validator", validator);
    }

    private getGroupElements() {
        const elements: GroupElement[] = [];
        const properties = this.getMetaContext().getEntityProperties();

        for (const property of properties) {
            const control = this.getControl(property);
            this.setControlLayoutData(property, control);

            elements.push(new GroupElement({
                label: new Label({ text: property.label }),
                elements: control
            }));
        }

        return elements;
    }

    private getControl(property: EntityProperty) {
        const generator = new ControlGenerator({
            generateFor: "SmartForm",
            dateTimeSettings: this.getDateTimeSettings(),
            numberSettings: this.getNumberSettings()
        });

        if (property.readonly) {
            return generator.generate(property, this.getPropertyPath(property.name));
        } else {
            return this.getSmartField(property);
        }
    }

    private getSmartField(property: EntityProperty) {
        const propertySettings = this.getSinglePropertySettings(property.name);

        const typeInitializer = new CustomTypeInitializer({
            requiredPropertyError: "",
            fieldType: "Smart",
            dateTimeSettings: this.getDateTimeSettings(),
            numberSettings: this.getNumberSettings()
        });

        const field = new SmartField({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            value: {
                path: this.getPropertyPath(property.name),
                type: typeInitializer.getCustomType(property, this.getValidationLogicByProperty(property.name))
            },
            mandatory: property.required,
            editable: true,
            visible: property.visible
        });

        if (propertySettings?.textInEditModeSource) {
            field.setTextInEditModeSource(propertySettings.textInEditModeSource);
        }

        return field;
    }

    private setFormLayoutData(form: SmartForm) {
        const formLayout = this.getFormLayout();
        const layoutData = formLayout.getLayoutData();

        if (formLayout.getLayoutType() === "ResponsiveGridLayout") {
            form.setLayout(this.getResponsiveGridLayout(formLayout));
        } else {
            form.setLayout(this.getColumnLayout(formLayout));
        }

        if (layoutData) {
            form.setLayoutData(layoutData);
        }
    }

    private getResponsiveGridLayout(formLayout: FormLayout) {
        return new Layout({
            columnsXL: formLayout.getColumnsXL(),
            columnsL: formLayout.getColumnsL(),
            columnsM: formLayout.getColumnsM(),
            labelSpanXL: formLayout.getLabelSpanXL(),
            labelSpanL: formLayout.getLabelSpanL(),
            labelSpanM: formLayout.getLabelSpanM(),
            labelSpanS: formLayout.getLabelSpanS(),
            emptySpanXL: formLayout.getEmptySpanXL(),
            emptySpanL: formLayout.getEmptySpanL(),
            emptySpanM: formLayout.getEmptySpanM(),
            emptySpanS: formLayout.getEmptySpanS()
        });
    }

    private getColumnLayout(formLayout: FormLayout) {
        return new ColumnLayout({
            columnsXL: formLayout.getColumnsXL(),
            columnsL: formLayout.getColumnsL(),
            columnsM: formLayout.getColumnsM()
        });
    }
}