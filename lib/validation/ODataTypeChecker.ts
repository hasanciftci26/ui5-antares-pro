import DateFormat from "sap/ui/core/format/DateFormat";
import NumberFormat from "sap/ui/core/format/NumberFormat";
import { ValueState } from "sap/ui/core/library";
import LibraryResourceModel from "ui5/antares/pro/core/v2/LibraryResourceModel";
import { IPropertyDescriptor } from "ui5/antares/pro/types/validation/ODataTypeChecker";

/**
 * @namespace ui5.antares.pro.validation
 */
export default class ODataTypeChecker extends LibraryResourceModel {
    public valueState: ValueState = ValueState.Success;
    public valueStateText: string = "";
    private property: IPropertyDescriptor;

    constructor(property: IPropertyDescriptor) {
        super();
        this.property = property;
    }

    public check() {
        switch (this.property.type) {
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
                this.checkIntegerType();
                break;
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                this.checkDecimalType();
                break;
            case "Edm.Guid":
                this.checkGuidType();
                break;
            case "Edm.String":
                this.checkStringType();
                break;
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                this.checkDateTimeType();
                break;
        }
    }

    private checkIntegerType() {
        const minValue = this.getIntegerBoundry("Min");
        const maxValue = this.getIntegerBoundry("Max");
        const numberFormatter = NumberFormat.getIntegerInstance();
        const parsedNumber = numberFormatter.parse(this.property.value);

        if (Number.isNaN(parsedNumber ?? NaN)) {
            this.valueState = ValueState.Error;
            this.valueStateText = this.getLibraryText("wrongEdmInt", [minValue.toLocaleString(), maxValue.toLocaleString()]);
            return;
        }

        if (this.property.type === "Edm.Int64") {
            const normalizedValue = this.property.value.replace(/[,. ']/g, "");
            const convertedValue = BigInt(normalizedValue);

            if (convertedValue > maxValue || convertedValue < minValue) {
                this.valueState = ValueState.Error;
                this.valueStateText = this.getLibraryText("wrongEdmInt", [minValue.toLocaleString("fullwide"), maxValue.toLocaleString()]);
            }
        } else {
            if (parsedNumber as number > maxValue || parsedNumber as number < minValue) {
                this.valueState = ValueState.Error;
                this.valueStateText = this.getLibraryText("wrongEdmInt", [minValue.toLocaleString("fullwide"), maxValue.toLocaleString()]);
            }
        }
    }

    private checkDecimalType() {
        const numberFormatter = NumberFormat.getFloatInstance();
        const parsedNumber = numberFormatter.parse(this.property.value);

        if (Number.isNaN(parsedNumber ?? NaN)) {
            this.valueState = ValueState.Error;
            this.valueStateText = this.getLibraryText("wrongEdmSingleDouble");
            return;
        }

        if (this.property.type === "Edm.Decimal" && this.property.precision && this.property.scale) {
            const [integerPart, decimalPart = ""] = (parsedNumber as number).toLocaleString("en-US", { useGrouping: false, maximumFractionDigits: 20 }).split(".");
            const maxIntegerDigits = parseInt(this.property.precision) - parseInt(this.property.scale);
            const maxFractionDigits = parseInt(this.property.scale);

            if (integerPart.length > maxIntegerDigits && decimalPart.length > maxFractionDigits) {
                this.valueState = ValueState.Error;
                this.valueStateText = this.getLibraryText("wrongEdmDecimal", [maxIntegerDigits, maxFractionDigits]);
            } else if (integerPart.length > maxIntegerDigits) {
                this.valueState = ValueState.Error;
                this.valueStateText = this.getLibraryText("wrongEdmDecimalBeforeSeperator", [maxIntegerDigits]);
            } else if (decimalPart.length > maxFractionDigits) {
                this.valueState = ValueState.Error;
                this.valueStateText = this.getLibraryText("wrongEdmDecimalAfterSeperator", [maxFractionDigits]);
            }
        }
    }

    private checkGuidType() {
        const regex = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/;

        if (!regex.test(this.property.value)) {
            this.valueState = ValueState.Error;
            this.valueStateText = this.getLibraryText("wrongEdmGuid");
        }
    }

    private checkStringType() {
        const maxLength = Number(this.property.maxLength) || Infinity;

        if (this.property.value.length > maxLength) {
            this.valueState = ValueState.Error;
            this.valueStateText = this.getLibraryText("wrongEdmStringMaxLength", [this.property.maxLength]);
        }
    }

    private checkDateTimeType() {
        if (this.property.value === "null") {
            const textKey = this.property.displayFormat === "Date" ? "wrongEdmDate" : "wrongEdmDateTime";
            this.valueState = ValueState.Error;
            this.valueStateText = this.getLibraryText(textKey, [this.getDateTimeFormat()]);

        }
    }

    private getIntegerBoundry(boundry: "Max" | "Min") {
        switch (this.property.type) {
            case "Edm.Byte":
                return boundry === "Max" ? 255 : 0;
            case "Edm.SByte":
                return boundry === "Max" ? 127 : -128;
            case "Edm.Int16":
                return boundry === "Max" ? 32767 : -32768;
            case "Edm.Int32":
                return boundry === "Max" ? 2147483647 : -2147483648;
            default:
                return boundry === "Max" ? BigInt("9223372036854775807") : BigInt("-9223372036854775808");
        }
    }

    private getDateTimeFormat() {
        const dateFormatter = this.property.displayFormat === "Date" ? DateFormat.getDateInstance() : DateFormat.getDateTimeInstance();
        return dateFormatter.format(new Date());
    }
}