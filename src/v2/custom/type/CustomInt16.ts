import Int16 from "sap/ui/model/odata/type/Int16";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
import { INumberSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidateException from "sap/ui/model/ValidateException";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomInt16 extends Int16 {
    private property: IProp;
    private requiredPropertyErrorMessage: string;
    private validationLogic?: ValidationLogic;
    private smartField: boolean;

    constructor(settings: INumberSettings) {
        super(settings.formatOptions, settings.constraints);
        this.property = settings.property;
        this.requiredPropertyErrorMessage = settings.requiredPropertyErrorMessage;
        this.validationLogic = settings.validationLogic;
        this.smartField = settings.smartField ?? false;
    }

    public override async validateValue(value: number | null): Promise<void> {
        super.validateValue(value!);

        if (!this.smartField) {
            this.checkRequired(value);
        }

        if (this.validationLogic && value != null) {
            return this.validationLogic.evaluate(value);
        }
    }

    private checkRequired(value: number | null) {
        if (this.property.required && value == null) {
            throw new ValidateException(this.requiredPropertyErrorMessage.replace("{property}", this.property.label));
        }
    }
}