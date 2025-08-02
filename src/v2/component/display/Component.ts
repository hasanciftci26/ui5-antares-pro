import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/odata/v2/Context";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";
import DisplayEntry from "ui5/antares/pro/v2/entry/DisplayEntry";

/**
 * The **Display** component is a reusable UI5 component provided by the UI5 Antares Pro library for visualizing 
 * the details of an existing entity using OData services. It renders metadata-driven forms and tables in a strictly read-only mode, 
 * making it ideal for inspection and audit use cases where no modifications are allowed.
 *
 * ## Purpose
 * This component is designed to present the full detail of an entity record retrieved via OData, 
 * without exposing any editing or deletion capability. 
 * It ensures a clean, non-interactive view of the data, ideal for dashboards, logs, and detail views.
 *
 * ## Usage
 * The component can be initialized in two ways:
 *
 * ---
 * ### **Option 1: Manifest-based Initialization**
 * 1. Place the component in a view or fragment:
 *    ```xml
 *    <core:ComponentContainer usage="ui5AntaresProDisplayEntry" componentCreated="onDisplayEntryComponentReady" />
 *    ```
 * 2. Register it in **manifest.json** under **"sap.ui5"."componentUsages"**:
 *    ```json
 *    "sap.ui5": {
 *      "componentUsages": {
 *        "ui5AntaresProDisplayEntry": {
 *          "name": "ui5.antares.pro.v2.components.Display"
 *        }
 *      }
 *    }
 *    ```
 * 3. In your **componentCreated** handler, call the **run** method with a **DisplayEntry** instance:
 *    ```ts
 *    onDisplayEntryComponentReady(oEvent) {
 *      const oComponent = oEvent.getParameter("component");
 *      oComponent.run(new DisplayEntry({ ... }));
 *    }
 *    ```
 *
 * ---
 * ### **Option 2: Controller-based Initialization**
 * 1. Place a **ComponentContainer** in your XML view, leaving the **usage** empty.
 * 2. Initialize the component instance manually in the controller.
 * 3. Call the **run** method with a **DisplayEntry** instance:
 *    ```ts
 *    oComponent.run(new DisplayEntry({ ... }));
 *    ```
 *
 * ---
 * ## Entry Class Dependency
 * The **run** method **requires** a **DisplayEntry** instance that defines:
 * - The entity and key used to fetch the record
 * - The layout and structure of the display (e.g., **VBox**, **Grid**, **FlexBox**)
 * - Optional configuration such as field visibility, label overrides, or navigation targets
 *
 * ---
 * ## Lifecycle Methods in Component Mode
 * The **DisplayEntry** class provides a single relevant lifecycle method:
 *
 * - **reload()**  
 *   Since the component is instantiated only once, it can display only one record at a time.  
 *   This method allows the consumer to load a new entity dynamically during runtime.
 *
 * ---
 * ## Notes
 * - This component is entirely **read-only** by design.  
 *   It does **not** provide **commit()** or **reset()** methods.
 * - The form and table controls rendered are non-editable and cannot trigger value helps or change events.
 * - It is ideal for scenarios like:
 *   - Entity detail pages
 *   - Auditing or compliance views
 *   - Dashboards showing entity information
 * 
 * @namespace ui5.antares.pro.v2.component.display
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
        ReuseComponentSupport.mixInto(this, "ui5AntaresDisplayEntryComponent", true);
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
     * Initializes and renders the component content using the provided **DisplayEntry** instance.
     *
     * This method must be called by the consumer after the component has been initialized, typically inside the **componentCreated** event handler.
     * It sets up the readonly display form with the entity specified by the **ref** parameter.
     *
     * The **ref** parameter defines which entity will be displayed and supports the following formats:
     *
     * 1. **string** — The ID of a table in the consumer's application. 
     * The library detects the currently selected row and fetches the corresponding entity context automatically.
     *    - Supported tables:
     *      - **sap.m.Table** (selection mode: **SingleSelect**, **SingleSelectMaster**, or **SingleSelectLeft**)
     *      - **sap.ui.table.Table** (selection mode: **Single**)
     *      - **sap.ui.comp.smarttable.SmartTable** (must have either **sap.m.Table** or **sap.ui.table.Table** as the inner table)
     *
     * 2. **Context** — A **Context** instance representing the target entity to be displayed.
     *
     * 3. **object** — Key values of the entity to be displayed. 
     * The library will generate the proper binding path and create the corresponding context.
     *
     * @param entryInstance - An instance of the **DisplayEntry** class that controls the display logic and UI.
     * @param ref - Reference to the entity that should be loaded into the display form.
     */
    public run<T extends Record<string, any> = Record<string, any>>(entryInstance: DisplayEntry, ref: Context | string | T) {
        const vbox = this.getRootControl() as VBox;
        this.setEntryInstance(entryInstance);
        entryInstance.initComponent(vbox, ref);
    }

    /**
     * Returns the **DisplayEntry** instance previously passed to the **run** method.
     *
     * This allows consumers to access the display entry instance programmatically, for example, to reload the displayed data.
     *
     * @returns The **DisplayEntry** instance associated with this component.
     */
    public getEntryInstance() {
        return this.getProperty("entryInstance") as DisplayEntry;
    }

    private setEntryInstance(entryInstance: DisplayEntry) {
        this.setProperty("entryInstance", entryInstance);
    }
}