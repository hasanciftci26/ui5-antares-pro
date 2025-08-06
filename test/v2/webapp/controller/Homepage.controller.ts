/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import MessageBox from "sap/m/MessageBox";
import ObjectStatus from "sap/m/ObjectStatus";
import Table from "sap/m/Table";
import Title from "sap/m/Title";
import { ValueState } from "sap/ui/core/library";
import View from "sap/ui/core/mvc/View";
import { Binding$ChangeEvent } from "sap/ui/model/Binding";
import ListBinding from "sap/ui/model/ListBinding";
import Context from "sap/ui/model/odata/v2/Context";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CustomCell from "ui5/antares/pro/v2/custom/CustomCell";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import DeleteEntry from "ui5/antares/pro/v2/entry/DeleteEntry";
import DisplayEntry from "ui5/antares/pro/v2/entry/DisplayEntry";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import ValueList from "ui5/antares/pro/v2/valuelist/ValueList";

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

    public onCreateNewEmployeeDialog() {
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees",
            formType: "SimpleForm",
            propertySettings: [{
                name: "firstName",
                required: true
            }, {
                name: "lastName",
                required: true
            }]
        });

        entry.addValueList(new ValueList({
            localDataProperty: "countryCode",
            entitySet: "EmployeeCertifications",
            parameters: [{
                type: "InOut",
                localDataProperty: "countryCode",
                valueListProperty: "authority"
            }, {
                type: "DisplayOnly",
                valueListProperty: "issuedDate"
            }]
        }));

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications",
            noEntryErrorEnabled: true,
            noEntryErrorMessage: "Test",
            visibleRowCount: 3,
            inheritValues: [{
                parentProperty: "ID",
                targetProperty: "employeeID"
            }],
            customCells: [
                new CustomCell({
                    propertyName: "authority",
                    cell: new ObjectStatus({
                        text: {
                            path: "authority"
                        },
                        state: ValueState.Error
                    })
                })
            ]
        }));

        entry.run();
    }

    public onUpdateEmployeeDialog() {
        const entry = new UpdateEntry({
            controller: this,
            entitySet: "Employees"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toContract"
        }));


        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications",
            tableClass: "sap.m.Table"
        }));

        entry.run("tblEmployees");
    }

    public onDeleteEmployeeDialog() {
        const entry = new DeleteEntry({
            controller: this,
            entitySet: "Employees"
        });

        entry.run("tblEmployees");
    }

    public onDisplayEmployeeDialog() {
        const entry = new DisplayEntry({
            controller: this,
            entitySet: "Employees"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications",
            tableClass: "sap.m.Table"
        }));

        entry.run("tblEmployees");
    }

    public onCreateNewEmployeeComponent() {
        this.getRouter().navTo("RouteNewEntry");
    }

    public onUpdateEmployeeComponent() {
        const selectedItem = this.getById<Table>("tblEmployees").getSelectedItem();

        if (!selectedItem) {
            MessageBox.error("Please select a row from the table.");
            return;
        }

        const employeeID = (selectedItem.getBindingContext() as Context).getProperty("ID") as string;

        this.getRouter().navTo("RouteEditEntry", {
            employeeID: employeeID
        });
    }

    public onDeleteEmployeeComponent() {
        const selectedItem = this.getById<Table>("tblEmployees").getSelectedItem();

        if (!selectedItem) {
            MessageBox.error("Please select a row from the table.");
            return;
        }

        const employeeID = (selectedItem.getBindingContext() as Context).getProperty("ID") as string;

        this.getRouter().navTo("RouteRemoveEntry", {
            employeeID: employeeID
        });
    }

    public onDisplayEmployeeComponent() {
        const selectedItem = this.getById<Table>("tblEmployees").getSelectedItem();

        if (!selectedItem) {
            MessageBox.error("Please select a row from the table.");
            return;
        }

        const employeeID = (selectedItem.getBindingContext() as Context).getProperty("ID") as string;

        this.getRouter().navTo("RouteShowEntry", {
            employeeID: employeeID
        });
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}