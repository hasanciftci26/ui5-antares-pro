import Decimal from "sap/ui/model/odata/type/Decimal";
import ValidateException from "sap/ui/model/ValidateException";
import CustomNumberSettings from "ui5/antares/pro/v2/custom/type/CustomNumberSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomDecimal extends Decimal {
    private settings: CustomNumberSettings;

    constructor(settings: CustomNumberSettings) {
        super(settings.getFormatOptions(), settings.getConstraints());
        this.settings = settings;
    }

    public override async validateValue(value: string | null): Promise<void> {
        super.validateValue(value!);

        if (this.settings.getFieldType() === "Non-Smart") {
            this.checkRequired(value);
        }

        const validationLogic = this.settings.getValidationLogic();

        if (validationLogic && value != null && value !== "") {
            const parsedValue = value == null ? value : parseFloat(value);
            return validationLogic.evaluate(parsedValue);
        }
    }

    private checkRequired(value: string | null) {
        const property = this.settings.getEntityProperty();

        if (property.required && (value == null || value === "")) {
            throw new ValidateException(this.settings.getRequiredPropertyError().replace("{property}", property.label));
        }
    }
}