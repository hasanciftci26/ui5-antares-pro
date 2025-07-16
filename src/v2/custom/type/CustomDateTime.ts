import DateTime from "sap/ui/model/odata/type/DateTime";
import ValidateException from "sap/ui/model/ValidateException";
import CustomDateTimeSettings from "ui5/antares/pro/v2/custom/type/CustomDateTimeSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomDateTime extends DateTime {
    private settings: CustomDateTimeSettings;

    constructor(settings: CustomDateTimeSettings) {
        super(settings.getFormatOptions(), settings.getConstraints());
        this.settings = settings;
    }

    public override async validateValue(value: Date | null): Promise<void> {
        super.validateValue(value!);

        if (this.settings.getFieldType() === "Non-Smart") {
            this.checkRequired(value);
        }

        const validationLogic = this.settings.getValidationLogic();

        if (validationLogic && value != null) {
            return validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: Date | null) {
        const property = this.settings.getEntityProperty();

        if (property.required && value == null) {
            throw new ValidateException(this.settings.getRequiredPropertyError().replace("{property}", property.label));
        }
    }
}