import Int64 from "sap/ui/model/odata/type/Int64";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomInt64 extends Int64 {
    private validationLogic?: ValidationLogic;

    constructor(formatOptions?: INumberFormatOptions, constraints?: INumberConstraints, validationLogic?: ValidationLogic) {
        super(formatOptions || { parseEmptyValueToZero: false }, constraints || { nullable: true });
        this.validationLogic = validationLogic;
    }

    public override validateValue(value: string): void {
        super.validateValue(value);

        if (this.validationLogic) {
            this.validationLogic.evaluate(value);
        }
    }
}