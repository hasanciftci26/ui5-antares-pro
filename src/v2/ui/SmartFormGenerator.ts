import DatePicker from "sap/m/DatePicker";
import DateTimePicker from "sap/m/DateTimePicker";
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
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/SmartFormGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

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
        const datePicker = new DatePicker({
            visible: property.visible,
            required: property.required,
            value: {
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
        const parent = this.getParent() as ContentGenerator;
        const dateTimePicker = new DateTimePicker({
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4),
                formatOptions: {
                    pattern: parent.getDateTimeSettings()!.dateTimePattern
                }
            }
        });

        Messaging.registerObject(dateTimePicker, true);
        return dateTimePicker;
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
        const timePicker = new TimePicker({
            visible: property.visible,
            required: property.required,
            value: {
                path: path,
                type: "sap.ui.model.odata.type." + property.type.substring(4),
                formatOptions: {
                    pattern: parent.getDateTimeSettings()!.timePattern
                }
            }
        });

        Messaging.registerObject(timePicker, true);
        return timePicker;
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