import Int64 from "sap/ui/model/odata/type/Int64";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import { INumberSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidateException from "sap/ui/model/ValidateException";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomInt64 extends Int64 {
    private property: IProp;
    private requiredPropertyErrorMessage: string;
    private validationLogic?: ValidationLogic;

    constructor(settings: INumberSettings) {
        super(settings.formatOptions || { parseEmptyValueToZero: false }, settings.constraints || { nullable: true });
        this.property = settings.property;
        this.requiredPropertyErrorMessage = settings.requiredPropertyErrorMessage;
        this.validationLogic = settings.validationLogic;
    }

    public override async validateValue(value: string | null): Promise<void> {
        super.validateValue(value!);
        this.checkRequired(value);

        if (this.validationLogic && value != null && value !== "") {
            const parsedValue = value == null ? value : BigInt(value);
            return this.validationLogic.evaluate(parsedValue);
        }
    }

    private checkRequired(value: string | null) {
        if (this.property.required && (value == null || value === "")) {
            throw new ValidateException(this.requiredPropertyErrorMessage.replace("{property}", this.property.label));
        }
    }
}