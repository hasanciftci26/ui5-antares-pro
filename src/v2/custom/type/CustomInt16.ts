import Int16 from "sap/ui/model/odata/type/Int16";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomInt16 extends Int16 {
    private validationLogic?: ValidationLogic;

    constructor(formatOptions?: INumberFormatOptions, constraints?: INumberConstraints, validationLogic?: ValidationLogic) {
        super(formatOptions, constraints);
        this.validationLogic = validationLogic;
    }

    public override async validateValue(value: number): Promise<void> {
        super.validateValue(value);

        if (this.validationLogic) {
            return this.validationLogic.evaluate(value);
        }
    }
}