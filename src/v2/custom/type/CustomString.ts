import String from "sap/ui/model/odata/type/String";
import ValidateException from "sap/ui/model/ValidateException";
import CustomStringSettings from "ui5/antares/pro/v2/custom/type/CustomStringSettings";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomString extends String {
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

        if (validationLogic && value != null && value !== "" && value !== "UI5_ANTARES_PRO_SELECT_EMPTY_KEY") {
            return validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: string | null) {
        const property = this.settings.getEntityProperty();

        if (property.required && (value == null || value === "" || value === "UI5_ANTARES_PRO_SELECT_EMPTY_KEY")) {
            throw new ValidateException(this.settings.getRequiredPropertyError().replace("{property}", property.label));
        }
    }
}