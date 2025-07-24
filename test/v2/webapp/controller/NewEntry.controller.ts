/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Component from "sap/ui/core/Component";
import ComponentContainer from "sap/ui/core/ComponentContainer";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateComponent from "ui5/antares/pro/v2/component/create/Component";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class NewEntry extends BaseController {
    private createEntryComponent?: CreateComponent;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        this.getRouter().getRoute("RouteNewEntry")?.attachPatternMatched(this.onObjectMatched, this);
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */


    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private onObjectMatched() {
        if (this.createEntryComponent) {
            this.createEntryComponent.getEntryInstance().reset();
            this.createEntryComponent.getEntryInstance().reload();
        } else {
            this.createComponent();
        }
    }

    private async createComponent() {
        const owner = this.getOwnerComponent() as Component;
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company"
        });

        this.createEntryComponent = await Promise.resolve(owner.createComponent({
            usage: "ui5AntaresProCreateEntry"
        })) as CreateComponent;

        this.getById<ComponentContainer>("ccUI5AntaresProCreateEntry").setComponent(this.createEntryComponent);
        this.createEntryComponent.run(entry);
    }
}