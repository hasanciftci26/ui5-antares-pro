import ResourceBundle from "sap/base/i18n/ResourceBundle";
import BaseObject from "sap/ui/base/Object";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace ui5.antares.pro.core.v2
 */
export default abstract class LibraryResourceModel extends BaseObject {
    private libResourceModel: ResourceModel;

    constructor() {
        super();
        this.libResourceModel = new ResourceModel({
            bundleName: "ui5.antares.pro.i18n.i18n"
        });
    }

    // Get a text from library's i18n files.
    protected getLibraryText(key: string, params?: any[]): string {
        const bundle = this.libResourceModel.getResourceBundle() as ResourceBundle;
        return bundle.getText(key, params) as string;
    }
}