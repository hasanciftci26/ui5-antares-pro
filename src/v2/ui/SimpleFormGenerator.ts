import CheckBox from "sap/m/CheckBox";
import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import Input, { Input$ValueHelpRequestEvent } from "sap/m/Input";
import Label from "sap/m/Label";
import Select from "sap/m/Select";
import Text from "sap/m/Text";
import TimePicker from "sap/m/TimePicker";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import CustomData from "sap/ui/core/CustomData";
import Item from "sap/ui/core/Item";
import Messaging from "sap/ui/core/Messaging";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { IDateTimeSettings } from "ui5/antares/pro/types/v2/custom/type/Settings.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { IBindingWithCustomType, ISettings } from "ui5/antares/pro/types/v2/ui/SimpleFormGenerator.types";
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
import SimpleFormValidator from "ui5/antares/pro/v2/validation/SimpleFormValidator";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SimpleFormGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entitySet: { type: "string", visibility: "public" },
            form: { type: "object", visibility: "public" }
        },
        aggregations: {
            validator: {
                type: "ui5.antares.pro.v2.validation.SimpleFormValidator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
        this.setValidator(new SimpleFormValidator());
    }

    public generate() {
        const form = new SimpleForm({
            editable: true,
            content: this.getContent()
        });

        this.setForm(form);
    }

    public async validate() {
        return this.getValidator().validate();
    }

    private getValidator() {
        return this.getAggregation("validator") as SimpleFormValidator;
    }

    private setValidator(validator: SimpleFormValidator) {
        this.setAggregation("validator", validator);
    }

    private getContent() {
        const content: Control[] = [];
        const parent = this.getParent() as ContentGenerator;
        const metaContext = parent.getMetaContextByEntitySet(this.getEntitySet());
        const properties = metaContext.getProps();

        for (const property of properties) {
            content.push(new Label({ text: property.label }));
            content.push(this.getControl(property, metaContext.getNavProperty()?.name));
        }

        return content;
    }

    private getControl(property: IProp, navProperty?: string) {
        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    return this.getDateControl(property, navProperty);
                } else {
                    return this.getDateTimeControl(property, navProperty);
                }
            case "Edm.DateTimeOffset":
                return this.getDateTimeControl(property, navProperty);
            case "Edm.Time":
                return this.getTimeControl(property, navProperty);
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberControl(property, navProperty);
            case "Edm.Boolean":
                return this.getBooleanControl(property, navProperty);
            default:
                return this.getStringControl(property, navProperty);
        }
    }

    private getDateControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getDateText(property, navProperty);
        } else {
            return this.getDatePicker(property, navProperty);
        }
    }

    private getDateText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getDateBinding(property, navProperty)
        });
    }

    private getDatePicker(property: IProp, navProperty?: string) {
        const datePicker = new DatePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: this.getDateBinding(property, navProperty)
        });

        Messaging.registerObject(datePicker, true);
        return datePicker;
    }

    private getDateBinding(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const datePattern = parent.getDateTimeSettings()?.datePattern;
        const validationLogic = parent.getValidationLogicByProperty(path);
        const typeSettings: IDateTimeSettings = {
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            constraints: {
                displayFormat: "Date"
            },
            validationLogic: validationLogic
        };
        const binding: IBindingWithCustomType = {
            path: path
        };

        if (datePattern) {
            typeSettings.formatOptions = {
                pattern: datePattern
            };
        }

        binding.type = new CustomDateTime(typeSettings);
        return binding;
    }

    private getDateTimeControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getDateTimeText(property, navProperty);
        } else {
            return this.getDateTimePicker(property, navProperty);
        }
    }

    private getDateTimeText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getDateTimeBinding(property, navProperty)
        });
    }

    private getDateTimePicker(property: IProp, navProperty?: string) {
        const dateTimePicker = new DateTimePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: this.getDateTimeBinding(property, navProperty)
        });

        Messaging.registerObject(dateTimePicker, true);
        return dateTimePicker;
    }

    private getDateTimeBinding(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const dateTimePattern = parent.getDateTimeSettings()?.dateTimePattern;
        const validationLogic = parent.getValidationLogicByProperty(path);
        const typeSettings: IDateTimeSettings = {
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic
        };
        const binding: IBindingWithCustomType = {
            path: path
        };

        if (dateTimePattern) {
            typeSettings.formatOptions = {
                pattern: dateTimePattern
            };
        }

        if (property.type === "Edm.DateTime") {
            binding.type = new CustomDateTime(typeSettings);
        } else {
            binding.type = new CustomDateTimeOffset(typeSettings);
        }

        return binding;
    }

    private getTimeControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getTimeText(property, navProperty);
        } else {
            return this.getTimePicker(property, navProperty);
        }
    }

    private getTimeText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getTimeBinding(property, navProperty)
        });
    }

    private getTimePicker(property: IProp, navProperty?: string) {
        const timePicker = new TimePicker({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            value: this.getTimeBinding(property, navProperty)
        });

        Messaging.registerObject(timePicker, true);
        return timePicker;
    }

    private getTimeBinding(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const timePattern = parent.getDateTimeSettings()?.timePattern;
        const validationLogic = parent.getValidationLogicByProperty(path);
        const typeSettings: IDateTimeSettings = {
            property: property,
            requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
            validationLogic: validationLogic
        };
        const binding: IBindingWithCustomType = {
            path: path
        };

        if (timePattern) {
            typeSettings.formatOptions = {
                pattern: timePattern
            };
        }

        binding.type = new CustomTime(typeSettings);
        return binding;
    }

    private getNumberControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getNumberText(property, navProperty);
        } else {
            return this.getNumberInput(property, navProperty);
        }
    }

    private getNumberText(property: IProp, navProperty?: string) {
        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: this.getNumberBinding(property, navProperty)
        });
    }

    private getNumberInput(property: IProp, navProperty?: string) {
        const input = new Input({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            textAlign: "End",
            visible: property.visible,
            required: property.required,
            value: this.getNumberBinding(property, navProperty)
        });

        Messaging.registerObject(input, true);
        return input;
    }

    private getNumberBinding(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const binding: IBindingWithCustomType = {
            path: path,
            type: this.getNumberBindingType(property, navProperty)
        };

        return binding;
    }

    private getNumberBindingType(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());
        const validationLogic = parent.getValidationLogicByProperty(path);
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

        switch (property.type) {
            case "Edm.Byte":
                return new CustomByte({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.SByte":
                return new CustomSByte({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.Int16":
                return new CustomInt16({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.Int32":
                return new CustomInt32({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.Int64":
                return new CustomInt64({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.Single":
                return new CustomSingle({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.Double":
                return new CustomDouble({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
            case "Edm.Decimal":
                return new CustomDecimal({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: formatOptions,
                    constraints: constraints,
                    validationLogic: validationLogic
                });
        }
    }

    private getBooleanControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getBooleanText(property, navProperty);
        } else {
            return this.getCheckBox(property, navProperty);
        }
    }

    private getBooleanText(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const booleanSettings = parent.getBooleanSettings();

        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: {
                path: path,
                formatter: (value: boolean | null) => {
                    if (value == null) {
                        return value;
                    }

                    return value === true ? booleanSettings.trueText : booleanSettings.falseText;
                }
            }
        });
    }

    private getCheckBox(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;

        return new CheckBox({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            required: property.required,
            selected: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            }
        });
    }

    private getStringControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getStringText(property, navProperty);
        } else {
            return this.getStringEditableControl(property, navProperty);
        }
    }

    private getStringText(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;

        return new Text({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            visible: property.visible,
            text: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            }
        });
    }

    private getStringEditableControl(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const valueList = parent.getValueListByProperty(path);

        if (valueList) {
            if (property.type !== "Edm.Guid" && property.type !== "Edm.String") {
                throw new Error("ValueList feature is only available for Edm.Guid and Edm.String data types.");
            }

            if (valueList.getFixedValues()) {
                return this.getValueListSelect(property, valueList);
            } else {
                return this.getStringInput(property, path, valueList);
            }
        } else {
            return this.getStringInput(property, path);
        }
    }

    private getStringInput(property: IProp, path: string, valueList?: ValueList) {
        const input = new Input({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            name: path,
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: this.getStringBindingType(property, path)
            },
            maxLength: property.maxLength
        });

        if (valueList) {
            input.setShowValueHelp(true);
            input.attachValueHelpRequest(this.onValueHelpRequest, this);
        }

        Messaging.registerObject(input, true);
        return input;
    }

    private getStringBindingType(property: IProp, path: string) {
        const parent = this.getParent() as ContentGenerator;
        const validationLogic = parent.getValidationLogicByProperty(path);

        switch (property.type) {
            case "Edm.Binary":
            case "Edm.Stream":
                return "sap.ui.model.odata.type." + property.type.substring(4);
            case "Edm.Guid":
                return new CustomGuid({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    validationLogic: validationLogic
                });
            default:
                return new CustomString({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    validationLogic: validationLogic
                });
        }
    }

    private getValueListSelect(property: IProp, valueList: ValueList) {
        const inOutParam = valueList.getFixedValueInOutParameter();
        const displayOnlyParams = valueList.getFixedValueDisplayOnlyParameters();
        const parent = this.getParent() as ContentGenerator;
        const select = new Select({
            customData: new CustomData({ key: "UI5AntaresProControlType", value: "Standard" }),
            required: property.required,
            visible: property.visible,
            busy: true,
            busyIndicatorDelay: 0,
            selectedKey: {
                path: inOutParam.localDataProperty,
                type: this.getStringBindingType(property, inOutParam.localDataProperty)
            }
        });

        select.bindItems({
            path: valueList.getCollectionPath(),
            length: 500,
            template: new Item({
                key: {
                    path: inOutParam.valueListProperty
                },
                text: displayOnlyParams.map(param => `{${param.valueListProperty}}`).join(valueList.getFixedValueSeparator())
            }),
            events: {
                dataReceived: () => {
                    const emptyItemKey = property.type === "Edm.Guid" ? "00000000-0000-0000-0000-000000000000" : "UI5_ANTARES_PRO_SELECT_EMPTY_KEY";

                    select.insertItem(new Item({
                        key: emptyItemKey,
                        text: ""
                    }), 0);

                    if (!parent.getContext().getProperty(inOutParam.localDataProperty)) {
                        select.setSelectedKey(emptyItemKey);
                    }

                    select.setBusy(false);
                }
            }
        });

        Messaging.registerObject(select, true);
        return select;
    }

    private onValueHelpRequest(event: Input$ValueHelpRequestEvent) {
        const parent = this.getParent() as ContentGenerator;
        const path = event.getSource().getName();
        const valueList = parent.getValueListByProperty(path);

        if (valueList) {
            valueList.open();
        }
    }
}