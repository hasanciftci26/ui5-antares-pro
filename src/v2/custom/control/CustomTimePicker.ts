import TimePicker from "sap/m/TimePicker";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.antares.pro.v2.custom.control
 */
export default class CustomTimePicker extends TimePicker {
    static readonly renderer = {};

    public async checkValuesValidity() {
        const binding = this.getBinding("value") as PropertyBinding;
        const value = this.getProperty("value");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }
}