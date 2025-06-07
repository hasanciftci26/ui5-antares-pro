/* eslint-disable @typescript-eslint/no-unsafe-call */
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import ValidationLogic from "ui5/antares/pro/v2/validation/ValidationLogic";

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
            requiredProperties: ["level", "dateOfBirth"],
            dateTimeSettings: {
                datePattern: "dd MMMM y",
                dateTimePattern: "dd MMMM y HH:mm:ss",
                timePattern: "HH:mm:ss"
            },
            numberSettings: {
                groupingEnabled: true,
                groupingSize: 3,
                decimalSeparator: ",",
                groupingSeparator: "."
            }
        });

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "level",
            operator: "BT",
            value1: 15,
            value2: 25,
            errorMessage: "Level must be between 15 and 25."
        }));

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "dateOfBirth",
            operator: "LT",
            value1: new Date("2024-01-01"),
            errorMessage: "Date of Birth must be smaller than 2024"
        }));        

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}