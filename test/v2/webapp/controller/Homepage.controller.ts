import { ComponentContainer$ComponentCreatedEvent } from "sap/ui/core/ComponentContainer";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import Component from "ui5/antares/pro/v2/component/entry/Component";
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
        const entry = new CreateEntry({ controller: this, entitySet: "Employees" });
        entry.execute();
    }

    public onAntaresComponentCreated(event: ComponentContainer$ComponentCreatedEvent) {
        const component = event.getParameter("component") as Component;
        component.execute(this);
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

}