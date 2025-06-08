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
            },
            propertyOrder: ["level"]
        });

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "dateOfBirth",
            operator: "LT",
            value1: new Date("2024-01-01"),
            errorMessage: "Date of Birth must be smaller than 2024"
        }));   
        
        entry.addValidationLogic(new ValidationLogic({
            propertyName: "workingStartTime",
            operator: "LE",
            value1: 57600000,
            errorMessage: "Working start time can only be smaller than 16:00:00"
        }));     
        
        entry.addValidationLogic(new ValidationLogic({
            propertyName: "totalExperience",
            operator: "LT",
            value1: BigInt("4646848646846846846"),
            errorMessage: "Total experience must be little than 4646848646846846846"
        }));          

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}