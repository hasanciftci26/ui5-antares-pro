import Label from "sap/m/Label";
import Text from "sap/m/Text";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { IDateTimeSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { IDateBinding, IDateTimeBinding, INumberBinding } from "ui5/antares/pro/types/v2/ui/SimpleFormGenerator.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/SmartFormGenerator.types";
import CustomByte from "ui5/antares/pro/v2/custom/type/CustomByte";
import CustomDateTime from "ui5/antares/pro/v2/custom/type/CustomDateTime";
import CustomDateTimeOffset from "ui5/antares/pro/v2/custom/type/CustomDateTimeOffset";
import CustomDecimal from "ui5/antares/pro/v2/custom/type/CustomDecimal";
import CustomDouble from "ui5/antares/pro/v2/custom/type/CustomDouble";
import CustomGuid from "ui5/antares/pro/v2/custom/type/CustomGuid";
import CustomInt16 from "ui5/antares/pro/v2/custom/type/CustomInt16";
import CustomInt32 from "ui5/antares/pro/v2/custom/type/CustomInt32";
import CustomInt64 from "ui5/antares/pro/v2/custom/type/CustomInt64";
import CustomSByte from "ui5/antares/pro/v2/custom/type/CustomSByte";
import CustomSingle from "ui5/antares/pro/v2/custom/type/CustomSingle";
import CustomString from "ui5/antares/pro/v2/custom/type/CustomString";
import CustomTime from "ui5/antares/pro/v2/custom/type/CustomTime";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import NumberSettings from "ui5/antares/pro/v2/util/NumberSettings";
import SmartFormValidator from "ui5/antares/pro/v2/validation/SmartFormValidator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SmartFormGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entitySet: { type: "string", visibility: "public" },
            form: { type: "object", visibility: "public" },
            includeNavPropertyToPath: { type: "boolean", visibility: "public", defaultValue: true }
        },
        aggregations: {
            validator: {
                type: "ui5.antares.pro.v2.validation.SmartFormValidator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
        this.setValidator(new SmartFormValidator());
    }

    public generate() {
        const form = new SmartForm({
            editTogglable: false,
            editable: true,
            validationMode: "Standard",
            groups: new Group({
                groupElements: this.getGroupElements()
            })
        });

        this.setForm(form);
    }

    public async validate() {
        return this.getValidator().validate();
    }

    private getValidator() {
        return this.getAggregation("validator") as SmartFormValidator;
    }

    private setValidator(validator: SmartFormValidator) {
        this.setAggregation("validator", validator);
    }

    private getGroupElements() {
        const elements: GroupElement[] = [];
        const parent = this.getOwnerContentGenerator();
        const metaContext = parent.getMetaContextByEntitySet(this.getEntitySet());
        const properties = metaContext.getProps();

        for (const property of properties) {
            elements.push(new GroupElement({
                label: new Label({ text: property.label }),
                elements: this.getSmartField(property, metaContext.getNavProperty()?.name)
            }));
        }

        return elements;
    }

    private getSmartField(property: IProp, navProperty?: string) {
        const settingsPath = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getOwnerContentGenerator();
        const customElement = parent.getCustomElementByProperty(settingsPath);

        if (customElement) {
            return customElement.getElement() as Control;
        }

        if (property.readonly) {
            return this.getReadonlyControl(property, navProperty);
        } else {
            return this.getEditableSmartField(property, navProperty);
        }
    }

    private getReadonlyControl(property: IProp, navProperty?: string) {
        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    return this.getDateText(property, navProperty);
                } else {
                    return this.getDateTimeText(property, navProperty);
                }
            case "Edm.DateTimeOffset":
                return this.getDateTimeText(property, navProperty);
            case "Edm.Time":
                return this.getTimeText(property, navProperty);
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberText(property, navProperty);
            case "Edm.Boolean":
                return this.getBooleanText(property, navProperty);
            default:
                return this.getRegularText(property, navProperty);
        }
    }

    private getDateText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getDateBinding(property, navProperty)
        });
    }

    private getDateBinding(property: IProp, navProperty?: string) {
        const bindingPath = this.getPropertyPath(property, navProperty);
        const parent = this.getOwnerContentGenerator();
        const datePattern = parent.getDateTimeSettings()?.datePattern;
        const binding: IDateBinding = {
            path: bindingPath,
            type: "sap.ui.model.odata.type." + property.type.substring(4),
            constraints: {
                displayFormat: "Date"
            }
        };

        if (datePattern) {
            binding.formatOptions = {
                pattern: datePattern
            };
        }

        return binding;
    }

    private getDateTimeText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getDateTimeBinding(property, navProperty)
        });
    }

    private getDateTimeBinding(property: IProp, navProperty?: string) {
        const bindingPath = this.getPropertyPath(property, navProperty);
        const parent = this.getOwnerContentGenerator();
        const dateTimePattern = parent.getDateTimeSettings()?.dateTimePattern;
        const binding: IDateTimeBinding = {
            path: bindingPath,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (dateTimePattern) {
            binding.formatOptions = {
                pattern: dateTimePattern
            };
        }

        return binding;
    }

    private getTimeText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getTimeBinding(property, navProperty)
        });
    }

    private getTimeBinding(property: IProp, navProperty?: string) {
        const bindingPath = this.getPropertyPath(property, navProperty);
        const parent = this.getOwnerContentGenerator();
        const timePattern = parent.getDateTimeSettings()?.timePattern;
        const binding: IDateTimeBinding = {
            path: bindingPath,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (timePattern) {
            binding.formatOptions = {
                pattern: timePattern
            };
        }

        return binding;
    }

    private getNumberText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getNumberBinding(property, navProperty)
        });
    }

    private getNumberBinding(property: IProp, navProperty?: string) {
        const bindingPath = this.getPropertyPath(property, navProperty);
        const parent = this.getOwnerContentGenerator();
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());
        const binding: INumberBinding = {
            path: bindingPath,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (numberSettings) {
            binding.formatOptions = {
                groupingEnabled: numberSettings.groupingEnabled,
                groupingSeparator: numberSettings.groupingSeparator,
                groupingSize: numberSettings.groupingSize,
                decimalSeparator: numberSettings.decimalSeparator
            };
        }

        if (property.precision && property.scale) {
            binding.constraints = {
                precision: property.precision,
                scale: property.scale
            };
        }

        return binding;
    }

    private getBooleanText(property: IProp, navProperty?: string) {
        const bindingPath = this.getPropertyPath(property, navProperty);
        const parent = this.getOwnerContentGenerator();
        const booleanSettings = parent.getBooleanSettings();

        return new Text({
            text: {
                path: bindingPath,
                formatter: (value: boolean | null) => {
                    if (value == null) {
                        return value;
                    }

                    return value === true ? booleanSettings.trueText : booleanSettings.falseText;
                }
            }
        });
    }

    private getRegularText(property: IProp, navProperty?: string) {
        return new Text({
            text: {
                path: this.getPropertyPath(property, navProperty),
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            }
        });
    }

    private getEditableSmartField(property: IProp, navProperty?: string) {
        const bindingPath = this.getPropertyPath(property, navProperty);
        const settingsPath = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getOwnerContentGenerator();
        const propertySettings = parent.getSinglePropertySettings(settingsPath);

        const field = new SmartField({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            value: {
                path: bindingPath,
                type: this.getSmartFieldBindingType(property, bindingPath, settingsPath)
            },
            mandatory: property.required,
            editable: true,
            visible: property.visible
        });

        if (propertySettings?.textInEditModeSource) {
            field.setTextInEditModeSource(propertySettings.textInEditModeSource);
        }

        return field;
    }

    private getSmartFieldBindingType(property: IProp, bindingPath: string, settingsPath: string) {
        switch (property.type) {
            case "Edm.Byte":
                return this.getByteType(property, settingsPath);
            case "Edm.SByte":
                return this.getSByteType(property, settingsPath);
            case "Edm.Int16":
                return this.getInt16Type(property, settingsPath);
            case "Edm.Int32":
                return this.getInt32Type(property, settingsPath);
            case "Edm.Int64":
                return this.getInt64Type(property, settingsPath);
            case "Edm.Single":
                return this.getSingleType(property, settingsPath);
            case "Edm.Double":
                return this.getDoubleType(property, settingsPath);
            case "Edm.Decimal":
                return this.getDecimalType(property, settingsPath);
            case "Edm.DateTime":
                return this.getDateTimeType(property, settingsPath);
            case "Edm.DateTimeOffset":
                return this.getDateTimeOffsetType(property, settingsPath);
            case "Edm.Time":
                return this.getTimeType(property, settingsPath);
            case "Edm.Guid":
                return this.getGuidType(property, settingsPath);
            case "Edm.String":
                return this.getStringType(property, settingsPath);
            default:
                return "sap.ui.model.odata.type." + property.type.substring(4);
        }
    }

    private getByteType(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomByte({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getSByteType(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomSByte({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getInt16Type(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomInt16({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getInt32Type(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomInt32({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getInt64Type(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomInt64({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getSingleType(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomSingle({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getDoubleType(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomDouble({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getDecimalType(property: IProp, settingsPath: string) {
        const parent = this.getOwnerContentGenerator();
        const settings = this.getNumberSettings(property);
        const validationLogic = parent.getValidationLogicByProperty(settingsPath);

        return new CustomDecimal({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            formatOptions: settings.formatOptions,
            constraints: settings.constrains,
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getNumberSettings(property: IProp) {
        const parent = this.getOwnerContentGenerator();
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());
        let formatOptions: INumberFormatOptions | undefined;
        let constraints: INumberConstraints | undefined;

        if (numberSettings) {
            formatOptions = {
                groupingEnabled: numberSettings.groupingEnabled,
                groupingSeparator: numberSettings.groupingSeparator,
                groupingSize: numberSettings.groupingSize,
                decimalSeparator: numberSettings.decimalSeparator
            };
        }

        if (property.precision && property.scale) {
            constraints = {
                precision: property.precision,
                scale: property.scale
            };
        }

        return {
            formatOptions: formatOptions,
            constrains: constraints
        };
    }

    private getDateTimeType(property: IProp, path: string) {
        const parent = this.getOwnerContentGenerator();
        const validationLogic = parent.getValidationLogicByProperty(path);
        const dateTimeSettings = parent.getDateTimeSettings();
        const typeSettings: IDateTimeSettings = {
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic,
            smartField: true
        };

        if (property.displayFormat === "Date") {
            typeSettings.constraints = {
                displayFormat: "Date"
            };

            if (dateTimeSettings?.datePattern) {
                typeSettings.formatOptions = {
                    pattern: dateTimeSettings.datePattern
                };
            }
        } else {
            if (dateTimeSettings?.dateTimePattern) {
                typeSettings.formatOptions = {
                    pattern: dateTimeSettings.dateTimePattern
                };
            }
        }

        return new CustomDateTime(typeSettings);
    }

    private getDateTimeOffsetType(property: IProp, path: string) {
        const parent = this.getOwnerContentGenerator();
        const validationLogic = parent.getValidationLogicByProperty(path);
        const dateTimePattern = parent.getDateTimeSettings()?.dateTimePattern;
        const typeSettings: IDateTimeSettings = {
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic,
            smartField: true
        };

        if (dateTimePattern) {
            typeSettings.formatOptions = {
                pattern: dateTimePattern
            };
        }

        return new CustomDateTimeOffset(typeSettings);
    }

    private getTimeType(property: IProp, path: string) {
        const parent = this.getOwnerContentGenerator();
        const timePattern = parent.getDateTimeSettings()?.timePattern;
        const validationLogic = parent.getValidationLogicByProperty(path);
        const typeSettings: IDateTimeSettings = {
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic,
            smartField: true
        };

        if (timePattern) {
            typeSettings.formatOptions = {
                pattern: timePattern
            };
        }

        return new CustomTime(typeSettings);
    }

    private getGuidType(property: IProp, path: string) {
        const parent = this.getOwnerContentGenerator();
        const validationLogic = parent.getValidationLogicByProperty(path);

        return new CustomGuid({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getStringType(property: IProp, path: string) {
        const parent = this.getOwnerContentGenerator();
        const validationLogic = parent.getValidationLogicByProperty(path);

        return new CustomString({
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic,
            smartField: true
        });
    }

    private getOwnerContentGenerator() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.ui.TableGenerator":
                return parent.getParent() as ContentGenerator;
            default:
                return parent as ContentGenerator;
        }
    }

    private getPropertyPath(property: IProp, navProperty?: string) {
        if (navProperty) {
            if (this.getIncludeNavPropertyToPath()) {
                return `${navProperty}/${property.name}`;
            } else {
                return property.name;
            }
        } else {
            return property.name;
        }
    }
}