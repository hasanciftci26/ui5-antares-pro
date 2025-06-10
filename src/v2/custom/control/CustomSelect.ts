import Select from "sap/m/Select";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import SimpleType from "sap/ui/model/SimpleType";

/**
 * @namespace ui5.antares.pro.v2.custom.control
 */
export default class CustomSelect extends Select {
    static readonly renderer = {};

    public async checkValuesValidity() {
        const binding = this.getBinding("selectedKey") as PropertyBinding;
        const value = this.getProperty("selectedKey");
        const type = binding.getType() as SimpleType;

        await type.validateValue(type.parseValue(value, "string"));
    }
}