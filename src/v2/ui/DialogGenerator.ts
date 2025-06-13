import Button from "sap/m/Button";
import Dialog, { EscapeHandler } from "sap/m/Dialog";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import TableGenerator from "ui5/antares/pro/v2/ui/TableGenerator";

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
        const content = this.getOwnerContentGenerator();
        const parent = this.getOwnerParent();

        const dialog = new Dialog({
            draggable: true,
            resizable: true,
            title: {
                path: this.getParentModelName() + ">/formTitle"
            },
            endButton: this.getEndButton(),
            escapeHandler: this.onEscape as EscapeHandler
        });

        dialog.setModel(content.getODataModel());
        dialog.setModel(parent.getModel(this.getParentModelName()), this.getParentModelName());

        if (this.getOperation() !== "Read") {
            dialog.setBeginButton(this.getBeginButton());
        }

        this.setDialog(dialog);
    }

    private getBeginButton() {
        return new Button({
            text: {
                path: this.getParentModelName() + ">/submitButtonText"
            },
            type: {
                path: this.getParentModelName() + ">/submitButtonType"
            },
            press: () => {
                this.fireSubmitted({ dialog: this.getDialog() });
            }
        });
    }

    private getEndButton() {
        return new Button({
            text: {
                path: this.getParentModelName() + ">/closeButtonText"
            },
            type: {
                path: this.getParentModelName() + ">/closeButtonType"
            },
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

    private getOwnerParent() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.ui.TableGenerator":
                return parent as TableGenerator;
            default:
                return parent as ContentGenerator;
        }
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

    private getParentModelName() {
        const parent = this.getParent() as ManagedObject;

        switch (parent.getMetadata().getName()) {
            case "ui5.antares.pro.v2.ui.TableGenerator":
                return "table";
            default:
                return "content";
        }
    }
}