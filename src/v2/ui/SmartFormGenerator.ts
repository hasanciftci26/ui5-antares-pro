import Label from "sap/m/Label";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import Group from "sap/ui/comp/smartform/Group";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import SmartForm from "sap/ui/comp/smartform/SmartForm";
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
        const value = navProperty ? `{${navProperty}/${property.name}}` : `{${property.name}}`;
        const field = new SmartField({
            value: value,
            mandatory: property.required,
            editable: property.readonly === false
        });

        return field;
    }
}