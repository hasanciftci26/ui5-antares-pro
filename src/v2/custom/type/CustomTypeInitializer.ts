import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/type/CustomTypeInitializer.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import CustomByte from "ui5/antares/pro/v2/custom/type/CustomByte";
import CustomDateTime from "ui5/antares/pro/v2/custom/type/CustomDateTime";
import CustomDateTimeOffset from "ui5/antares/pro/v2/custom/type/CustomDateTimeOffset";
import CustomDateTimeSettings from "ui5/antares/pro/v2/custom/type/CustomDateTimeSettings";
import CustomDecimal from "ui5/antares/pro/v2/custom/type/CustomDecimal";
import CustomDouble from "ui5/antares/pro/v2/custom/type/CustomDouble";
import CustomGuid from "ui5/antares/pro/v2/custom/type/CustomGuid";
import CustomInt16 from "ui5/antares/pro/v2/custom/type/CustomInt16";
import CustomInt32 from "ui5/antares/pro/v2/custom/type/CustomInt32";
import CustomInt64 from "ui5/antares/pro/v2/custom/type/CustomInt64";
import CustomNumberSettings from "ui5/antares/pro/v2/custom/type/CustomNumberSettings";
import CustomSByte from "ui5/antares/pro/v2/custom/type/CustomSByte";
import CustomSingle from "ui5/antares/pro/v2/custom/type/CustomSingle";
import CustomString from "ui5/antares/pro/v2/custom/type/CustomString";
import CustomStringSettings from "ui5/antares/pro/v2/custom/type/CustomStringSettings";
import CustomTime from "ui5/antares/pro/v2/custom/type/CustomTime";
import NumberManager from "ui5/antares/pro/v2/util/NumberManager";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomTypeInitializer extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            requiredPropertyError: { type: "string" },
            fieldType: { type: "string", defaultValue: "Non-Smart" },
            dateTimeSettings: { type: "object" },
            numberSettings: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public getCustomType(property: EntityProperty, validationLogic?: ValidationLogic) {
        switch (property.type) {
            case "Edm.Byte":
                return this.getCustomByte(property, validationLogic);
            case "Edm.SByte":
                return this.getCustomSByte(property, validationLogic);
            case "Edm.Int16":
                return this.getCustomInt16(property, validationLogic);
            case "Edm.Int32":
                return this.getCustomInt32(property, validationLogic);
            case "Edm.Int64":
                return this.getCustomInt64(property, validationLogic);
            case "Edm.Single":
                return this.getCustomSingle(property, validationLogic);
            case "Edm.Double":
                return this.getCustomDouble(property, validationLogic);
            case "Edm.Decimal":
                return this.getCustomDecimal(property, validationLogic);
            case "Edm.DateTime":
                return this.getCustomDateTime(property, validationLogic);
            case "Edm.DateTimeOffset":
                return this.getCustomDateTimeOffset(property, validationLogic);
            case "Edm.Time":
                return this.getCustomTime(property, validationLogic);
            case "Edm.Guid":
                return this.getCustomGuid(property, validationLogic);
            case "Edm.String":
                return this.getCustomString(property, validationLogic);
            default:
                return "sap.ui.model.odata.type" + property.type.substring(3);
        }
    }

    private getCustomByte(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomByte(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomSByte(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomSByte(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomInt16(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomInt16(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomInt32(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomInt32(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomInt64(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomInt64(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomSingle(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomSingle(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomDouble(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomDouble(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomDecimal(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomDecimal(this.getCustomNumberSettings(property, validationLogic));
    }

    private getCustomDateTime(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomDateTime(this.getCustomDateTimeSettings(property, validationLogic));
    }

    private getCustomDateTimeOffset(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomDateTimeOffset(this.getCustomDateTimeSettings(property, validationLogic));
    }

    private getCustomTime(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomTime(this.getCustomDateTimeSettings(property, validationLogic));
    }

    private getCustomGuid(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomGuid(this.getCustomStringSettings(property, validationLogic));
    }

    private getCustomString(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomString(this.getCustomStringSettings(property, validationLogic));
    }

    private getCustomNumberSettings(property: EntityProperty, validationLogic?: ValidationLogic) {
        const numberSettings = NumberManager.prepare(this.getNumberSettings());

        const settings = new CustomNumberSettings({
            entityProperty: property,
            requiredPropertyError: ManagedObject.escapeSettingsValue(this.getRequiredPropertyError()),
            fieldType: this.getFieldType(),
            validationLogic: validationLogic
        });

        if (property.precision && property.scale) {
            settings.setConstraints({
                precision: property.precision,
                scale: property.scale
            });
        }

        if (numberSettings) {
            settings.setFormatOptions({
                groupingEnabled: numberSettings.groupingEnabled,
                groupingSize: numberSettings.groupingSize,
                groupingSeparator: numberSettings.groupingSeparator,
                decimalSeparator: numberSettings.decimalSeparator
            });
        }

        return settings;
    }

    private getCustomDateTimeSettings(property: EntityProperty, validationLogic?: ValidationLogic) {
        const dateTimeSettings = this.getDateTimeSettings();
        const settings = new CustomDateTimeSettings({
            entityProperty: property,
            requiredPropertyError: ManagedObject.escapeSettingsValue(this.getRequiredPropertyError()),
            fieldType: this.getFieldType(),
            validationLogic: validationLogic
        });

        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    settings.setConstraints({
                        displayFormat: "Date"
                    });

                    if (dateTimeSettings?.datePattern) {
                        settings.setFormatOptions({
                            pattern: dateTimeSettings.datePattern
                        });
                    }
                } else {
                    if (dateTimeSettings?.dateTimePattern) {
                        settings.setFormatOptions({
                            pattern: dateTimeSettings.dateTimePattern
                        });
                    }
                }
                break;
            case "Edm.DateTimeOffset":
                if (dateTimeSettings?.dateTimePattern) {
                    settings.setFormatOptions({
                        pattern: dateTimeSettings.dateTimePattern
                    });
                }
                break;
            case "Edm.Time":
                if (dateTimeSettings?.timePattern) {
                    settings.setFormatOptions({
                        pattern: dateTimeSettings.timePattern
                    });
                }
                break;
        }

        return settings;
    }

    private getCustomStringSettings(property: EntityProperty, validationLogic?: ValidationLogic) {
        return new CustomStringSettings({
            entityProperty: property,
            requiredPropertyError: ManagedObject.escapeSettingsValue(this.getRequiredPropertyError()),
            fieldType: this.getFieldType(),
            validationLogic: validationLogic
        });
    }
}