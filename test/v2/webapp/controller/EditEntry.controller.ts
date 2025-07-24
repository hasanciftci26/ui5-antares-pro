/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Component from "sap/ui/core/Component";
import ComponentContainer from "sap/ui/core/ComponentContainer";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import UpdateComponent from "ui5/antares/pro/v2/component/update/Component";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class EditEntry extends BaseController {
    private employeeID: string;
    private updateComponent?: UpdateComponent;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        this.getRouter().getRoute("RouteEditEntry")?.attachPatternMatched(this.onObjectMatched, this);
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private onObjectMatched(event: Route$PatternMatchedEvent) {
        this.employeeID = (event.getParameter("arguments") as { employeeID: string; }).employeeID;

        if (this.updateComponent) {
            this.updateComponent.getEntryInstance().reload<{ ID: string; }>({
                ID: this.employeeID
            });
        } else {
            this.createComponent();
        }
    }

    private async createComponent() {
        const owner = this.getOwnerComponent() as Component;
        const entry = new UpdateEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company"
        });

        this.updateComponent = await Promise.resolve(owner.createComponent({
            usage: "ui5AntaresProUpdateEntry"
        })) as UpdateComponent;

        this.getById<ComponentContainer>("ccUI5AntaresProUpdateEntry").setComponent(this.updateComponent);

        this.updateComponent.run<{ ID: string; }>(entry, {
            ID: this.employeeID
        });
    }
}