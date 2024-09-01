import Controller from "sap/ui/core/mvc/Controller";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Entry from "ui5/antares/pro/entry/v2/Entry";

/**
 * @namespace ui5.antares.pro.entry.v2
 */
export default class EntryCreate extends Entry {
    constructor(controller: Controller, entitySetName: string, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, "Create", oDataModelRef);
    }

    public async create() {
        const context = await this.resolveContext();
        const dialog = await this.createContent(context);
        dialog.open();
    }
}