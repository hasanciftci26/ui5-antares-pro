/* eslint-disable @typescript-eslint/no-unsafe-call */
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";
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
            requiredProperties: ["countryCode"]
        });

        entry.addValueList(new ValueList({
            localDataProperty: "countryCode",
            collectionPath: "Countries",
            fixedValues: true,
            parameters: [{
                localDataProperty: "countryCode",
                type: "InOut",
                valueListProperty: "code"
            }, {
                type: "DisplayOnly",
                valueListProperty: "name"
            }]
        }));

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "countryCode",
            operator: "EQ",
            value1: "DE",
            errorMessage: "Country can only be germany"
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}