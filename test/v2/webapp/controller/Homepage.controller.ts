import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
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
            entitySet: "EmployeeContracts",
            formType: "SimpleForm",
            guidVisibilityMode: "All",
            valueLists: [
                new ValueList({
                    localDataProperty: "employeeID",
                    entitySet: "Employees",
                    searchSupported: true,
                    caseSensitiveSearch: true,
                    propertyLabels: [{
                        name: "code",
                        label: "Country Cdew Test"
                    }],
                    parameters: [{
                        type: "InOut",
                        localDataProperty: "employeeID",
                        valueListProperty: "ID"
                    }, {
                        type: "DisplayOnly",
                        valueListProperty: "firstName"
                    },{
                        type: "DisplayOnly",
                        valueListProperty: "lastName"
                    }]
                })
            ]
        });

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}