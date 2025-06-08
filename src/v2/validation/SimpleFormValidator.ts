import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import Input from "sap/m/Input";
import Select from "sap/m/Select";
import TimePicker from "sap/m/TimePicker";
import ManagedObject from "sap/ui/base/ManagedObject";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class SimpleFormValidator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public async validate() {
        const parent = this.getParent() as SimpleFormGenerator;
        const form = parent.getForm();
        let valid = true;

        for (const control of form.getContent()) {
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
                case control instanceof Select:
                    const selectedKeyBinding = control.getBinding("selectedKey") as PropertyBinding;
                    const selectedKey = control.getProperty("selectedKey");
                    const selectedKeyBindingType = selectedKeyBinding.getType() as SimpleType;

                    try {
                        await selectedKeyBindingType.validateValue(selectedKeyBindingType.parseValue(selectedKey, "string"));
                        control.setValueState("None");
                        control.setValueStateText("");
                    } catch (error) {
                        valid = false;
                        control.setValueState("Error");
                        control.setValueStateText((error as { message: string; }).message);
                    }

                    break;
            }
        }

        return valid;
    }
}