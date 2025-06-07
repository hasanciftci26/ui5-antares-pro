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
            formType: "SimpleForm"
        });

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "level",
            operator: "LT",
            value1: 13,
            errorMessage: "Level must be lower than 13"
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}