import Time from "sap/ui/model/odata/type/Time";
import ValidateException from "sap/ui/model/ValidateException";
import CustomDateTimeSettings from "ui5/antares/pro/v2/custom/type/CustomDateTimeSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomTime extends Time {
    private settings: CustomDateTimeSettings;

    constructor(settings: CustomDateTimeSettings) {
        super(settings.getFormatOptions());
        this.settings = settings;
    }

    public override async validateValue(value: object | null): Promise<void> {
        super.validateValue(value!);

        if (this.settings.getFieldType() === "Non-Smart") {
            this.checkRequired(value);
        }

        const validationLogic = this.settings.getValidationLogic();

        if (validationLogic && value != null) {
            const timeValue = this.hasMilliseconds(value) ? value.ms : value;
            return validationLogic.evaluate(timeValue);
        }
    }

    private checkRequired(value: object | null) {
        const property = this.settings.getEntityProperty();

        if (property.required && value == null) {
            throw new ValidateException(this.settings.getRequiredPropertyError().replace("{property}", property.label));
        }
    }

    private hasMilliseconds(value: object): value is { ms: number; } {
        return value != null && "ms" in value && typeof value.ms === "number";
    }
}