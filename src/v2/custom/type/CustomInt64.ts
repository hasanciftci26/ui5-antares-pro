import Int64 from "sap/ui/model/odata/type/Int64";
import ValidateException from "sap/ui/model/ValidateException";
import CustomNumberSettings from "ui5/antares/pro/v2/custom/type/CustomNumberSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomInt64 extends Int64 {
    private settings: CustomNumberSettings;

    constructor(settings: CustomNumberSettings) {
        super(settings.getFormatOptions() || { parseEmptyValueToZero: false }, settings.getConstraints() || { nullable: true });
        this.settings = settings;
    }

    public override async validateValue(value: string | null): Promise<void> {
        super.validateValue(value!);

        if (this.settings.getFieldType() === "Non-Smart") {
            this.checkRequired(value);
        }

        const validationLogic = this.settings.getValidationLogic();

        if (validationLogic && value != null && value !== "") {
            const parsedValue = value == null ? value : BigInt(value);
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