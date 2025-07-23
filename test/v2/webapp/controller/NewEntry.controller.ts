/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import ComponentContainer, { ComponentContainer$ComponentCreatedEvent } from "sap/ui/core/ComponentContainer";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import Component from "ui5/antares/pro/v2/component/create/Component";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";

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
        const component = event.getParameter("component") as Component;
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications"
        }));

        component.run(entry);
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}