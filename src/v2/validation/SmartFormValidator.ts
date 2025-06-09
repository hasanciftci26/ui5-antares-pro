import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import Input from "sap/m/Input";
import TimePicker from "sap/m/TimePicker";
import ManagedObject from "sap/ui/base/ManagedObject";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class SmartFormValidator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public async validate() {
        const parent = this.getParent() as SmartFormGenerator;
        const content = parent.getParent() as ContentGenerator;
        const form = parent.getForm();
        let valid = true;

        for (const group of form.getGroups()) {
            for (const element of group.getGroupElements()) {
                const control = (element as GroupElement).getElements()[0];
                const controlType = control.getCustomData().find(data => data.getKey() === "UI5AntaresProControlType");

                if (!controlType || controlType?.getValue() !== "Standard") {
                    continue;
                }

                switch (true) {
                    case control instanceof Input:
                    case control instanceof DatePicker:
                    case control instanceof DateTimePicker:
                    case control instanceof TimePicker:
                        const valueBinding = control.getBinding("value") as PropertyBinding;
                        const value = control.getProperty("value");
                        const valueBindingType = valueBinding.getType() as SimpleType;

                        try {
                            await valueBindingType.validateValue(valueBindingType.parseValue(value, "string"));
                            control.setValueState("None");
                            control.setValueStateText("");
                        } catch (error) {
                            valid = false;
                            control.setValueState("Error");
                            control.setValueStateText((error as { message: string; }).message);
                        }

                        break;
                    case control instanceof SmartField:
                        try {
                            const propertyName = control.getCustomData().find(data => data.getKey() === "UI5AntaresProPropertyName");
                            await control.checkValuesValidity();

                            if (propertyName) {
                                const validationLogic = content.getValidationLogicByProperty(propertyName.getValue());

                                if (validationLogic) {
                                    const value = content.getContext().getProperty(propertyName.getValue());

                                    if (value != null && value !== "") {
                                        await validationLogic.evaluate(value);
                                        control.setValueState("None");
                                        control.setValueStateText("");
                                    }
                                }
                            }
                        } catch (error) {
                            valid = false;

                            if (this.hasMessage(error)) {
                                control.setValueState("Error");
                                control.setValueStateText(error.message);
                            }
                        }
                        break;
                }
            }
        }

        return valid;
    }

    private hasMessage(error: unknown): error is { message: string } {
        return typeof error === "object" && error !== null && "message" in error;
    }
}