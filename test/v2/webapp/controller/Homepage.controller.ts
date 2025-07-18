import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import DeleteEntry from "ui5/antares/pro/v2/entry/DeleteEntry";
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
        const entry = new DeleteEntry({
            controller: this,
            entitySet: "Employees",
            formType: "SimpleForm",
            dateTimeSettings: {
                datePattern: "d MMMM y",
                dateTimePattern: "d MMMM y HH:mm",
                timePattern: "HH:mm"
            }
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications"
        }));        

        entry.run({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ID: "a1f6e9d0-48b5-4b0f-9a7d-1e230f721d6a"
        });
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}