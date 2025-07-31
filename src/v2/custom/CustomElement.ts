import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import UI5Element from "sap/ui/core/Element";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/CustomElement.types";
import NavigationProperty from "ui5/antares/pro/v2/metadata/NavigationProperty";
import Factory from "ui5/antares/pro/v2/ui/Factory";

/**
 * Defines a custom UI5 control to replace the default control generated for a specific property.
 *
 * The **UI5 Antares Pro** library typically generates SAPUI5 controls such as **Input**, **DatePicker**, or **Text**
 * based on the EDM type of the properties defined in the **EntitySet** associated with an **Entry** class.
 *
 * This class allows consumers to override that behavior by providing a custom SAPUI5 control
 * (e.g., **Slider**, **ComboBox**) for a specific property.
 *
 * To use this feature, consumers must:
 * - Create an instance of **CustomElement**
 * - Specify the property name it should apply to
 * - Provide the custom control instance
 * - Optionally, attach a **validator** function for validation
 *
 * The validator function can be either synchronous or asynchronous. It receives the control instance
 * as input and must return **true** to indicate successful validation.
 *
 * **Note:** The library does not support attaching **ValidationLogic** instances to custom elements.
 * If validation is required, the consumer must provide a validator function.
 *
 * @remarks
 * - This class is intended to be used with any **Entry** class (e.g., **CreateEntry**, **UpdateEntry**).
 * - The custom control is fully managed by the consumer, including validation, binding, and events.
 * - The validator function may return a boolean or a Promise<boolean>.
 * 
 * @namespace ui5.antares.pro.v2.custom
 */
export default class CustomElement<T extends UI5Element = UI5Element> extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string" },
            element: { type: "object" },
            validator: { type: "function" }
        }
    };

    constructor(settings: Settings<T>) {
        super(settings as $ManagedObjectSettings);
    }

    /**
     * Executes the validation logic defined for this custom element.
     *
     * This method is called internally by the **UI5 Antares Pro** library during the validation phase of an entry operation.
     * It uses the validator function (if provided) to evaluate the validity of the associated control.
     *
     * **Consumers must not call this method directly.**
     *
     * @returns A promise resolving to **true** if the validation succeeds; otherwise **false**.
     * @internal
     */
    public async validate() {
        const validator = this.getValidator();

        if (!validator) {
            return true;
        }

        return Promise.resolve(validator.call(this.getFactory().getController(), this.getElement()));
    }

    private getFactory() {
        const parent = this.getParent() as ManagedObject;

        if (parent.isA<NavigationProperty>("ui5.antares.pro.v2.metadata.NavigationProperty")) {
            return parent.getParent() as Factory;
        }

        return parent as Factory;
    }
}