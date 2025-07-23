/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Component from "sap/ui/core/Component";
import ComponentContainer, { ComponentContainer$ComponentCreatedEvent } from "sap/ui/core/ComponentContainer";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateComponent from "ui5/antares/pro/v2/component/create/Component";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class NewEntry extends BaseController {

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {

    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onCreateEntryComponentCreated(event: ComponentContainer$ComponentCreatedEvent) {
        const component = event.getParameter("component") as CreateComponent;
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company"
        });

        component.run(entry);
    }

    public onCreateEmployee() {
        const component = Component.getComponentById(
            this.getById<ComponentContainer>("ccUI5AntaresProCreateEntry").getComponent() as string
        ) as CreateComponent;

        component.getEntryInstance().commit();
    }    

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}