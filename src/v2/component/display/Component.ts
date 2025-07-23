import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/odata/v2/Context";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";
import DisplayEntry from "ui5/antares/pro/v2/entry/DisplayEntry";

/**
 * @namespace ui5.antares.pro.v2.component.display
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
        ReuseComponentSupport.mixInto(this, "ui5AntaresDisplayEntryComponent", true);
        super.init();
    }

    public override createContent() {
        const vbox = new VBox({
            busyIndicatorDelay: 0
        });

        return vbox;
    }

    public run<T extends Record<string, any> = Record<string, any>>(entryInstance: DisplayEntry, ref: Context | string | T) {
        const vbox = this.getRootControl() as VBox;
        this.setEntryInstance(entryInstance);
        entryInstance.initComponent(vbox, ref);
    }

    public getEntryInstance() {
        return this.getProperty("entryInstance") as DisplayEntry;
    }

    private setEntryInstance(entryInstance: DisplayEntry) {
        this.setProperty("entryInstance", entryInstance);
    }
}