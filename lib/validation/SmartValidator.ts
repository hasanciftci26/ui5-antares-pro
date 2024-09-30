import ValidationLogic from "ui5/antares/pro/validation/ValidationLogic";
import { IFormElement } from "ui5/antares/pro/types/component/v2/ControlFactory";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import LibraryResourceModel from "ui5/antares/pro/core/v2/LibraryResourceModel";
import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import MessageBox from "sap/m/MessageBox";
import ODataTypeChecker from "./ODataTypeChecker";
import { ValueState } from "sap/ui/core/library";

/**
 * @namespace ui5.antares.pro.validation
 */
export default class SmartValidator extends LibraryResourceModel {
    private formElements: IFormElement[];
    private validations: ValidationLogic[];

    constructor(formElements: IFormElement[], validations: ValidationLogic[]) {
        super();
        this.formElements = formElements;
        this.validations = validations;
    }

    public async validate(): Promise<boolean> {
        if (!this.validateRequiredElements()) {
            MessageBox.error(this.getLibraryText("requiredFieldAll"));
            return false;
        }

        if (!this.validateDataTypes()) {
            MessageBox.error(this.getLibraryText("wrongDataType"));
            return false;
        }

        return this.runValidationLogic();
    }

    private validateRequiredElements() {
        const requiredElements = this.formElements.filter(element => element.standard && element.property.nullable === "false");
        let isValidationSuccessful = true;

        for (const element of requiredElements) {
            const smartField = element.control as SmartField;

            if (smartField.getValue() === "") {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("requiredField", [element.property.label]));
                isValidationSuccessful = false;
            }
        }

        return isValidationSuccessful;
    }

    private validateDataTypes() {
        const standardElements = this.formElements.filter(element => element.standard);
        let isValidationSuccessful = true;

        for (const element of standardElements) {
            const smartField = element.control as SmartField;
            let value: string = String(smartField.getValue());

            if (value === "") {
                continue;
            }

            if (element.property.type === "Edm.DateTime" || element.property.type === "Edm.DateTimeOffset") {
                value = String((smartField.getInnerControls()[0] as DatePicker | DateTimePicker).getDateValue());
            }

            const oDataType = new ODataTypeChecker({
                name: element.property.name,
                type: element.property.type,
                value: value,
                displayFormat: element.property.displayFormat,
                maxLength: element.property.maxLength,
                precision: element.property.precision,
                scale: element.property.scale
            });

            oDataType.check();

            if (oDataType.valueState === ValueState.Error) {
                isValidationSuccessful = false;
                smartField.setValueState(oDataType.valueState);
                smartField.setValueStateText(oDataType.valueStateText);
            }
        }

        return isValidationSuccessful;
    }

    private runValidationLogic() {
        let isValidationSuccessful = true;
        return isValidationSuccessful;
    }
}