import Label from "sap/m/Label";
import ManagedObject from "sap/ui/base/ManagedObject";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class SmartFormGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            form: { type: "object", visibility: "public" }
        }
    };

    constructor() {
        super();
    }

    public generate() {
        const form = new SmartForm({
            editable: true,
            groups: new Group({
                groupElements: this.getGroupElements()
            })
        });

        this.setForm(form);
    }

    private getGroupElements() {
        const elements: GroupElement[] = [];
        const parent = this.getParent() as ContentGenerator;
        const properties = parent.getParentMetaContext().getProps();

        for (const property of properties) {
            elements.push(new GroupElement({
                label: new Label({ text: property.label }),
                elements: this.getSmartField(property)
            }));
        }

        return elements;
    }

    private getSmartField(property: IProp) {
        const field = new SmartField({
            value: `{${property.name}}`,
            mandatory: property.required,
            editable: property.readonly === false
        });

        return field;
    }
}