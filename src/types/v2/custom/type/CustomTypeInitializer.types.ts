/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { FieldType } from "ui5/antares/pro/types/v2/custom/type/Common.types";
import { DateTimeSettings, NumberSettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

declare module "ui5/antares/pro/v2/custom/type/CustomTypeInitializer" {
    export default interface CustomTypeInitializer {
        getRequiredPropertyError: GetProperty<string>;
        setRequiredPropertyError: SetProperty<string>;
        getFieldType: GetProperty<FieldType>;
        setFieldType: SetProperty<FieldType>;
        getDateTimeSettings: GetProperty<DateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<DateTimeSettings | undefined>;
        getNumberSettings: GetProperty<NumberSettings | undefined>;
        setNumberSettings: SetProperty<NumberSettings | undefined>;
    }
}

export interface Settings {
    requiredPropertyError: string;
    fieldType?: FieldType;
    dateTimeSettings?: DateTimeSettings;
    numberSettings?: NumberSettings;    
}