import ValidationLogic from "ui5/antares/pro/validation/ValidationLogic";
import { IFormElement } from "ui5/antares/pro/types/component/v2/ControlFactory";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import { PropertyType } from "../types/odata/v2/ODataMetadataReader";
import LibraryResourceModel from "ui5/antares/pro/core/v2/LibraryResourceModel";
import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import MessageBox from "sap/m/MessageBox";
import DateFormat from "sap/ui/core/format/DateFormat";

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
            if ((element.control as SmartField).getValue() === "") {
                continue;
            }

            switch (element.property.type) {
                case "Edm.Guid":
                    if (!this.validateEdmGuid(element)) {
                        isValidationSuccessful = false;
                    }
                    break;
                case "Edm.Byte":
                case "Edm.SByte":
                case "Edm.Int16":
                case "Edm.Int32":
                case "Edm.Int64":
                    if (!this.validateEdmInteger(element)) {
                        isValidationSuccessful = false;
                    }
                    break;
                case "Edm.Single":
                case "Edm.Double":
                case "Edm.Decimal":
                    if (!this.validateEdmFractional(element)) {
                        isValidationSuccessful = false;
                    }
                    break;
                case "Edm.String":
                    if (!this.validateEdmString(element)) {
                        isValidationSuccessful = false;
                    }
                    break;
                case "Edm.DateTime":
                    if (!this.validateEdmDateTime(element)) {
                        isValidationSuccessful = false;
                    }
                    break;
                case "Edm.DateTimeOffset":
                    if (!this.validateEdmDateTimeOffset(element)) {
                        isValidationSuccessful = false;
                    }
                    break;
            }
        }

        return isValidationSuccessful;
    }

    private validateEdmGuid(element: IFormElement) {
        const regex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;
        const smartField = element.control as SmartField;

        if (!regex.test(smartField.getValue())) {
            smartField.setValueState("Error");
            smartField.setValueStateText(this.getLibraryText("wrongEdmGuid"));
            return false;
        }

        return true;
    }

    private validateEdmInteger(element: IFormElement) {
        const smartField = element.control as SmartField;
        const intInstance = NumberFormat.getIntegerInstance();
        const parsedValue = intInstance.parse(smartField.getValue());
        const minValue = this.getIntegerMinValue(element.property.type);
        const maxValue = this.getIntegerMaxValue(element.property.type);

        if (parsedValue == null) {
            smartField.setValueState("Error");
            smartField.setValueStateText(this.getLibraryText("wrongEdmInt", [minValue.toLocaleString(), maxValue.toLocaleString()]));
            return false;
        }

        if (typeof parsedValue === "number") {
            if (Number.isNaN(parsedValue)) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmInt", [minValue.toLocaleString(), maxValue.toLocaleString()]));
                return false;
            }
        }

        if (element.property.type === "Edm.Int64") {
            const normalizedValue = (smartField.getValue() as string).replace(/[,. ']/g, "");
            const convertedValue = BigInt(normalizedValue);

            if (convertedValue > maxValue || convertedValue < minValue) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmInt", [minValue.toLocaleString("fullwide"), maxValue.toLocaleString()]));
                return false;
            }
        } else {
            if (parsedValue as number > maxValue || parsedValue as number < minValue) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmInt", [minValue.toLocaleString("fullwide"), maxValue.toLocaleString()]));
                return false;
            }
        }

        return true;
    }

    private getIntegerMinValue(type: PropertyType) {
        switch (type) {
            case "Edm.Byte":
                return 0;
            case "Edm.SByte":
                return -128;
            case "Edm.Int16":
                return -32768;
            case "Edm.Int64":
                return BigInt("-9223372036854775808");
            default:
                return -2147483648;
        }
    }

    private getIntegerMaxValue(type: PropertyType) {
        switch (type) {
            case "Edm.Byte":
                return 255;
            case "Edm.SByte":
                return 127;
            case "Edm.Int16":
                return 32767;
            case "Edm.Int64":
                return BigInt("9223372036854775807");
            default:
                return 2147483647;
        }
    }

    private validateEdmFractional(element: IFormElement) {
        const smartField = element.control as SmartField;
        const floatInstance = NumberFormat.getFloatInstance();
        const parsedValue = floatInstance.parse(smartField.getValue());

        if (parsedValue == null) {
            smartField.setValueState("Error");
            smartField.setValueStateText(this.getLibraryText("wrongEdmSingleDouble"));
            return false;
        }

        if (typeof parsedValue === "number") {
            if (Number.isNaN(parsedValue)) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmSingleDouble"));
                return false;
            }
        }

        if (element.property.type === "Edm.Decimal" && element.property.precision && element.property.scale) {
            const [integerPart, decimalPart = ""] = (parsedValue as number).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 }).split(".");
            const maxIntegerDigits = parseInt(element.property.precision) - parseInt(element.property.scale);
            const maxFractionDigits = parseInt(element.property.scale);

            if (integerPart.length > maxIntegerDigits && decimalPart.length > maxFractionDigits) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmDecimal", [maxIntegerDigits, maxFractionDigits]));
                return false;
            } else if (integerPart.length > maxIntegerDigits) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmDecimalBeforeSeperator", [maxIntegerDigits]));
                return false;
            } else if (decimalPart.length > maxFractionDigits) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmDecimalAfterSeperator", [maxFractionDigits]));
                return false;
            }
        }

        return true;
    }

    private validateEdmString(element: IFormElement) {
        const smartField = element.control as SmartField;
        const value = smartField.getValue() as string;

        if (element.property.maxLength) {
            if (value.length > parseInt(element.property.maxLength)) {
                smartField.setValueState("Error");
                smartField.setValueStateText(this.getLibraryText("wrongEdmStringMaxLength", [element.property.maxLength]));
                return false;
            }
        }

        return true;
    }

    private validateEdmDateTime(element: IFormElement) {
        const smartField = element.control as SmartField;
        const datePicker = smartField.getInnerControls()[0] as DatePicker;
        const value = datePicker.getDateValue();

        if (!value) {
            smartField.setValueState("Error");
            smartField.setValueStateText(this.getLibraryText("wrongEdmDateTime", [this.getDateTimeFormat()]));
            return false;
        }

        return true;
    }

    private validateEdmDateTimeOffset(element: IFormElement) {
        const smartField = element.control as SmartField;
        const dateTimePicker = smartField.getInnerControls()[0] as DateTimePicker;
        const value = dateTimePicker.getDateValue();

        if (!value) {
            smartField.setValueState("Error");
            smartField.setValueStateText(this.getLibraryText("wrongEdmDateTimeOffset", [this.getDateTimeOffsetFormat()]));
            return false;
        }

        return true;
    }

    private getDateTimeFormat() {
        const dateInstance = DateFormat.getDateInstance();
        return dateInstance.format(new Date());
    }

    private getDateTimeOffsetFormat() {
        const dateTimeInstance = DateFormat.getDateTimeInstance();
        return dateTimeInstance.format(new Date());
    }

    private runValidationLogic() {
        let isValidationSuccessful = true;
        return isValidationSuccessful;
    }
}