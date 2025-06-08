import { IDateTimeConstraints, INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { IDateTimeFormatOptions, INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

export interface INumberSettings {
    property: IProp;
    requiredPropertyErrorMessage: string;
    formatOptions?: INumberFormatOptions;
    constraints?: INumberConstraints;
    validationLogic?: ValidationLogic;
}

export interface IDateTimeSettings {
    property: IProp;
    requiredPropertyErrorMessage: string;
    formatOptions?: IDateTimeFormatOptions;
    constraints?: IDateTimeConstraints;
    validationLogic?: ValidationLogic;
}

export interface IStringSettings {
    property: IProp;
    requiredPropertyErrorMessage: string;
    validationLogic?: ValidationLogic;
}