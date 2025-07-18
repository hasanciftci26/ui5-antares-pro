import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

/**
 * @namespace test.v2.ui5.antares.pro.controller
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

    public onInitClass() {
        const entry = new UpdateEntry({
            controller: this,
            modelRef: "northwind",
            entitySet: "Customers",
            formType: "SimpleForm"
        });

        entry.run({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            CustomerID: "ALFKI"
        });
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}