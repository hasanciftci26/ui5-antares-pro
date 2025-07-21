/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import Title from "sap/m/Title";
import View from "sap/ui/core/mvc/View";
import { Binding$ChangeEvent } from "sap/ui/model/Binding";
import ListBinding from "sap/ui/model/ListBinding";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import DeleteEntry from "ui5/antares/pro/v2/entry/DeleteEntry";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";

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

    public onEmployeesBindingChange(event: Binding$ChangeEvent) {
        const count = (event.getSource() as ListBinding).getCount() || 0;
        ((this.getView() as View).byId("ttlEmployees") as Title).setText(`Employees (${count})`);
    }

    public onCreateNewEmployee() {
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company",
            formType: "SimpleForm",
            guidVisibilityMode: "All",
            metadataLabelEnabled: true,
            propertySettings: [{
                name: "firstName",
                required: true
            }, {
                name: "lastName",
                required: true
            }]
        });

        entry.run();
    }

    public onUpdateEmployee() {
        const entry = new UpdateEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company",
            guidVisibilityMode: "All",
            metadataLabelEnabled: true,
            propertySettings: [{
                name: "firstName",
                required: true
            }, {
                name: "lastName",
                required: true
            }]
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications"
        }));

        entry.run("tblEmployees");
    }

    public onDeleteEmployee() {
        const entry = new DeleteEntry({
            controller: this,
            entitySet: "Employees",
            modelRef: "company",
            guidVisibilityMode: "All",
            metadataLabelEnabled: true
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications"
        }));        

        entry.run("tblEmployees");
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}