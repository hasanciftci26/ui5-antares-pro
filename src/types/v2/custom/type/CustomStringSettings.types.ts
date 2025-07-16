/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { FieldType } from "ui5/antares/pro/types/v2/custom/type/Common.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

declare module "ui5/antares/pro/v2/custom/type/CustomStringSettings" {
    export default interface CustomStringSettings {
        getEntityProperty: GetProperty<EntityProperty>;
        setEntityProperty: SetProperty<EntityProperty>;
        getFieldType: GetProperty<FieldType>;
        setFieldType: SetProperty<FieldType>;
        getValidationLogic: GetProperty<ValidationLogic | undefined>;
        setValidationLogic: SetProperty<ValidationLogic | undefined>;
    }
}

export interface Settings {
    entityProperty: EntityProperty;
    requiredPropertyError: string;
    fieldType?: FieldType;
    validationLogic?: ValidationLogic;
}