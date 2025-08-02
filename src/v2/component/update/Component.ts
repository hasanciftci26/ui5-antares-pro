import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/odata/v2/Context";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";
import UpdateEntry from "ui5/antares/pro/v2/entry/UpdateEntry";

/**
 * The **Update** component is a reusable UI5 component provided by the UI5 Antares Pro library to 
 * support editing existing records in an OData service.
 * It renders a fully dynamic and validated update form using metadata and consumer-provided configuration. 
 * This component is suitable for embedding within a **sap.ui.core.ComponentContainer** in view-based applications.
 *
 * ## Purpose
 * The component is designed to update existing entities in an OData service. It is powered by the **UpdateEntry** class, 
 * which manages metadata resolution, field layout, pre-filling values, and generating the appropriate UI controls.
 *
 * ## Usage
 * The component can be initialized in one of two ways:
 *
 * ---
 * ### **Option 1: Manifest-based Initialization**
 * 1. Declare the component in your view:
 *    ```xml
 *    <core:ComponentContainer usage="ui5AntaresProUpdateEntry" componentCreated="onUpdateEntryComponentReady" />
 *    ```
 * 2. In your **manifest.json**, define the usage under **"sap.ui5"."componentUsages"**:
 *    ```json
 *    "sap.ui5": {
 *      "componentUsages": {
 *        "ui5AntaresProUpdateEntry": {
 *          "name": "ui5.antares.pro.v2.component.update"
 *        }
 *      }
 *    }
 *    ```
 * 3. In the **componentCreated** event handler, retrieve the component and invoke its **run** method with an **UpdateEntry** instance:
 *    ```ts
 *    onUpdateEntryComponentReady(oEvent) {
 *      const oComponent = oEvent.getParameter("component");
 *      oComponent.run(new UpdateEntry({ ... }));
 *    }
 *    ```
 *
 * ---
 * ### **Option 2: Controller-based Initialization**
 * 1. Use a **ComponentContainer** in your XML view, without a **usage**.
 * 2. In your controller, create the component instance manually.
 * 3. Pass an **UpdateEntry** instance to the **run** method:
 *    ```ts
 *    oComponent.run(new UpdateEntry({ ... }));
 *    ```
 *
 * ---
 * ## Entry Class Dependency
 * The **run** method **requires** an **UpdateEntry** instance that fully defines:
 * - The OData entity and context to be edited
 * - Field configuration, validation logic, and layout options
 * - Default values, editable state, and content wrappers like **Grid**, **VBox**, **FlexBox**, etc.
 * - Event hooks like **beforeSubmit**, **submitSuccess**, or **submitError**
 *
 * ---
 * ## Lifecycle Methods in Component Mode
 * The **UpdateEntry** class provides the following methods which are important in Component mode:
 *
 * - **commit()**  
 *   The UI5 Antares Pro library does not generate any submit buttons in Component mode.  
 *   Consumer must invoke this method to apply the changes to the backend.
 *
 * - **reset()**  
 *   The form state is not reset automatically when the user navigates away.  
 *   Consumer should explicitly call this method to discard the changes if the page is exited before committing.
 *
 * - **reload()**  
 *   Components are only initialized once during the lifecycle.  
 *   Use this method to renew the update context if the same component should be used to update another record.
 *
 * ---
 * ## Notes
 * - The component does not manage submit buttons or navigation. All interaction logic must be controlled by the consumer.
 * - This component is ideal for integrating consistent update forms across different parts of a larger application.
 * 
 * @namespace ui5.antares.pro.v2.component.update
 */
export default class Component extends UIComponent {
    static metadata: ComponentMetadata = {
        manifest: "json",
        library: "ui5.antares.pro",
        properties: {
            entryInstance: { type: "object", visibility: "hidden" }
        }
    };

    /**
     * Initializes the component’s internal structure and configuration.
     *
     * This method is used internally by the UI5 Antares Pro library to prepare the component lifecycle 
     * and must **not** be called by the consumer under any circumstances.
     *
     * @internal
     */
    public init() {
        ReuseComponentSupport.mixInto(this, "ui5AntaresUpdateEntryComponent", true);
        super.init();
    }

    /**
     * Creates and returns the component’s root control.
     *
     * This method is invoked internally by the UI5 Antares Pro library during component instantiation 
     * and is responsible for rendering the component’s container. It must **not** be called or overridden by the consumer.
     *
     * @internal
     */
    public override createContent() {
        const vbox = new VBox({
            busyIndicatorDelay: 0
        });

        return vbox;
    }

    /**
     * Generates and renders the content inside the component using the provided **UpdateEntry** instance.
     *
     * This method must be called by the consumer after the component has been initialized (typically inside the **componentCreated** event handler).
     * It is responsible for generating the internal form structure based on the configuration defined in the **UpdateEntry** instance.
     *
     * The **ref** parameter determines which entity is loaded into the form for editing. It supports the following formats:
     *
     * 1. **string** — The ID of a table in the consumer's application. 
     * The library will detect the currently selected row and fetch the corresponding entity context automatically.
     *     - Supported tables:
     *       - **sap.m.Table** (selection mode: **SingleSelect**, **SingleSelectMaster**, or **SingleSelectLeft**)
     *       - **sap.ui.table.Table** (selection mode: **Single**)
     *       - **sap.ui.comp.smarttable.SmartTable** (must contain either **sap.m.Table** or **sap.ui.table.Table** internally)
     *
     * 2. **Context** — A **Context** instance representing the target entity to be edited.
     *
     * 3. **object** — Key values of the entity to be edited. 
     * The library will construct the correct binding path using these keys and create the corresponding context automatically.
     *
     * @param entryInstance - An instance of the **UpdateEntry** class that defines the update form logic for an existing entity.
     * @param ref - The reference to the entity that should be loaded into the form for editing.
     */
    public run<T extends Record<string, any> = Record<string, any>>(entryInstance: UpdateEntry, ref: Context | string | T) {
        const vbox = this.getRootControl() as VBox;
        this.setEntryInstance(entryInstance);
        entryInstance.initComponent(vbox, ref);
    }

    /**
     * Returns the **UpdateEntry** instance that was previously passed to the **run** method.
     *
     * This method allows the consumer to retrieve the entry instance used to configure and render the update form.
     * It can be used to programmatically interact with the form logic, 
     * including submission (**commit**), resetting (**reset**), or reloading (**reload**).
     *
     * @returns The **UpdateEntry** instance currently associated with this component.
     */
    public getEntryInstance() {
        return this.getProperty("entryInstance") as UpdateEntry;
    }

    private setEntryInstance(entryInstance: UpdateEntry) {
        this.setProperty("entryInstance", entryInstance);
    }
}