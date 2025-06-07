import Decimal from "sap/ui/model/odata/type/Decimal";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomDecimal extends Decimal {
    private validationLogic?: ValidationLogic;

    constructor(formatOptions?: INumberFormatOptions, constraints?: INumberConstraints, validationLogic?: ValidationLogic) {
        super(formatOptions, constraints);
        this.validationLogic = validationLogic;
    }

    public override async validateValue(value: string): Promise<void> {
        super.validateValue(value);

        if (this.validationLogic) {
            return this.validationLogic.evaluate(value);
        }
    }
}