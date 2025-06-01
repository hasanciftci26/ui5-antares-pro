import CheckBox from "sap/m/CheckBox";
import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
import Input from "sap/m/Input";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import TimePicker from "sap/m/TimePicker";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import Control from "sap/ui/core/Control";
import Messaging from "sap/ui/core/Messaging";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { IDateBinding, IDateTimeBinding, INumberBinding, ISettings } from "ui5/antares/pro/types/v2/ui/SimpleFormGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import NumberSettings from "ui5/antares/pro/v2/util/NumberSettings";

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
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
    }

    public generate() {
        const form = new SimpleForm({
            editable: true,
            content: this.getContent()
        });

        this.setForm(form);
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
            visible: property.visible,
            text: this.getDateBinding(property, navProperty)
        });
    }

    private getDatePicker(property: IProp, navProperty?: string) {
        const datePicker = new DatePicker({
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
        const binding: IDateBinding = {
            path: path,
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

    private getDateTimeControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getDateTimeText(property, navProperty);
        } else {
            return this.getDateTimePicker(property, navProperty);
        }
    }

    private getDateTimeText(property: IProp, navProperty?: string) {
        return new Text({
            visible: property.visible,
            text: this.getDateTimeBinding(property, navProperty)
        });
    }

    private getDateTimePicker(property: IProp, navProperty?: string) {
        const dateTimePicker = new DateTimePicker({
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
        const binding: IDateTimeBinding = {
            path: path,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (dateTimePattern) {
            binding.formatOptions = {
                pattern: dateTimePattern
            };
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
            visible: property.visible,
            text: this.getTimeBinding(property, navProperty)
        });
    }

    private getTimePicker(property: IProp, navProperty?: string) {
        const timePicker = new TimePicker({
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
        const binding: IDateTimeBinding = {
            path: path,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (timePattern) {
            binding.formatOptions = {
                pattern: timePattern
            };
        }

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
            visible: property.visible,
            text: this.getNumberBinding(property, navProperty)
        });
    }

    private getNumberInput(property: IProp, navProperty?: string) {
        const input = new Input({
            visible: property.visible,
            required: property.required,
            value: this.getNumberBinding(property, navProperty)
        });

        Messaging.registerObject(input, true);
        return input;
    }

    private getNumberBinding(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const parent = this.getParent() as ContentGenerator;
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());
        const binding: INumberBinding = {
            path: path,
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

    private getBooleanControl(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;

        return new CheckBox({
            visible: property.visible,
            required: property.required,
            selected: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            },
            editable: property.readonly === false
        });
    }

    private getStringControl(property: IProp, navProperty?: string) {
        if (property.readonly) {
            return this.getStringText(property, navProperty);
        } else {
            return this.getStringInput(property, navProperty);
        }
    }

    private getStringText(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;

        return new Text({
            visible: property.visible,
            text: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            }
        });
    }

    private getStringInput(property: IProp, navProperty?: string) {
        const path = navProperty ? `${navProperty}/${property.name}` : property.name;
        const input = new Input({
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            },
            maxLength: property.maxLength
        });

        Messaging.registerObject(input, true);
        return input;
    }
}