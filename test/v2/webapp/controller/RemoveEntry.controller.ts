/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Component from "sap/ui/core/Component";
import ComponentContainer from "sap/ui/core/ComponentContainer";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import DeleteComponent from "ui5/antares/pro/v2/component/delete/Component";
import DeleteEntry from "ui5/antares/pro/v2/entry/DeleteEntry";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class RemoveEntry extends BaseController {
    private employeeID: string;
    private deleteComponent?: DeleteComponent;

    /* ======================================================================================================================= */
    /* Lifecycle methods                                                                                                       */
    /* ======================================================================================================================= */

    public onInit(): void {
        this.getRouter().getRoute("RouteRemoveEntry")?.attachPatternMatched(this.onObjectMatched, this);
    }

    /* ======================================================================================================================= */
    /* Event Handlers                                                                                                          */
    /* ======================================================================================================================= */

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */

    private onObjectMatched(event: Route$PatternMatchedEvent) {
        this.employeeID = (event.getParameter("arguments") as { employeeID: string; }).employeeID;

        if (this.deleteComponent) {
            this.deleteComponent.getEntryInstance().reload<{ ID: string; }>({
                ID: this.employeeID
            });
        } else {
            this.createComponent();
        }
    }

    private async createComponent() {
        const owner = this.getOwnerComponent() as Component;
        const entry = new DeleteEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company"
        });

        this.deleteComponent = await Promise.resolve(owner.createComponent({
            usage: "ui5AntaresProDeleteEntry"
        })) as DeleteComponent;

        this.getById<ComponentContainer>("ccUI5AntaresProDeleteEntry").setComponent(this.deleteComponent);

        this.deleteComponent.run<{ ID: string; }>(entry, {
            ID: this.employeeID
        });
    }
}