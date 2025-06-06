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
                dateTimePattern: "dd MMMM y - HH:mm",
                timePattern: "HH:mm"
            },
            valueLists: [
                new ValueList({
                    localDataProperty: "countryCode",
                    collectionPath: "Countries",
                    parameters: [{
                        type: "InOut",
                        localDataProperty: "countryCode",
                        valueListProperty: "code"
                    }, {
                        type: "DisplayOnly",
                        valueListProperty: "name"
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