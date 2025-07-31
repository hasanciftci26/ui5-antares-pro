import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import View from "sap/ui/core/mvc/View";
import UIComponent from "sap/ui/core/UIComponent";
import BindingMode from "sap/ui/model/BindingMode";
import ODataModel from "sap/ui/model/odata/v2/ODataModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";

/**
 * **Internal use only.**
 *
 * This is an abstract base class used internally by the **UI5 Antares Pro** library to define shared behavior.
 * It is not intended to be instantiated or extended directly by consumers.
 *
 * @abstract
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.core
 */
export default abstract class BaseContext extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            controller: { type: "object" },
            entitySet: { type: "string" },
            modelRef: { type: "any" },
            resourceModelRef: { type: "any", defaultValue: "i18n" },
            deferredGroupId: { type: "string", defaultValue: "ui5AntaresPro" },
            view: { type: "object", visibility: "hidden" },
            component: { type: "object", visibility: "hidden" },
            defaultBindingMode: { type: "string", visibility: "hidden" }
        }
    };

    constructor(settings: Settings) {
        if (settings.requiredPropertyError?.includes("{property}")) {
            settings.requiredPropertyError = ManagedObject.escapeSettingsValue(settings.requiredPropertyError);
        }

        super(settings as $ManagedObjectSettings);

        this.setView(this.getController().getView() as View);
        this.setComponent(this.getController().getOwnerComponent() as UIComponent);
        this.setODataModel(this.getModelRef());
        this.setDefaultBindingMode(this.getODataModel().getDefaultBindingMode());
        this.enableTwoWayBinding();
        this.setDeferredGroups();
        this.getODataModel().setUseBatch(true);
        this.setOwnerResourceModel();
    }

    /**
     * Returns the name of the **EntitySet** used in the consumer application's OData service.
     *
     * @returns The name of the target EntitySet.
     */
    public getEntitySet() {
        return this.getProperty("entitySet") as string;
    }

    /**
     * Sets the name of the **EntitySet** to be used in the OData service.
     *
     * Any leading slash (`/`) in the provided value will be automatically removed.
     *
     * @param entitySet The name of the target EntitySet.
     */
    public setEntitySet(entitySet: string) {
        this.setProperty("entitySet", entitySet.replace("/", ""));
    }

    /**
     * Retrieves the ODataModel instance used by the consumer application.
     *
     * @returns The current ODataModel instance associated with this component.
     */
    public getODataModel() {
        return this.getModel() as ODataModel;
    }

    /**
     * Retrieves a localized text from the consumer application's **ResourceModel** (i18n).
     *
     * This method is exposed as **public** due to architectural requirements, but it is intended strictly for **internal use** within the library.
     * It **must not** be used directly by consumers.
     *
     * @param key The i18n key to retrieve from the resource bundle.
     * @param parameters Optional array of values used to replace placeholders in the localized text.
     * @returns The resolved localized string, or **undefined** if the resource model or key is not available.
     *
     * @internal
     */
    public getOwnerText(key: string, parameters?: any[]) {
        const model = this.getOwnerResourceModel();

        if (!model) {
            return;
        }

        const bundle = model.getResourceBundle();

        if (bundle instanceof ResourceBundle === false) {
            return;
        }

        return bundle.getText(key, parameters, true);
    }

    protected getView() {
        return this.getProperty("view") as View;
    }

    protected setView(view: View) {
        this.setProperty("view", view);
    }

    protected getComponent() {
        return this.getProperty("component") as UIComponent;
    }

    protected setComponent(component: UIComponent) {
        this.setProperty("component", component);
    }

    protected resetDefaultBindingMode() {
        this.getODataModel().setDefaultBindingMode(this.getDefaultBindingMode());
    }

    protected setODataModel(modelRef: string | ODataModel | undefined) {
        if (modelRef instanceof ODataModel) {
            this.setModel(modelRef);
        } else {
            const model = this.getComponent().getModel(modelRef);

            if (model instanceof ODataModel === false) {
                throw new Error("The ODataModel specified in the modelRef was not found.");
            }

            this.setModel(model);
        }
    }

    protected enableTwoWayBinding() {
        this.getODataModel().setDefaultBindingMode("TwoWay");
    }

    private getDefaultBindingMode() {
        return this.getProperty("defaultBindingMode") as BindingMode;
    }

    private setDefaultBindingMode(defaultBindingMode: BindingMode) {
        this.setProperty("defaultBindingMode", defaultBindingMode);
    }

    private setDeferredGroups() {
        const deferredGroups = this.getODataModel().getDeferredGroups();

        if (deferredGroups.includes(this.getDeferredGroupId())) {
            return;
        }

        deferredGroups.push(this.getDeferredGroupId());
        this.getODataModel().setDeferredGroups(deferredGroups);
    }

    private getOwnerResourceModel() {
        return this.getModel("ownerResourceModel") as ResourceModel | undefined;
    }

    private setOwnerResourceModel() {
        const modelRef = this.getResourceModelRef();

        if (modelRef instanceof ResourceModel) {
            this.setModel(modelRef, "ownerResourceModel");
        } else {
            const model = this.getComponent().getModel(modelRef);

            if (model instanceof ResourceModel) {
                this.setModel(model, "ownerResourceModel");
            }
        }
    }
}