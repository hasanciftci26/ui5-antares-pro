import TextArea from "sap/m/TextArea";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import { CreateEntry$SubmitSuccessEvent } from "ui5/antares/pro/types/v2/entry/CreateEntry.types";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import CustomElement from "ui5/antares/pro/v2/ui/CustomElement";

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
                dateTimePattern: "d MMMM y - HH:mm",
                timePattern: "HH:mm"
            },
            numberSettings: {
                groupingSeparator: " ",
                decimalSeparator: ","
            },
            booleanSettings: {
                trueText: "Evet",
                falseText: "Hayir"
            },
            propertySettings: [{
                name: "salary",
                required: true
            },{
                name: "toContract/contractType",
                readonly: true
            },{
                name: "toContract/contractStart",
                readonly: true
            }],
            navProperties: ["toContract"]
        });

        entry.execute({
            isActive: true,
            salary: 135468684.88,
            toContract: {
                contractType: "test",
                contractStart: new Date()
            }
        });
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private onSubmitSuccess(event: CreateEntry$SubmitSuccessEvent<{ testID: string; }>) {
        event.getParameter("data");
    }

    private onValidateFirstName(element: TextArea) {
        return element.getValue() !== "";
    }
}