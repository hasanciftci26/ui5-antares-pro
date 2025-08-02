import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import UIComponent from "sap/ui/core/UIComponent";
import Context from "sap/ui/model/odata/v2/Context";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";
import DeleteEntry from "ui5/antares/pro/v2/entry/DeleteEntry";

/**
 * The **Delete** component is a reusable UI5 component provided by the UI5 Antares Pro library for safely deleting entities from an OData service. 
 * It provides a metadata-driven, read-only preview of the entity to be deleted, 
 * ensuring that end users can confirm their deletion with full context and visibility.
 *
 * ## Purpose
 * This component is intended to facilitate the deletion of existing OData records. 
 * It renders the relevant entity information in read-only form fields and tables, 
 * allowing users to verify the data before confirming the deletion action. It is powered by the **DeleteEntry** class.
 *
 * ## Usage
 * The component can be initialized in one of two ways:
 *
 * ---
 * ### **Option 1: Manifest-based Initialization**
 * 1. Place the component in a view or fragment:
 *    ```xml
 *    <core:ComponentContainer usage="ui5AntaresProDeleteEntry" componentCreated="onDeleteEntryComponentReady" />
 *    ```
 * 2. Register it in **manifest.json** under **"sap.ui5"."componentUsages"**:
 *    ```json
 *    "sap.ui5": {
 *      "componentUsages": {
 *        "ui5AntaresProDeleteEntry": {
 *          "name": "ui5.antares.pro.v2.component.delete"
 *        }
 *      }
 *    }
 *    ```
 * 3. In your **componentCreated** handler, call the **run** method with a **DeleteEntry** instance:
 *    ```ts
 *    onDeleteEntryComponentReady(oEvent) {
 *      const oComponent = oEvent.getParameter("component");
 *      oComponent.run(new DeleteEntry({ ... }));
 *    }
 *    ```
 *
 * ---
 * ### **Option 2: Controller-based Initialization**
 * 1. Place a **ComponentContainer** in your XML view, leaving the **usage** empty.
 * 2. Initialize the component in your controller.
 * 3. Call the **run** method manually:
 *    ```ts
 *    oComponent.run(new DeleteEntry({ ... }));
 *    ```
 *
 * ---
 * ## Entry Class Dependency
 * The **run** method **requires** a **DeleteEntry** instance that defines:
 * - The entity and key used to fetch the record
 * - The visual layout and content (e.g., **VBox**, **Grid**, **FlexBox**)
 * - Optional deletion lifecycle hooks like **beforeDelete**, **deleteSuccess**, or **deleteError**
 *
 * ---
 * ## Lifecycle Methods in Component Mode
 * The **DeleteEntry** class provides the following methods for managing entity deletion:
 *
 * - **commit()**  
 *   Triggers the actual deletion request.  
 *   Since the Component mode does not generate any submit buttons, consumers must call this method manually to delete the entity.
 *
 * - **reload()**  
 *   Since the component instance is only created once during the application lifecycle, it can only manage one deletion context at a time.  
 *   Use this method to load a new entity for deletion.
 *
 * ---
 * ## Notes
 * - The form and table content rendered in this component is **always read-only**, 
 * ensuring no unintended modifications are made to the entity before deletion.
 * - As a result, the **reset()** method is **not available** for **DeleteEntry** in this mode.
 * - This component is well-suited for confirmation dialogs or detail views where users must verify the data prior to deletion.
 * 
 * @namespace ui5.antares.pro.v2.component.delete
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
        ReuseComponentSupport.mixInto(this, "ui5AntaresDeleteEntryComponent", true);
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
     * Initializes and renders the component content using the provided **DeleteEntry** instance.
     *
     * This method must be called by the consumer after the component has been initialized, typically inside the **componentCreated** event handler.
     * It sets up the deletion form with the entity specified by the **ref** parameter.
     *
     * The **ref** parameter defines which entity will be loaded for deletion and supports the following formats:
     *
     * 1. **string** — The ID of a table in the consumer's application. 
     * The library detects the currently selected row and fetches the corresponding entity context automatically.
     *    - Supported tables:
     *      - **sap.m.Table** (selection mode: **SingleSelect**, **SingleSelectMaster**, or **SingleSelectLeft**)
     *      - **sap.ui.table.Table** (selection mode: **Single**)
     *      - **sap.ui.comp.smarttable.SmartTable** (must have either **sap.m.Table** or **sap.ui.table.Table** as the inner table)
     *
     * 2. **Context** — A **Context** instance representing the target entity to be deleted.
     *
     * 3. **object** — Key values of the entity to be deleted. The library will generate the proper binding path and create the corresponding context.
     *
     * @param entryInstance - An instance of the **DeleteEntry** class that controls the deletion logic and UI.
     * @param ref - Reference to the entity that should be loaded into the form for deletion.
     */

    public run<T extends Record<string, any> = Record<string, any>>(entryInstance: DeleteEntry, ref: Context | string | T) {
        const vbox = this.getRootControl() as VBox;
        this.setEntryInstance(entryInstance);
        entryInstance.initComponent(vbox, ref);
    }

    /**
     * Returns the **DeleteEntry** instance previously passed to the **run** method.
     *
     * This allows consumers to interact with the deletion entry programmatically, e.g., calling **commit** to delete the entity 
     * or **reload** to reload another entity for deletion.
     *
     * @returns The **DeleteEntry** instance associated with this component.
     */
    public getEntryInstance() {
        return this.getProperty("entryInstance") as DeleteEntry;
    }

    private setEntryInstance(entryInstance: DeleteEntry) {
        this.setProperty("entryInstance", entryInstance);
    }
}