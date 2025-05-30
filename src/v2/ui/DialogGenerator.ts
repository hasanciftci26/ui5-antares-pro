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
        },
        events: {
            submitted: {
                allowPreventDefault: false
            },
            closed: {
                allowPreventDefault: false
            }
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
            endButton: this.getEndButton(),
            escapeHandler: this.onEscape as EscapeHandler
        });

        if (this.getOperation() !== "Read") {
            dialog.setBeginButton(this.getBeginButton());
        }

        this.setDialog(dialog);
    }

    private getBeginButton() {
        const parent = this.getParent() as ContentGenerator;

        return new Button({
            text: parent.getSubmitButtonText(),
            type: parent.getSubmitButtonType(),
            press: () => {
                this.fireSubmitted({ dialog: this.getDialog() });
            }
        });
    }

    private getEndButton() {
        const parent = this.getParent() as ContentGenerator;

        return new Button({
            text: parent.getCloseButtonText(),
            type: parent.getCloseButtonType(),
            press: () => {
                this.getDialog().close();
                this.fireClosed({ dialog: this.getDialog() });
            }
        });
    }

    private onEscape(event: { resolve: Function; reject: Function; }) {
        event.resolve();
        this.fireClosed({ dialog: this.getDialog() });
    }
}