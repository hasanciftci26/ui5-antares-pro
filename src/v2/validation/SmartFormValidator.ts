import ManagedObject from "sap/ui/base/ManagedObject";
import SmartField from "sap/ui/comp/smartfield/SmartField";
import GroupElement from "sap/ui/comp/smartform/GroupElement";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ControlType } from "ui5/antares/pro/types/v2/ui/FormGeneratorBase.types";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class SmartFormValidator extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true
    };

    constructor() {
        super();
    }

    public async validate() {
        const parent = this.getParent() as SmartFormGenerator;
        const form = parent.getForm();
        let valid = true;

        for (const group of form.getGroups()) {
            for (const element of group.getGroupElements()) {
                const control = (element as GroupElement).getElements()[0];
                const controlType = control.data("UI5AntaresProControlType") as ControlType | undefined;

                if (!controlType) {
                    continue;
                }

                if (controlType === "Standard") {
                    if (control instanceof SmartField) {
                        try {
                            await control.checkValuesValidity();
                        } catch (error) {
                            valid = false;

                            if (this.hasMessage(error)) {
                                control.setValueState("Error");
                                control.setValueStateText(error.message);
                            }
                        }
                    }
                } else if (controlType === "Custom") {
                    const propertyName = control.getCustomData().find(data => data.getKey() === "UI5AntaresProPropertyName");

                    if (!propertyName) {
                        continue;
                    }

                    const customElement = this.getOwnerParent().getCustomElementByProperty(propertyName.getValue());

                    if (customElement) {
                        const result = await customElement.validate();

                        if (!result) {
                            valid = false;
                        }
                    }
                }
            }
        }

        return valid;
    }

    private hasMessage(error: unknown): error is { message: string } {
        return typeof error === "object" && error !== null && "message" in error;
    }

    private getOwnerParent() {
        return this.getParent() as FormGeneratorBase;
    }
}