import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
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
        const entry = new CreateEntry({
            controller: this,
            modelRef: "northwind",
            entitySet: "Orders",
            formType: "SimpleForm",
            guidVisibilityMode: "All"
        });

        entry.addValueList(new ValueList({
            entitySet: "Customers",
            localDataProperty: "CustomerID",
            parameters: [{
                type: "InOut",
                localDataProperty: "CustomerID",
                valueListProperty: "CustomerID"
            },{
                type: "DisplayOnly",
                valueListProperty: "CompanyName"
            }]
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}