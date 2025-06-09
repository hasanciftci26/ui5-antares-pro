/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import TimeValidation from "ui5/antares/pro/v2/validation/TimeValidation";
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
            dateTimeSettings: {
                datePattern: "d MMMM y",
                dateTimePattern: "d MMMM y HH:mm",
                timePattern: "HH:mm"
            },
            numberSettings: {
                groupingEnabled: true,
                groupingSize: 3,
                groupingSeparator: " ",
                decimalSeparator: ","
            }
        });

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "level",
            operator: "LT",
            value1: 13,
            errorMessage: "Level must be less than 13!"
        }));

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "dateOfBirth",
            operator: "LT",
            value1: new Date("2000-01-01"),
            errorMessage: "Date of Birth must be older than 01 January 2000!"
        }));

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "workingStartTime",
            operator: "LT",
            value1: new TimeValidation("10", "00", "00"),
            errorMessage: "Working Start Time must be earlier than 10:00:00!"
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}