import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/odata/v2/Context";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Content from "ui5/antares/pro/component/v2/Content";
import { EntryType } from "ui5/antares/pro/types/component/v2/Content";

/**
 * @namespace ui5.antares.pro.entry.v2
 */
export default abstract class Entry extends Content {
    private context: Context;

    constructor(controller: Controller, entitySetName: string, entryType: EntryType, oDataModelRef?: string | ODataModel) {
        super(controller, entitySetName, entryType, oDataModelRef);
    }

    protected async resolveContext(): Promise<Context> {
        switch (this.getEntryType()) {
            case "Create":
                this.createEntry();
                break;
            default:
                break;
        }

        return this.context;
    }

    private createEntry() {
        this.context = this.getODataModel().createEntry(this.getEntitySetPath(), {}) as Context;
    }
}