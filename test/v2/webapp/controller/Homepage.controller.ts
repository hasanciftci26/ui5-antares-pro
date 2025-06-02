/* eslint-disable @typescript-eslint/no-unsafe-call */
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
            metadataLabelEnabled: true,
            formType: "SimpleForm",
            dateTimeSettings: {
                datePattern: "dd MMMM y",
                dateTimePattern: "dd MMMM y - hh:mm:ss a",
                timePattern: "hh:mm:ss a"
            },
            guidGenerationMode: "None",
            guidVisibilityMode: "All",
            valueLists: [
                new ValueList({
                    searchSupported: true,
                    collectionPath: "Employees",
                    localDataProperty: "employeeID",
                    parameters: [{
                        type: "InOut",
                        localDataProperty: "employeeID",
                        valueListProperty: "ID"
                    }, {
                        type: "DisplayOnly",
                        valueListProperty: "firstName"
                    }, {
                        type: "DisplayOnly",
                        valueListProperty: "lastName"
                    }, {
                        type: "DisplayOnly",
                        valueListProperty: "dateOfBirth"
                    }, {
                        type: "FilterOnly",
                        valueListProperty: "level"
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