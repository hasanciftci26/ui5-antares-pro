import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import { IDateTimeSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidateException from "sap/ui/model/ValidateException";
import DateTime from "sap/ui/model/odata/type/DateTime";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomDateTime extends DateTime {
    private property: IProp;
    private requiredPropertyErrorMessage: string;
    private validationLogic?: ValidationLogic;
    private smartField: boolean;

    constructor(settings: IDateTimeSettings) {
        super(settings.formatOptions, settings.constraints);
        this.property = settings.property;
        this.requiredPropertyErrorMessage = settings.requiredPropertyErrorMessage;
        this.validationLogic = settings.validationLogic;
        this.smartField = settings.smartField ?? false;
    }

    public override async validateValue(value: Date | null): Promise<void> {
        super.validateValue(value!);

        if (!this.smartField) {
            this.checkRequired(value);
        }

        if (this.validationLogic && value != null) {
            return this.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: Date | null) {
        if (this.property.required && value == null) {
            throw new ValidateException(this.requiredPropertyErrorMessage.replace("{property}", this.property.label));
        }
    }
}