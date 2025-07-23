/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import ComponentContainer, { ComponentContainer$ComponentCreatedEvent } from "sap/ui/core/ComponentContainer";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import Component from "ui5/antares/pro/v2/component/update/Component";
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
        const component = event.getParameter("component") as Component;
        const entry = new UpdateEntry({
            controller: this,
            entitySet: "Employees"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications"
        }));

        component.run<{ ID: string; }>(entry, {
            ID: "5e4c2a43-93ab-4bca-b6f7-58f0b6712920"
        });
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}