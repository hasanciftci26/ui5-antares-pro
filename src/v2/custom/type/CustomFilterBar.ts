import Byte from "sap/ui/model/odata/type/Byte";
import Decimal from "sap/ui/model/odata/type/Decimal";
import Double from "sap/ui/model/odata/type/Double";
import Guid from "sap/ui/model/odata/type/Guid";
import Int16 from "sap/ui/model/odata/type/Int16";
import Int32 from "sap/ui/model/odata/type/Int32";
import Int64 from "sap/ui/model/odata/type/Int64";
import SByte from "sap/ui/model/odata/type/SByte";
import Single from "sap/ui/model/odata/type/Single";
import SimpleType from "sap/ui/model/SimpleType";
import ODataString from "sap/ui/model/odata/type/String";
import { NumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { DateTimeFormatOptions, NumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import CustomFilterBarSettings from "ui5/antares/pro/v2/custom/type/CustomFilterBarSettings";
import NumberManager from "ui5/antares/pro/v2/util/NumberManager";
import Stream from "sap/ui/model/odata/type/Stream";
import Time from "sap/ui/model/odata/type/Time";

/**
 * @namespace ui5.antares.pro.v2.custom.type
 */
export default class CustomFilterBar extends SimpleType {
    private settings: CustomFilterBarSettings;
    private internalType: SimpleType;

    constructor(settings: CustomFilterBarSettings) {
        super();
        this.settings = settings;
        this.setInternalType();
    }

    private setInternalType() {
        switch (this.settings.getEntityProperty().type) {
            case "Edm.Byte":
                this.internalType = new Byte(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.SByte":
                this.internalType = new SByte(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.Int16":
                this.internalType = new Int16(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.Int32":
                this.internalType = new Int32(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.Int64":
                this.internalType = new Int64(
                    this.getNumberFormatOptions() || { parseEmptyValueToZero: false },
                    this.getNumberConstraints() || { nullable: true }
                );
                break;
            case "Edm.Single":
                this.internalType = new Single(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.Double":
                this.internalType = new Double(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.Decimal":
                this.internalType = new Decimal(this.getNumberFormatOptions(), this.getNumberConstraints());
                break;
            case "Edm.Time":
                this.internalType = new Time(this.getDateTimeFormatOptions());
                break;
            case "Edm.Guid":
                this.internalType = new Guid();
                break;
            case "Edm.Stream":
                this.internalType = new Stream();
                break;
            default:
                this.internalType = new ODataString();
                break;
        }
    }

    private getNumberFormatOptions() {
        const numberSettings = NumberManager.prepare(this.settings.getNumberSettings());

        if (numberSettings) {
            const formatOptions: NumberFormatOptions = {
                groupingEnabled: numberSettings.groupingEnabled,
                groupingSize: numberSettings.groupingSize,
                groupingSeparator: numberSettings.groupingSeparator,
                decimalSeparator: numberSettings.decimalSeparator
            };

            return formatOptions;
        }
    }

    private getNumberConstraints() {
        if (this.settings.getEntityProperty().precision && this.settings.getEntityProperty().scale) {
            const constraints: NumberConstraints = {
                precision: this.settings.getEntityProperty().precision,
                scale: this.settings.getEntityProperty().scale
            };

            return constraints;
        }
    }

    private getDateTimeFormatOptions() {
        const dateTimeSettings = this.settings.getDateTimeSettings();

        if (dateTimeSettings?.timePattern) {
            const formatOptions: DateTimeFormatOptions = {
                pattern: dateTimeSettings.timePattern
            };

            return formatOptions;
        }
    }
}