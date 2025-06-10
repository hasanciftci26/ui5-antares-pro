import Guid from "sap/ui/model/odata/type/Guid";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import { IStringSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidateException from "sap/ui/model/ValidateException";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomGuid extends Guid {
    private property: IProp;
    private requiredPropertyErrorMessage: string;
    private validationLogic?: ValidationLogic;
    private smartField: boolean;

    constructor(settings: IStringSettings) {
        super();
        this.property = settings.property;
        this.requiredPropertyErrorMessage = settings.requiredPropertyErrorMessage;
        this.validationLogic = settings.validationLogic;
        this.smartField = settings.smartField ?? false;
    }

    public override async validateValue(value: string | null): Promise<void> {
        super.validateValue(value!);

        if (!this.smartField) {
            this.checkRequired(value);
        }

        if (this.validationLogic && value != null && value !== "" && value !== "00000000-0000-0000-0000-000000000000") {
            return this.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: string | null) {
        if (this.property.required && (value == null || value === "" || value === "00000000-0000-0000-0000-000000000000")) {
            throw new ValidateException(this.requiredPropertyErrorMessage.replace("{property}", this.property.label));
        }
    }
}