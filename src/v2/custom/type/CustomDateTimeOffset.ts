import DateTimeOffset from "sap/ui/model/odata/type/DateTimeOffset";
import ValidateException from "sap/ui/model/ValidateException";
import CustomDateTimeSettings from "ui5/antares/pro/v2/custom/type/CustomDateTimeSettings";

/**
 * **Internal use only.**
 *
 * This class is part of the internal implementation of the **UI5 Antares Pro** library
 * and is not intended for public use or direct consumption.
 *
 * It may change or be removed without notice in future versions.
 *
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomDateTimeOffset extends DateTimeOffset {
    private settings: CustomDateTimeSettings;

    constructor(settings: CustomDateTimeSettings) {
        super(settings.getFormatOptions());
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