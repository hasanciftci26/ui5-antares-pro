/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { FieldType } from "ui5/antares/pro/types/v2/custom/type/Common.types";
import { DateTimeFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { DateTimeConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

declare module "ui5/antares/pro/v2/custom/type/CustomDateTimeSettings" {
    export default interface CustomDateTimeSettings {
        getEntityProperty: GetProperty<EntityProperty>;
        setEntityProperty: SetProperty<EntityProperty>;
        getRequiredPropertyError: GetProperty<string>;
        setRequiredPropertyError: SetProperty<string>;
        getFieldType: GetProperty<FieldType>;
        setFieldType: SetProperty<FieldType>;
        getConstraints: GetProperty<DateTimeConstraints | undefined>;
        setConstraints: SetProperty<DateTimeConstraints | undefined>;
        getFormatOptions: GetProperty<DateTimeFormatOptions | undefined>;
        setFormatOptions: SetProperty<DateTimeFormatOptions | undefined>;
        getValidationLogic: GetProperty<ValidationLogic | undefined>;
        setValidationLogic: SetProperty<ValidationLogic | undefined>;
    }
}

export interface Settings {
    entityProperty: EntityProperty;
    requiredPropertyError: string;
    fieldType?: FieldType;
    constraints?: DateTimeConstraints;
    formatOptions?: DateTimeFormatOptions;
    validationLogic?: ValidationLogic;
}