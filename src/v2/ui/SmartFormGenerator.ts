import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import TimePicker from "sap/m/TimePicker";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import Messaging from "sap/ui/core/Messaging";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { INumberConstraints } from "ui5/antares/pro/types/v2/custom/type/Constraints.types";
import { INumberFormatOptions } from "ui5/antares/pro/types/v2/custom/type/FormatOptions.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { IBindingWithCustomType } from "ui5/antares/pro/types/v2/ui/SimpleFormGenerator.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/SmartFormGenerator.types";
import CustomByte from "ui5/antares/pro/v2/custom/type/CustomByte";
import CustomDateTime from "ui5/antares/pro/v2/custom/type/CustomDateTime";
import CustomDateTimeOffset from "ui5/antares/pro/v2/custom/type/CustomDateTimeOffset";
import CustomDecimal from "ui5/antares/pro/v2/custom/type/CustomDecimal";
import CustomDouble from "ui5/antares/pro/v2/custom/type/CustomDouble";
import CustomInt16 from "ui5/antares/pro/v2/custom/type/CustomInt16";
import CustomInt32 from "ui5/antares/pro/v2/custom/type/CustomInt32";
import CustomInt64 from "ui5/antares/pro/v2/custom/type/CustomInt64";
import CustomSByte from "ui5/antares/pro/v2/custom/type/CustomSByte";
import CustomSingle from "ui5/antares/pro/v2/custom/type/CustomSingle";
import CustomTime from "ui5/antares/pro/v2/custom/type/CustomTime";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import NumberSettings from "ui5/antares/pro/v2/util/NumberSettings";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SmartFormGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entitySet: { type: "string", visibility: "public" },
            form: { type: "object", visibility: "public" }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
    }

    public generate() {
        const form = new SmartForm({
            editTogglable: false,
            editable: true,
            validationMode: "Async",
            groups: new Group({
                groupElements: this.getGroupElements()
            })
        });

        this.setForm(form);
    }

    private getGroupElements() {
        const elements: GroupElement[] = [];
        const parent = this.getParent() as ContentGenerator;
        const metaContext = parent.getMetaContextByEntitySet(this.getEntitySet());
        const properties = metaContext.getProps();

        for (const property of properties) {
            elements.push(new GroupElement({
                label: new Label({ text: property.label }),
                elements: this.getControl(property, metaContext.getNavProperty()?.name)
            }));
        }

        return elements;
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
            default:
                return this.getSmartField(property, navProperty);
        }
    }

    private getDateControl(property: IProp, navProperty?: string) {
        const parent = this.getParent() as ContentGenerator;

        if (parent.getDateTimeSettings()?.datePattern) {
            if (property.readonly) {
                return this.getDateText(property, navProperty);
            } else {
                return this.getDatePicker(property, navProperty);
            }
        } else {
            return this.getSmartField(property, navProperty);
        }
    }

    private getDateText(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;

        return new Text({
            visible: property.visible,
            text: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4),
                constraints: {
                    displayFormat: "Date"
                },
                formatOptions: {
                    pattern: parent.getDateTimeSettings()!.datePattern
                }
            }
        });
    }

    private getDatePicker(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const validationLogic = parent.getValidationLogicByProperty(path);
        const datePicker = new DatePicker({
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: new CustomDateTime({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    constraints: {
                        displayFormat: "Date"
                    },
                    formatOptions: {
                        pattern: parent.getDateTimeSettings()!.datePattern!
                    },
                    validationLogic: validationLogic
                })
            }
        });

        Messaging.registerObject(datePicker, true);
        return datePicker;
    }

    private getDateTimeControl(property: IProp, navProperty?: string) {
        const parent = this.getParent() as ContentGenerator;

        if (parent.getDateTimeSettings()?.dateTimePattern) {
            if (property.readonly) {
                return this.getDateTimeText(property, navProperty);
            } else {
                return this.getDateTimePicker(property, navProperty);
            }
        } else {
            return this.getSmartField(property, navProperty);
        }
    }

    private getDateTimeText(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;

        return new Text({
            visible: property.visible,
            text: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4),
                formatOptions: {
                    pattern: parent.getDateTimeSettings()!.dateTimePattern
                }
            }
        });
    }

    private getDateTimePicker(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const dateTimePicker = new DateTimePicker({
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: this.getDateTimeBindingType(property, path)
            }
        });

        Messaging.registerObject(dateTimePicker, true);
        return dateTimePicker;
    }

    private getDateTimeBindingType(property: IProp, path: string) {
        const parent = this.getParent() as ContentGenerator;
        const validationLogic = parent.getValidationLogicByProperty(path);

        switch (property.type) {
            case "Edm.DateTimeOffset":
                return new CustomDateTimeOffset({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: {
                        pattern: parent.getDateTimeSettings()!.datePattern!
                    },
                    validationLogic: validationLogic
                });
            default:
                return new CustomDateTime({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: {
                        pattern: parent.getDateTimeSettings()!.datePattern!
                    },
                    validationLogic: validationLogic
                });
        }
    }

    private getTimeControl(property: IProp, navProperty?: string) {
        const parent = this.getParent() as ContentGenerator;

        if (parent.getDateTimeSettings()?.timePattern) {
            if (property.readonly) {
                return this.getTimeText(property, navProperty);
            } else {
                return this.getTimePicker(property, navProperty);
            }
        } else {
            return this.getSmartField(property, navProperty);
        }
    }

    private getTimeText(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;

        return new Text({
            visible: property.visible,
            text: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4),
                formatOptions: {
                    pattern: parent.getDateTimeSettings()!.timePattern
                }
            }
        });
    }

    private getTimePicker(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const validationLogic = parent.getValidationLogicByProperty(path);
        const timePicker = new TimePicker({
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: new CustomTime({
                    property: property,
                    requiredPropertyErrorMessage: parent.getRequiredPropertyErrorMessage(),
                    formatOptions: {
                        pattern: parent.getDateTimeSettings()!.timePattern!
                    },
                    validationLogic: validationLogic
                })
            }
        });

        Messaging.registerObject(timePicker, true);
        return timePicker;
    }

    private getNumberControl(property: IProp, navProperty?: string) {
        const parent = this.getParent() as ContentGenerator;
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());

        if (numberSettings) {
            if (property.readonly) {
                return this.getNumberText(property, navProperty);
            } else {
                return this.getNumberInput(property, navProperty);
            }
        } else {
            return this.getSmartField(property, navProperty);
        }
    }

    private getNumberText(property: IProp, navProperty?: string) {
        return new Text({
            visible: property.visible,
            text: this.getNumberBinding(property, navProperty)
        });
    }

    private getNumberInput(property: IProp, navProperty?: string) {
        const input = new Input({
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

    private getSmartField(property: IProp, navProperty?: string) {
        const value = navProperty ? `{${navProperty}/${property.name}}` : `{${property.name}}`;

        const field = new SmartField({
            value: value,
            mandatory: property.required,
            editable: property.readonly === false,
            visible: property.visible
        });

        return field;
    }
}