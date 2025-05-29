import Button from "sap/m/Button";
import Dialog, { EscapeHandler } from "sap/m/Dialog";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class DialogGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            dialog: { type: "object", visibility: "public" },
            operation: { type: "string", visibility: "public" }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
    }

    public generate() {
        const parent = this.getParent() as ContentGenerator;

        const dialog = new Dialog({
            draggable: true,
            resizable: true,
            title: parent.getFormTitle(),
            escapeHandler: this.onEscape as EscapeHandler,
            endButton: this.getEndButton()
        });

        this.setDialog(dialog);
    }

    private getEndButton() {
        return new Button({
            text: "Close",
            press: () => {
                this.getDialog().close();
            }
        });
    }

    private onEscape(event: { resolve: Function; reject: Function; }) {
        event.resolve();
    }
}