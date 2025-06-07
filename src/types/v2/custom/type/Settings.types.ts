import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

export interface INumberSettings {
    property: IProp;
    requiredPropertyErrorMessage: string;
    formatOptions?: INumberFormatOptions;
    constraints?: INumberConstraints;
    validationLogic?: ValidationLogic;
}