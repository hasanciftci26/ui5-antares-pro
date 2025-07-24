/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Component from "sap/ui/core/Component";
import ComponentContainer from "sap/ui/core/ComponentContainer";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import DisplayComponent from "ui5/antares/pro/v2/component/display/Component";
import DisplayEntry from "ui5/antares/pro/v2/entry/DisplayEntry";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class ShowEntry extends BaseController {
    private employeeID: string;
    private displayComponent?: DisplayComponent;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        this.getRouter().getRoute("RouteShowEntry")?.attachPatternMatched(this.onObjectMatched, this);
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private onObjectMatched(event: Route$PatternMatchedEvent) {
        this.employeeID = (event.getParameter("arguments") as { employeeID: string; }).employeeID;

        if (this.displayComponent) {
            this.displayComponent.getEntryInstance().reload<{ ID: string; }>({
                ID: this.employeeID
            });
        } else {
            this.createComponent();
        }
    }

    private async createComponent() {
        const owner = this.getOwnerComponent() as Component;
        const entry = new DisplayEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company"
        });

        this.displayComponent = await Promise.resolve(owner.createComponent({
            usage: "ui5AntaresProDisplayEntry"
        })) as DisplayComponent;

        this.getById<ComponentContainer>("ccUI5AntaresProDisplayEntry").setComponent(this.displayComponent);

        this.displayComponent.run<{ ID: string; }>(entry, {
            ID: this.employeeID
        });
    }
}