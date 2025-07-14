import Grid from "sap/ui/layout/Grid";
import GridData from "sap/ui/layout/GridData";
import BaseController from "test/v2/ui5/antares/pro/controller/BaseController";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import FormLayout from "ui5/antares/pro/v2/ui/FormLayout";

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

    public onInitClass() {
        const entry = new CreateEntry({
            controller: this,
            entitySet: "Employees",
            formLayout: new FormLayout({
                layoutData: new GridData({
                    span: "XL6 L6 M6 S6"
                })
            }),
            guidGenerationMode: "None",
            guidVisibilityMode: "All"
        });

        entry.addNavigationProperty(new NavigationProperty({
            name: "toCertifications",
            visibleColumnCount: 3,
            tableLayoutData: new GridData({
                span: "XL6 L6 M6 S6"
            })
        }));

        entry.setContentWrapper(new Grid({
            width: "100%",
            defaultSpan: "XL12 L12 M12 S12"
        }));

        entry.execute();
    }

    /* ======================================================================================================================= */
    /* Internal methods                                                                                                        */
    /* ======================================================================================================================= */
}