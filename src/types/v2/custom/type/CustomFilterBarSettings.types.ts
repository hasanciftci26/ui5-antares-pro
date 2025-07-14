/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { DateTimeSettings, NumberSettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

declare module "ui5/antares/pro/v2/custom/type/CustomFilterBarSettings" {
    export default interface CustomFilterBarSettings {
        getEntityProperty: GetProperty<EntityProperty>;
        setEntityProperty: SetProperty<EntityProperty>;
        getDateTimeSettings: GetProperty<DateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<DateTimeSettings | undefined>;
        getNumberSettings: GetProperty<NumberSettings | undefined>;
        setNumberSettings: SetProperty<NumberSettings | undefined>;
    }
}

export interface Settings {
    entityProperty: EntityProperty;
    dateTimeSettings?: DateTimeSettings;
    numberSettings?: NumberSettings;    
}