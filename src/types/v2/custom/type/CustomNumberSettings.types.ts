/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { FieldType } from "ui5/antares/pro/types/v2/custom/type/Common.types";
import { NumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { NumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

declare module "ui5/antares/pro/v2/custom/type/CustomNumberSettings" {
    export default interface CustomNumberSettings {
        getEntityProperty: GetProperty<EntityProperty>;
        setEntityProperty: SetProperty<EntityProperty>;
        getRequiredPropertyError: GetProperty<string>;
        setRequiredPropertyError: SetProperty<string>;
        getFieldType: GetProperty<FieldType>;
        setFieldType: SetProperty<FieldType>;
        getConstraints: GetProperty<NumberConstraints | undefined>;
        setConstraints: SetProperty<NumberConstraints | undefined>;
        getFormatOptions: GetProperty<NumberFormatOptions | undefined>;
        setFormatOptions: SetProperty<NumberFormatOptions | undefined>;
        getValidationLogic: GetProperty<ValidationLogic | undefined>;
        setValidationLogic: SetProperty<ValidationLogic | undefined>;
    }
}

export interface Settings {
    entityProperty: EntityProperty;
    requiredPropertyError: string;
    fieldType?: FieldType;
    constraints?: NumberConstraints;
    formatOptions?: NumberFormatOptions;
    validationLogic?: ValidationLogic;
}