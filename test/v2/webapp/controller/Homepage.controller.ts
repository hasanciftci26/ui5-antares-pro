import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import { CreateEntry$SubmitSuccessEvent } from "ui5/antares/pro/types/v2/entry/CreateEntry.types";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";

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
            requiredProperties: ["firstName", "lastName"],
            formType: "SimpleForm"
        });

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private onSubmitSuccess(event: CreateEntry$SubmitSuccessEvent<{ testID: string; }>) {
        event.getParameter("data");
    }
}