import Button from "sap/m/Button";
import Dialog from "sap/m/Dialog";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/DialogGenerator.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * **Internal use only.**
 *
 * This class is part of the internal implementation of the **UI5 Antares Pro** library
 * and is not intended for public use or direct consumption.
 *
 * It may change or be removed without notice in future versions.
 *
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.ui
 */
export default class DialogGenerator extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            dialogModel: { type: "object" },
            dialog: { type: "object" }
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

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }

    public generate() {
        const factory = this.getFactory();

        const dialog = new Dialog({
            draggable: true,
            resizable: true,
            title: {
                path: "dialog>/dialogTitle"
            },
            endButton: this.getEndButton(),
            escapeHandler: this.onEscape.bind(this)
        });

        dialog.setModel(factory.getODataModel());
        dialog.setModel(this.getDialogModel(), "dialog");

        if (this.getOperation() !== "Read") {
            dialog.setBeginButton(this.getBeginButton());
        }

        this.setDialog(dialog);
    }

    private getBeginButton() {
        return new Button({
            text: {
                path: "dialog>/submitButtonText"
            },
            type: {
                path: "dialog>/submitButtonType"
            },
            press: () => {
                this.fireSubmitted({ dialog: this.getDialog() });
            }
        });
    }

    private getEndButton() {
        return new Button({
            text: {
                path: "dialog>/closeButtonText"
            },
            type: {
                path: "dialog>/closeButtonType"
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

    private getOperation() {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA(["ui5.antares.pro.v2.ui.ResponsiveTableGenerator", "ui5.antares.pro.v2.ui.GridTableGenerator"])) {
            return (parent.getParent() as NavigationProperty).getOperation();
        }

        return (parent as Factory).getOperation();
    }

    private getFactory() {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA(["ui5.antares.pro.v2.ui.ResponsiveTableGenerator", "ui5.antares.pro.v2.ui.GridTableGenerator"])) {
            return (parent.getParent() as NavigationProperty).getOwnerParent();
        }

        return parent as Factory;
    }
}