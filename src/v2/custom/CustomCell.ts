import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/CustomCell.types";

/**
 * Defines a custom cell renderer for a specific property in a navigation-based table.
 *
 * The **CustomCell** class allows consumers of the UI5 Antares Pro library to override the default cell content
 * generated in association tables. By default, the library renders all property values in a navigation's
 * **sap.m.Table** or **sap.ui.table.Table** as **sap.m.Text** controls. If a more complex or styled UI representation
 * is required (e.g., **sap.m.ObjectStatus**, **sap.m.RatingIndicator**, etc.), consumers can use **CustomCell**
 * to inject their own SAPUI5 controls for a specific property.
 *
 * This class is designed to be used as an aggregation of the **NavigationProperty** class. When applied,
 * the library replaces the default **sap.m.Text** cell for the specified property with the provided control.
 * 
 * **Example usage:**
 * ```ts
 * new CustomCell({
 *   propertyName: "Status",
 *   cell: new ObjectStatus({ text: "{Status}", state: "{StatusState}" })
 * });
 * ```
 *
 * ⚠️ Note: When providing a custom control, make sure it does not have a fixed ID or reuses the same ID across instances.
 * This prevents duplicate ID errors during rendering.
 *
 * 
 * @namespace ui5.antares.pro.v2.custom
 */
export default class CustomCell extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            propertyName: { type: "string" },
            cell: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }
}