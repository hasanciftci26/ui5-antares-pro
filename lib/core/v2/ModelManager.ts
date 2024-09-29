import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import BindingMode from "sap/ui/model/BindingMode";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import LibraryResourceModel from "ui5/antares/pro/core/v2/LibraryResourceModel";

/**
 * @namespace ui5.antares.pro.core.v2
 */
export default abstract class ModelManager extends LibraryResourceModel {
    private controller: Controller;
    private view: View;
    private uiComponent: UIComponent;
    private oDataModel: ODataModel;
    private oDataModelName?: string;
    private defaultBindingMode: BindingMode | "Default" | "OneTime" | "OneWay" | "TwoWay";
    private srcResourceModel?: ResourceModel;
    private srcResourceBundle?: ResourceBundle;

    constructor(controller: Controller, oDataModelRef?: string | ODataModel) {
        super();
        this.controller = controller;
        this.view = controller.getView() as View;
        this.uiComponent = controller.getOwnerComponent() as UIComponent;
        this.setODataModel(oDataModelRef);
        this.setDefaultBindingMode();
        this.setSrcResourceModel();
    }

    // Retrieve the ODataModel of the consumer app
    private setODataModel(modelRef?: string | ODataModel) {
        switch (typeof modelRef) {
            case "undefined":
            case "string":
                const model = this.uiComponent.getModel(modelRef);
                this.oDataModelName = modelRef;

                if (model instanceof ODataModel) {
                    this.oDataModel = model;
                } else {
                    throw new Error(this.getLibraryText("noODataModelDetected"));
                }
                break;
            default:
                this.oDataModel = modelRef;
                break;
        }
    }

    // Store the binding mode of the consumer app. 
    // It will be required to set back the default binding mode of the consumer app after the library ends the process
    private setDefaultBindingMode() {
        this.defaultBindingMode = this.oDataModel.getDefaultBindingMode();
    }

    // Retrieve the i18n model of the consumer app
    private setSrcResourceModel() {
        const model = this.uiComponent.getModel("i18n");

        if (model instanceof ResourceModel) {
            this.srcResourceModel = model;
            this.srcResourceBundle = this.srcResourceModel.getResourceBundle() as ResourceBundle;
        }
    }

    protected getSourceController(): Controller {
        return this.controller;
    }

    protected getSourceView(): View {
        return this.view;
    }

    protected getUIComponent(): UIComponent {
        return this.uiComponent;
    }

    protected getODataModel(): ODataModel {
        return this.oDataModel;
    }

    protected enableTwoWayBinding() {
        this.oDataModel.setDefaultBindingMode("TwoWay");
    }

    protected resetBindingMode() {
        this.oDataModel.setDefaultBindingMode(this.defaultBindingMode);
    }

    protected getResourceBundle(): ResourceBundle | undefined {
        return this.srcResourceBundle;
    }

    // Get a text from consumer app's i18n files.
    protected getSourceText(key: string, params?: any[]): string {
        if (!this.srcResourceModel) {
            throw new Error(this.getLibraryText("noResourceModelDetected"));
        }

        const bundle = this.srcResourceModel.getResourceBundle() as ResourceBundle;
        return bundle.getText(key, params) as string;
    }

    protected getODataModelName(): string | undefined {
        return this.oDataModelName;
    }

    // Allow consumer app to set a resource model
    public setResourceModel(resourceModel: ResourceModel) {
        this.srcResourceModel = resourceModel;
    }
}