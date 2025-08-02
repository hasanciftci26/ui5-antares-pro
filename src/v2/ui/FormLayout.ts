import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/FormLayout.types";

/**
 * The **FormLayout** class defines the visual layout configuration for form sections generated
 * by the UI5 Antares Pro library. It can be passed to any **Entry** class instance (such as
 * **CreateEntry**, **UpdateEntry**, **DeleteEntry**, or **DisplayEntry**) or to a **NavigationProperty**
 * to control the arrangement of form fields in a responsive and structured manner.
 *
 * This layout class becomes particularly useful when the generated form content is placed into a
 * **content wrapper**, specified via the **contentWrapper** parameter in the constructor of an Entry class.
 * The following layout controls are supported as content wrappers:
 *
 * - **VBox**
 * - **HBox**
 * - **FlexBox**
 * - **Grid**
 * - **VerticalLayout**
 * - **HorizontalLayout**
 *
 * The **FormLayout** instance provides control over layout types and layout-specific properties such as:
 *
 * - **layoutType**: Defines the layout structure (e.g., ResponsiveGridLayout).
 * - **columnsXL / columnsL / columnsM**: Specify how many form groups or elements to render
 *   side-by-side for different screen sizes (extra-large, large, medium).
 * - **labelSpanXL / labelSpanL / labelSpanM / labelSpanS**: Define how much horizontal space
 *   the labels should occupy across various screen sizes.
 * - **emptySpanXL / emptySpanL / emptySpanM / emptySpanS**: Define additional spacing for alignment purposes.
 * - **layoutData**: Allows custom layout data to be applied to the form container.
 *
 * The class can be instantiated directly or using the static **getDefaultInstance** method to apply
 * default settings. Using **FormLayout** ensures consistent and adaptable UI presentation, especially
 * when generating dynamic forms within custom wrappers or layout containers.
 * 
 * @namespace ui5.antares.pro.v2.ui
 */
export default class FormLayout extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            layoutType: { type: "string", defaultValue: "ResponsiveGridLayout" },
            columnsXL: { type: "int", defaultValue: 1 },
            columnsL: { type: "int", defaultValue: 1 },
            columnsM: { type: "int", defaultValue: 1 },
            labelSpanXL: { type: "int", defaultValue: 12 },
            labelSpanL: { type: "int", defaultValue: 12 },
            labelSpanM: { type: "int", defaultValue: 12 },
            labelSpanS: { type: "int", defaultValue: 12 },
            emptySpanXL: { type: "int", defaultValue: 0 },
            emptySpanL: { type: "int", defaultValue: 0 },
            emptySpanM: { type: "int", defaultValue: 0 },
            emptySpanS: { type: "int", defaultValue: 0 },
            layoutData: { type: "object" }
        }
    };

    constructor(settings?: Settings) {
        super(settings as $ManagedObjectSettings | undefined);
    }

    /**
     * Returns a new instance of the FormLayout class with the provided settings applied.
     * If no settings are provided, an instance with default property values will be created.
     *
     * This method is a convenient way to obtain a FormLayout instance without directly
     * calling the constructor.
     *
     * @param settings Optional configuration object to customize the layout properties.
     * @returns A new FormLayout instance configured according to the specified settings or defaults.
     */
    public static getDefaultInstance(settings?: Settings) {
        return new FormLayout(settings);
    }
}