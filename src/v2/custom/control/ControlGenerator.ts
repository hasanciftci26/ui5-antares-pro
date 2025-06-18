import CheckBox from "sap/m/CheckBox";
import DynamicDateRange, { DynamicDateRange$ChangeEvent } from "sap/m/DynamicDateRange";
import Input from "sap/m/Input";
import Text from "sap/m/Text";
import TimePicker from "sap/m/TimePicker";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import CustomData from "sap/ui/core/CustomData";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings, StandardBinding } from "ui5/antares/pro/types/v2/custom/control/ControlGenerator.types";
import { DateTimeConstraints, NumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { DateTimeFormatOptions, NumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import CustomDatePicker from "ui5/antares/pro/v2/custom/control/CustomDatePicker";
import CustomDateTimePicker from "ui5/antares/pro/v2/custom/control/CustomDateTimePicker";
import CustomInput from "ui5/antares/pro/v2/custom/control/CustomInput";
import CustomTimePicker from "ui5/antares/pro/v2/custom/control/CustomTimePicker";
import CustomTypeInitializer from "ui5/antares/pro/v2/custom/type/CustomTypeInitializer";
import NumberManager from "ui5/antares/pro/v2/util/NumberManager";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

/**
 * @namespace ui5.antares.pro.v2.custom.control
 */
export default class ControlGenerator extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            generateFor: { type: "string" },
            requiredPropertyError: { type: "string" },
            dateTimeSettings: { type: "object" },
            numberSettings: { type: "object" },
            dateRangeOptions: { type: "string[]" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public generate(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        switch (this.getGenerateFor()) {
            case "Filterbar":
                return this.generateForFilterbar(property, path);
            case "Table":
            case "SmartForm":
                return this.getTextControl(property, path);
            default:
                return this.generateForSimpleForm(property, path, validationLogic);
        }
    }

    private generateForSimpleForm(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        if (property.readonly) {
            return this.getTextControl(property, path);
        } else {
            return this.getSimpleFormControl(property, path, validationLogic);
        }
    }

    private generateForFilterbar(property: EntityProperty, path: string) {
        switch (property.type) {
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                return this.getDynamicDateRange(property);
            case "Edm.Time":
                return this.getTimePicker(property, path);
            case "Edm.Boolean":
                return this.getCheckBox(property, path);
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberInput(property, path);
            default:
                return this.getStringInput(property, path);
        }
    }

    private getTextControl(property: EntityProperty, path: string) {
        const constraints = this.getConstraints(property);
        const formatOptions = this.getFormatOptions(property);
        const binding: StandardBinding = {
            path: path,
            type: "sap.ui.model.odata.type" + property.type.substring(3)
        };

        if (constraints) {
            binding.constraints = constraints;
        }

        if (formatOptions) {
            binding.formatOptions = formatOptions;
        }

        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: binding
        });
    }

    private getConstraints(property: EntityProperty) {
        switch (property.type) {
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberConstraints(property);
            case "Edm.DateTime":
                return this.getDateTimeConstraints(property);
        }
    }

    private getNumberConstraints(property: EntityProperty) {
        if (property.precision && property.scale) {
            const constraints: NumberConstraints = {
                precision: property.precision,
                scale: property.scale
            };

            return constraints;
        }
    }

    private getDateTimeConstraints(property: EntityProperty) {
        if (property.displayFormat === "Date") {
            const constraints: DateTimeConstraints = {
                displayFormat: "Date"
            };

            return constraints;
        }
    }

    private getFormatOptions(property: EntityProperty) {
        switch (property.type) {
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberFormatOptions();
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
            case "Edm.Time":
                return this.getDateTimeFormatOptions(property);
        }
    }

    private getNumberFormatOptions() {
        const numberSettings = NumberManager.prepare(this.getNumberSettings());

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

    private getDateTimeFormatOptions(property: EntityProperty) {
        const dateTimeSettings = this.getDateTimeSettings();

        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    if (dateTimeSettings?.datePattern) {
                        const formatOptions: DateTimeFormatOptions = {
                            pattern: dateTimeSettings.datePattern
                        };

                        return formatOptions;
                    }
                } else {
                    if (dateTimeSettings?.dateTimePattern) {
                        const formatOptions: DateTimeFormatOptions = {
                            pattern: dateTimeSettings.dateTimePattern
                        };

                        return formatOptions;
                    }
                }

                break;
            case "Edm.DateTimeOffset":
                if (dateTimeSettings?.dateTimePattern) {
                    const formatOptions: DateTimeFormatOptions = {
                        pattern: dateTimeSettings.dateTimePattern
                    };

                    return formatOptions;
                }

                break;
            case "Edm.Time":
                if (dateTimeSettings?.timePattern) {
                    const formatOptions: DateTimeFormatOptions = {
                        pattern: dateTimeSettings.timePattern
                    };

                    return formatOptions;
                }

                break;
        }
    }

    private getSimpleFormControl(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    return this.getCustomDatePicker(property, path, validationLogic);
                } else {
                    return this.getCustomDateTimePicker(property, path, validationLogic);
                }
            case "Edm.DateTimeOffset":
                return this.getCustomDateTimePicker(property, path, validationLogic);
            case "Edm.Time":
                return this.getCustomTimePicker(property, path, validationLogic);
            case "Edm.Boolean":
                return this.getCheckBox(property, path);
            default:
                return this.getCustomInput(property, path, validationLogic);
        }
    }

    private getCheckBox(property: EntityProperty, path: string) {
        return new CheckBox({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            selected: {
                path: path,
                type: "sap.ui.model.odata.type.Boolean"
            }
        });
    }

    private getTimePicker(property: EntityProperty, path: string) {
        const formatOptions = this.getDateTimeFormatOptions(property);
        const binding: StandardBinding = {
            path: path,
            type: "sap.ui.model.odata.type.Time"
        };

        if (formatOptions) {
            binding.formatOptions = formatOptions;
        }

        return new TimePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            value: binding
        });
    }

    private getNumberInput(property: EntityProperty, path: string) {
        const constraints = this.getNumberConstraints(property);
        const formatOptions = this.getNumberFormatOptions();
        const binding: StandardBinding = {
            path: path,
            type: "sap.ui.model.odata.type" + property.type
        };

        if (constraints) {
            binding.constraints = constraints;
        }

        if (formatOptions) {
            binding.formatOptions = formatOptions;
        }

        return new Input({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            value: binding
        });
    }

    private getStringInput(property: EntityProperty, path: string) {
        return new Input({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            value: {
                path: path,
                type: "sap.ui.model.odata.type" + property.type
            }
        });
    }

    private getDynamicDateRange(property: EntityProperty) {
        const dynamicDateRange = new DynamicDateRange({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            name: property.name,
            standardOptions: this.getDateRangeOptions()
        });

        dynamicDateRange.attachChange(this.onDateRangeChange, this);
        return dynamicDateRange;
    }

    private onDateRangeChange(event: DynamicDateRange$ChangeEvent) {
        if (event.getParameter("valid")) {
            event.getSource().setValueState("None");
        } else {
            event.getSource().setValueState("Error");
        }
    }

    private getCustomDatePicker(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        return new CustomDatePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: this.getSimpleFormBindingType(property, validationLogic)
            }
        });
    }

    private getCustomDateTimePicker(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        return new CustomDateTimePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: this.getSimpleFormBindingType(property, validationLogic)
            }
        });
    }

    private getCustomTimePicker(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        return new CustomTimePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: this.getSimpleFormBindingType(property, validationLogic)
            }
        });
    }

    private getCustomInput(property: EntityProperty, path: string, validationLogic?: ValidationLogic) {
        return new CustomInput({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: this.getSimpleFormBindingType(property, validationLogic)
            }
        });
    }

    private getSimpleFormBindingType(property: EntityProperty, validationLogic?: ValidationLogic) {
        const typeInitializer = new CustomTypeInitializer({
            requiredPropertyError: this.getRequiredPropertyError() as string,
            dateTimeSettings: this.getDateTimeSettings(),
            numberSettings: this.getNumberSettings()
        });

        return typeInitializer.getCustomType(property, validationLogic);
    }
}