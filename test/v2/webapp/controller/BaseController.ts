import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import Model from "sap/ui/model/Model";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import Component from "test/v2/ui5/antares/pro/Component";
import Control from "sap/ui/core/Control";
import View from "sap/ui/core/mvc/View";

/**
 * @namespace test.v2.ui5.antares.pro.controller
 */
export default class BaseController extends Controller {

    /* ======================================================================================================================= */
    /* Global Methods                                                                                                          */
    /* ======================================================================================================================= */

    public getRouter() {
        const component = this.getOwnerComponent();

        if (component instanceof Component === false) {
            throw new Error("The owner component was not found.");
        }

        return component.getRouter();
    }

    public getModel(modelName?: string) {
        const view = this.getView();

        if (!view) {
            throw new Error("The View was not found.");
        }

        const model = view.getModel(modelName);

        if (!model) {
            throw new Error("The model was not found.");
        }

        return model;
    }

    public getComponentModel(modelName?: string) {
        const component = this.getOwnerComponent();

        if (component instanceof Component === false) {
            throw new Error("The owner component was not found.");
        }

        const model = component.getModel(modelName);

        if (!model) {
            throw new Error("The model was not found.");
        }

        return model;
    }

    public setModel(model: Model, modelName?: string) {
        const view = this.getView();

        if (!view) {
            throw new Error("The View was not found.");
        }

        view.setModel(model, modelName);
    }

    public getODataModel(from: "VIEW" | "COMPONENT", modelName?: string) {
        const model = from === "VIEW" ? this.getModel(modelName) : this.getComponentModel(modelName);

        if (model instanceof ODataModel === false) {
            throw new Error("The model is not an instance of ODataModel V2.");
        }

        return model;
    }

    public getBundleText(key: string, parameters?: (string | number | boolean)[]) {
        const bundle = this.getResourceBundle();
        return bundle.getText(key, parameters) || "The Resource Bundle text was not found. Contact your administrator.";
    }

    public getById<T extends Control = Control>(id: string): T {
        return (this.getView() as View).byId(id) as T;
    }

    private getResourceBundle() {
        const model = this.getComponentModel("i18n");

        if (model instanceof ResourceModel === false) {
            throw new Error("The model is not an instance of ResourceModel.");
        }

        const bundle = model.getResourceBundle();

        if (bundle instanceof ResourceBundle === false) {
            throw new Error("The Resource Bundle was not found.");
        }

        return bundle;
    }
} 