import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
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
            dateTimeSettings: {
                datePattern: "d MMMM y",
                dateTimePattern: "d MMMM y HH:mm",
                timePattern: "HH:mm"
            },
            numberSettings: {
                decimalSeparator: ",",
                groupingSeparator: " ",
                groupingSize: 4
            },
            propertySettings: [{
                name: "lastName",
                required: true
            }]
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toContract",
            propertySettings: [{
                name: "contractType",
                required: true
            }],
            validationLogics: [
                new ValidationLogic({
                    propertyName: "contractType",
                    operator: "Regex",
                    value1: new RegExp("^[A-Z0-9_]+$"),
                    errorMessage: "Contract Type must be constant case"
                })
            ]
        }));

        entry.addValidationLogic(new ValidationLogic({
            propertyName: "lastName",
            operator: "Regex",
            value1: new RegExp("^[A-Z0-9_]+$"),
            errorMessage: "Last Name must be constant case"
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}