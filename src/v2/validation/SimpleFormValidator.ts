import ManagedObject from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ControlType } from "ui5/antares/pro/types/v2/ui/FormGeneratorBase.types";
import CustomDatePicker from "ui5/antares/pro/v2/custom/control/CustomDatePicker";
import CustomDateTimePicker from "ui5/antares/pro/v2/custom/control/CustomDateTimePicker";
import CustomInput from "ui5/antares/pro/v2/custom/control/CustomInput";
import CustomSelect from "ui5/antares/pro/v2/custom/control/CustomSelect";
import CustomTimePicker from "ui5/antares/pro/v2/custom/control/CustomTimePicker";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class SimpleFormValidator extends ManagedObject {
    static metadata: ClassMetadata = {
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
            const controlType = control.data("UI5AntaresProControlType") as ControlType | undefined;

            if (!controlType) {
                continue;
            }

            if (controlType === "Standard") {
                switch (true) {
                    case control instanceof CustomInput:
                    case control instanceof CustomDatePicker:
                    case control instanceof CustomDateTimePicker:
                    case control instanceof CustomTimePicker:
                    case control instanceof CustomSelect:
                        try {
                            await control.checkValuesValidity();
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
        }

        return valid;
    }
}