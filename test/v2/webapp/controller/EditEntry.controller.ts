/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Component from "sap/ui/core/Component";
import ComponentContainer, { ComponentContainer$ComponentCreatedEvent } from "sap/ui/core/ComponentContainer";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import UpdateComponent from "ui5/antares/pro/v2/component/update/Component";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class EditEntry extends BaseController {

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {

    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    public onUpdateEntryComponentCreated(event: ComponentContainer$ComponentCreatedEvent) {
        const component = event.getParameter("component") as UpdateComponent;
        const entry = new UpdateEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications"
        }));

        component.run<{ ID: string; }>(entry, {
            ID: "5e4c2a43-93ab-4bca-b6f7-58f0b6712920"
        });
    }

    public onUpdateEmployee() {
        const component = Component.getComponentById(
            this.getById<ComponentContainer>("ccUI5AntaresProUpdateEntry").getComponent() as string
        ) as UpdateComponent;

        component.getEntryInstance().commit();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}