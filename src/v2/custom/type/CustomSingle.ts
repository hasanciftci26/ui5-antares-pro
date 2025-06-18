import Single from "sap/ui/model/odata/type/Single";
import ValidateException from "sap/ui/model/ValidateException";
import CustomNumberSettings from "ui5/antares/pro/v2/custom/type/CustomNumberSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomSingle extends Single {
    private settings: CustomNumberSettings;

    constructor(settings: CustomNumberSettings) {
        super(settings.getFormatOptions(), settings.getConstraints());
        this.settings = settings;
    }

    public override async validateValue(value: number | null): Promise<void> {
        super.validateValue(value!);

        if (this.settings.getFieldType() === "Non-Smart") {
            this.checkRequired(value);
        }

        const validationLogic = this.settings.getValidationLogic();

        if (validationLogic && value != null) {
            return validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: number | null) {
        const property = this.settings.getEntityProperty();

        if (property.required && value == null) {
            throw new ValidateException(this.settings.getRequiredPropertyError().replace("{property}", property.label));
        }
    }
}