import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/custom/CustomContent.types";

/**
 * Represents custom UI5 content to be inserted into generated dialogs or components.
 *
 * Instances of this class encapsulate a SAPUI5 control that consumers can create and
 * pass to **Entry** classes such as **CreateEntry**, **UpdateEntry**, **DeleteEntry**, and **DisplayEntry**.
 *
 * When the library generates the dialog or component UI, the provided custom content
 * is placed at the specified index within the container.  
 *
 * **Important:** The lifecycle, behavior, and management of the encapsulated control
 * are entirely the responsibility of the consumer. The library only handles the
 * placement of the content and does not control or manage it.
 *
 * Consumers can access and manipulate the dialog instance in dialog mode via the
 * **getDialogInstance** method on the corresponding Entry class, which returns
 * the underlying **sap.m.Dialog** instance.
 *
 * @remarks
 * - The optional index parameter determines the insertion position within the dialog or component. The default index is 999.
 * - The custom content must be fully managed externally by the consumer, including event handling,
 *   updates, and cleanup.
 * 
 * @namespace ui5.antares.pro.v2.custom
 */
export default class CustomContent extends ManagedObject {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            content: { type: "object" },
            index: { type: "int", defaultValue: 999 }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
    }
}