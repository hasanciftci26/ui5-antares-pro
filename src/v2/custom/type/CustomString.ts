import String from "sap/ui/model/odata/type/String";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import { IStringSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidateException from "sap/ui/model/ValidateException";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomString extends String {
    private property: IProp;
    private requiredPropertyErrorMessage: string;
    private validationLogic?: ValidationLogic;
    private runCheckRequired = false;
    private runValidationLogic = false;

    constructor(settings: IStringSettings) {
        super();
        this.property = settings.property;
        this.requiredPropertyErrorMessage = settings.requiredPropertyErrorMessage;
        this.validationLogic = settings.validationLogic;
    }

    public override async validateValue(value: string | null): Promise<void> {
        super.validateValue(value!);
        this.checkRequired(value);

        if (!this.runValidationLogic) {
            this.runValidationLogic = true;
            return;
        }

        if (this.validationLogic && value != null && value !== "" && value !== "UI5_ANTARES_PRO_SELECT_EMPTY_KEY") {
            return this.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: string | null) {
        if (!this.runCheckRequired) {
            this.runCheckRequired = true;
            return;
        }

        if (this.property.required && (value == null || value === "" || value === "UI5_ANTARES_PRO_SELECT_EMPTY_KEY")) {
            throw new ValidateException(this.requiredPropertyErrorMessage.replace("{property}", this.property.label));
        }
    }
}