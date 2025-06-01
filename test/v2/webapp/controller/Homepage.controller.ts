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
            entitySet: "Employees",
            metadataLabelEnabled: true,
            formType: "SimpleForm",
            dateTimeSettings: {
                datePattern: "dd MMMM y",
                dateTimePattern: "dd MMMM y - hh:mm:ss a",
                timePattern: "hh:mm:ss a"
            },
            requiredProperties: ["hireDate"],
            valueLists: [
                new ValueList({
                    collectionPath: "Countries",
                    localDataProperty: "countryCode",
                    parameters: [{
                        type: "InOut",
                        localDataProperty: "countryCode",
                        valueListProperty: "code"
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