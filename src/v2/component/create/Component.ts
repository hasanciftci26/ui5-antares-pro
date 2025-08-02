import VBox from "sap/m/VBox";
import ReuseComponentSupport from "sap/suite/ui/generic/template/extensionAPI/ReuseComponentSupport";
import UIComponent from "sap/ui/core/UIComponent";
import { ComponentMetadata } from "ui5/antares/pro/types/Global.types";
import CreateEntry from "ui5/antares/pro/v2/entry/CreateEntry";

/**
 * The **Create** component is a reusable UI5 component provided by the UI5 Antares Pro library for creating new entries in an OData service.
 * It encapsulates all logic and UI generation needed to present a fully functional creation form, 
 * which can be embedded in any view using a **sap.ui.core.ComponentContainer**.
 *
 * ## Purpose
 * This component is used to allow end users to create new records in an OData entity set. 
 * It is backed by the **CreateEntry** class, which provides full configuration of the form’s structure, behavior, validation, and layout.
 *
 * ## Usage
 * The component can be initialized in two different ways:
 *
 * ---
 * ### **Option 1: Manifest-based Initialization**
 * 1. In your XML view or fragment, declare a **sap.ui.core.ComponentContainer**:
 *    ```xml
 *    <core:ComponentContainer usage="ui5AntaresProCreateEntry" componentCreated="onCreateEntryComponentReady" />
 *    ```
 * 2. In your **manifest.json**, define the usage under **"sap.ui5"."componentUsages"**:
 *    ```json
 *    "sap.ui5": {
 *      "componentUsages": {
 *        "ui5AntaresProCreateEntry": {
 *          "name": "ui5.antares.pro.v2.component.create"
 *        }
 *      }
 *    }
 *    ```
 * 3. Handle the **componentCreated** event to get the initialized component instance:
 *    ```ts
 *    onCreateEntryComponentReady(oEvent) {
 *      const oComponent = oEvent.getParameter("component");
 *      oComponent.run(new CreateEntry({ ... }));
 *    }
 *    ```
 *
 * ---
 * ### **Option 2: Controller-based Initialization**
 * 1. Define a **sap.ui.core.ComponentContainer** in XML with no **usage** attribute.
 * 2. Programmatically instantiate the component in your controller.
 * 3. Once initialized, invoke the **run** method with a **CreateEntry** instance to render the form:
 *    ```ts
 *    oComponent.run(new CreateEntry({ ... }));
 *    ```
 *
 * ---
 * ## Entry Class Dependency
 * The **run** method **requires** a **CreateEntry** instance. This class allows full customization of:
 * - The target OData entity set
 * - Validations, Value Lists
 * - The form fields, layout, and labels
 * - Initial values and default behaviors
 * - Event hooks (e.g., **beforeSubmit**, **submitSuccess**, **submitError**)
 * - Content wrapper type (e.g., **VBox**, **Grid**, **FlexBox**)
 *
 * ---
 * ## Lifecycle Methods in Component Mode
 * The **CreateEntry** instance offers three lifecycle methods to manage user interaction in Component mode:
 *
 * - **commit()**  
 *   Since the library does not generate submit buttons in Component mode, the consumer is responsible for handling submission.  
 *   Call this method to submit the entry data to the backend.
 *
 * - **reset()**  
 *   The form is not reset automatically when the user navigates away.  
 *   Consumers should call this method to discard changes when leaving the page without submission.
 *
 * - **reload()**  
 *   As components are initialized only once during the lifecycle of the application, a single context is created and reused.  
 *   Use this method to renew the context if, for example, the user:
 *   - Submits a new entry and wants to create another
 *   - Leaves and reopens the form and expects to see a fresh form
 *
 * ---
 * ## Notes
 * - Avoid calling **run** multiple times on the same component instance unless a full teardown is intended.
 * - The component is tightly coupled with the configuration passed through the **CreateEntry** instance. 
 * Ensure it is fully defined before passing it to **run**.
 * - This component is ideal for embedding into complex applications where form generation must be consistent and modular.
 * 
 * @namespace ui5.antares.pro.v2.component.create
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
        ReuseComponentSupport.mixInto(this, "ui5AntaresCreateEntryComponent", true);
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
     * Generates and renders the content inside the component using the provided **CreateEntry** instance.
     *
     * This method must be called by the consumer after the component has been 
     * initialized (typically inside the **componentCreated** event handler).  
     * It is responsible for generating the internal form structure based on the configuration in the **CreateEntry** instance.
     *
     * Optionally, the consumer can pass **initialData**, which is used to prefill the form fields.  
     * The data must match the structure of the OData entity associated with the entry instance.
     *
     * @param entryInstance - An instance of the **CreateEntry** class. 
     * This instance defines the entity type, layout, field behaviors, and other settings used to generate the form.
     * @param initialData - (Optional) A plain object used to prefill the form with initial values.
     */
    public run<T extends Record<string, any> = Record<string, any>>(entryInstance: CreateEntry, initialData?: T) {
        const vbox = this.getRootControl() as VBox;
        this.setEntryInstance(entryInstance);
        entryInstance.initComponent(vbox, initialData);
    }

    /**
     * Returns the **CreateEntry** instance that was previously passed to the **run** method.
     *
     * This method can be used by the consumer to access the entry instance for operations like validation, commit, or reset.  
     * It provides a direct reference to the **CreateEntry** instance that drives the component’s content.
     *
     * @returns The **CreateEntry** instance used to generate the component’s content.
     */
    public getEntryInstance() {
        return this.getProperty("entryInstance") as CreateEntry;
    }

    private setEntryInstance(entryInstance: CreateEntry) {
        this.setProperty("entryInstance", entryInstance);
    }
}