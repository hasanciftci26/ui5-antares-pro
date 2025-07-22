import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";

/**
 * @namespace ui5.antares.pro.v2.component.update
 */
export default class Component extends UIComponent {
    static metadata: ComponentMetadata = {
        manifest: "json",
        library: "ui5.antares.pro",
        properties: {
            entitySet: { type: "string", visibility: "public" },
            excludedProperties: { type: "string[]", visibility: "public", defaultValue: [] }
        }
    };

    public init() {
        ReuseComponentSupport.mixInto(this, "ui5AntaresEntryComponentModel", true);
        super.init();
    }

    public createContent() {
        const vbox = new VBox();
        return vbox;
    }

    public async execute(controller: Controller) {
        // const vbox = this.getRootControl() as VBox;
        // const entry = new CreateEntry({
        //     entitySet: this.getEntitySet(),
        //     controller: controller
        // });

        // entry.execute();
        // vbox.addItem(new Input({
        //     value: {
        //         path: "ui5AntaresEntryComponentModel>/entitySet"
        //     }
        // }));
        // vbox.addItem(new Button({
        //     text: "Press me",
        //     press: () => {
        //         alert(this.getEntitySet());
        //     }
        // }));
    }
}