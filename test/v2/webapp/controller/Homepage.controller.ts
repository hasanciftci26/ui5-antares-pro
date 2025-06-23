import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";

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
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toContract"
        }));        

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications",
            visibleColumnCount: 3
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}