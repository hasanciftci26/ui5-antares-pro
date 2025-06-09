/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
            guidGenerationMode: "None",
            guidVisibilityMode: "All"
        });

        entry.addValueList(new ValueList({
            localDataProperty: "employeeID",
            collectionPath: "Employees",
            fixedValues: true,
            fixedValueSeparator: " - ",
            parameters: [{
                localDataProperty: "employeeID",
                type: "InOut",
                valueListProperty: "ID"
            }, {
                type: "DisplayOnly",
                valueListProperty: "firstName"
            }, {
                type: "DisplayOnly",
                valueListProperty: "lastName"
            }]
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}