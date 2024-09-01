import BaseController from "test/ui5/antares/pro/controller/BaseController";
import EntryCreate from "ui5/antares/pro/entry/v2/EntryCreate";

/**
 * @namespace test.ui5.antares.pro.controller
 */
export default class Homepage extends BaseController {

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {

    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onCreateProduct() {
        const entry = new EntryCreate(this, "Products");
        entry.setDialogTitle("Test");
        entry.setInvisibleProperties(["brand"]);
        entry.setRequiredProperties(["name"]);
        entry.create();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}