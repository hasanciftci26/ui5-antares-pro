import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import UIComponent from "sap/ui/core/UIComponent";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
import Lib from "sap/ui/core/Lib";
import BindingMode from "sap/ui/model/BindingMode";

/**
 * @namespace ui5.antares.pro.v2.core
 */
export default abstract class Root extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            controller: { type: "object", visibility: "hidden" },
            view: { type: "object", visibility: "hidden" },
            component: { type: "object", visibility: "hidden" },
            entitySet: { type: "string", visibility: "public" },
            entitySetPath: { type: "string", visibility: "hidden" },
            modelRef: { type: "any", visibility: "public" },
            deferredGroupId: { type: "string", visibility: "public", defaultValue: "ui5AntaresPro" },
            consumerBindingMode: { type: "string", visibility: "hidden" }
        }
    };

    constructor(settings: ISettings) {
        const { controller, ...publicProperties } = settings;

        super(publicProperties as $ManagedObjectSettings);
        this.initController(controller);
        this.initComponent();
        this.initView();
        this.initODataModel();
        this.enableODataTwoWayBinding();
        this.addODataDeferredGroup();
        this.initConsumerResourceModel();
    }

    public setEntitySet(newValue: string) {
        const entitySet = newValue.startsWith("/") ? newValue.substring(1) : newValue;

        this.setProperty("entitySet", entitySet);
        this.setProperty("entitySetPath", `/${entitySet}`);
    }

    public getODataModel() {
        return this.getModel() as ODataModel;
    }

    public getConsumerBundleText(key: string, parameters?: (string | number | boolean)[]): string | undefined {
        const model = this.getConsumerResourceModel();

        if (!model) {
            return;
        }

        const bundle = model.getResourceBundle();

        if (bundle instanceof ResourceBundle === false) {
            return;
        }

        if (bundle.hasText(key)) {
            return bundle.getText(key, parameters);
        }
    }  

    protected getController(): Controller {
        return this.getProperty("controller");
    }

    protected getComponent(): UIComponent {
        return this.getProperty("component");
    }

    protected getView(): View {
        return this.getProperty("view");
    }

    protected getEntitySetPath(): string {
        return this.getProperty("entitySetPath");
    }

    protected getConsumerResourceModel(): ResourceModel | undefined {
        return this.getModel("consumerResourceModel") as ResourceModel | undefined;
    }

    protected getConsumerBindingMode() {
        return this.getProperty("consumerBindingMode") as BindingMode;
    }

    protected setConsumerBindingMode(consumerBindingMode: BindingMode) {
        this.setProperty("consumerBindingMode", consumerBindingMode);
    }

    protected resetODataBindingMode() {
        this.getODataModel().setDefaultBindingMode(this.getConsumerBindingMode());
    }

    private initController(controller: Controller) {
        this.setProperty("controller", controller);
    }

    private initComponent() {
        const component = this.getController().getOwnerComponent();

        if (component instanceof UIComponent === false) {
            throw new Error("The owner component is not an instance of sap.ui.core.UIComponent class.");
        }

        this.setProperty("component", component);
    }

    private initView() {
        const view = this.getController().getView();

        if (!view) {
            throw new Error("The source view was not found using the controller.");
        }

        this.setProperty("view", view);
    }

    private initODataModel() {
        const modelRef = this.getModelRef();

        if (typeof modelRef === "string") {
            const model = this.getComponent().getModel(modelRef);

            if (model instanceof ODataModel === false) {
                throw new Error("The referenced model was not found or is not an instance of sap.ui.model.odata.v2.ODataModel");
            }

            this.setModel(model);
        } else if (modelRef instanceof ODataModel) {
            this.setModel(modelRef);
        } else {
            const model = this.getComponent().getModel();

            if (model instanceof ODataModel === false) {
                throw new Error("The default model was not found or is not an instance of sap.ui.model.odata.v2.ODataModel");
            }

            this.setModel(model);
        }

        this.setConsumerBindingMode(this.getODataModel().getDefaultBindingMode());
    }

    private addODataDeferredGroup() {
        const deferredGroups = this.getODataModel().getDeferredGroups();

        if (!deferredGroups.includes(this.getDeferredGroupId())) {
            this.getODataModel().setDeferredGroups([...deferredGroups, this.getDeferredGroupId()]);
        }
    }

    private enableODataTwoWayBinding() {
        this.getODataModel().setDefaultBindingMode("TwoWay");
    }

    private initConsumerResourceModel() {
        const model = this.getComponent().getModel("i18n");

        if (model instanceof ResourceModel) {
            this.setModel(model, "consumerResourceModel");
        }
    }
}