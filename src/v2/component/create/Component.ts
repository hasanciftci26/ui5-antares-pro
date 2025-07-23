import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import UIComponent from "sap/ui/core/UIComponent";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";

/**
 * @namespace ui5.antares.pro.v2.component.create
 */
export default class Component extends UIComponent {
    static metadata: ComponentMetadata = {
        manifest: "json",
        library: "ui5.antares.pro",
        properties: {
            entryInstance: { type: "object", visibility: "hidden" }
        }
    };

    public init() {
        ReuseComponentSupport.mixInto(this, "ui5AntaresCreateEntryComponent", true);
        super.init();
    }

    public createContent() {
        const vbox = new VBox({
            busyIndicatorDelay: 0
        });

        return vbox;
    }

    public run<T extends Record<string, any> = Record<string, any>>(entryInstance: CreateEntry, initialData?: T) {
        const vbox = this.getRootControl() as VBox;
        this.setEntryInstance(entryInstance);
        entryInstance.initComponent(vbox, initialData);
    }

    public getEntryInstance() {
        return this.getProperty("entryInstance") as CreateEntry;
    }

    private setEntryInstance(entryInstance: CreateEntry) {
        this.setProperty("entryInstance", entryInstance);
    }
}