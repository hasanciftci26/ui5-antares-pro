import Guid from "sap/ui/model/odata/type/Guid";
import ValidateException from "sap/ui/model/ValidateException";
import CustomStringSettings from "ui5/antares/pro/v2/custom/type/CustomStringSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomGuid extends Guid {
    private settings: CustomStringSettings;

    constructor(settings: CustomStringSettings) {
        super();
        this.settings = settings;
    }

    public override async validateValue(value: string | null): Promise<void> {
        super.validateValue(value!);

        if (this.settings.getFieldType() === "Non-Smart") {
            this.checkRequired(value);
        }

        const validationLogic = this.settings.getValidationLogic();

        if (validationLogic && value != null && value !== "" && value !== "00000000-0000-0000-0000-000000000000") {
            return validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: string | null) {
        const property = this.settings.getEntityProperty();

        if (property.required && (value == null || value === "" || value === "00000000-0000-0000-0000-000000000000")) {
            throw new ValidateException(this.settings.getRequiredPropertyError().replace("{property}", property.label));
        }
    }
}