import BaseController from "test/ui5/antares/pro/controller/BaseController";
import EntryCreate from "ui5/antares/pro/entry/v2/EntryCreate";
import { IProduct } from "test/ui5/antares/pro/types/entity.types";

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
        const entry = new EntryCreate<IProduct>(this, "Products");
        entry.setDialogTitle("Test");
        entry.setInvisibleProperties(["brand"]);
        entry.setRequiredProperties(["name"]);
        entry.enableMetadataLabels();
        entry.attachBeforeSubmit(this.beforeCreateProduct, this);
        entry.create();
    }

    public onCreateCategory() {
        const entry = new EntryCreate<IProduct>(this, "Categories");
        entry.enableMetadataLabels();
        entry.create();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private beforeCreateProduct(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000);
        });
    }
}