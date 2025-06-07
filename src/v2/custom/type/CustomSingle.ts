import Single from "sap/ui/model/odata/type/Single";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomSingle extends Single {
    private validationLogic?: ValidationLogic;

    constructor(formatOptions?: INumberFormatOptions, constraints?: INumberConstraints, validationLogic?: ValidationLogic) {
        super(formatOptions, constraints);
        this.validationLogic = validationLogic;
    }

    public override validateValue(value: number): void {
        super.validateValue(value);

        if (this.validationLogic) {
            this.validationLogic.evaluate(value);
        }
    }
}