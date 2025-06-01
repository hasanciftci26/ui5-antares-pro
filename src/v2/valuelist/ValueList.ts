import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/valuelist/ValueList.types";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * @namespace ui5.antares.pro.v2.valuelist
 */
export default class ValueList extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            localDataProperty: { type: "string", visibility: "public" },
            collectionPath: { type: "string", visibility: "public" },
            fixedValues: { type: "boolean", visibility: "public", defaultValue: false },
            searchSupported: { type: "boolean", visibility: "public", defaultValue: false },
            title: { type: "string", visibility: "public" },
            parameters: { type: "object[]", visibility: "public", defaultValue: [] }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
        this.setDefaultTitle();
    }

    public setCollectionPath(newValue: string) {
        const path = newValue.startsWith("/") ? newValue : `/${newValue}`;
        this.setProperty("collectionPath", path);
    }

    public check() {
        const consistent = this.getParameters().find(param => param.type === "InOut" || param.type === "Out");

        if (!consistent) {
            throw new Error("ValueList must include InOut or Out parameter.");
        }
    }

    public async open() {

    }

    private setDefaultTitle() {
        if (this.getTitle()) {
            return;
        }

        const entitySet = this.getCollectionPath().substring(1);
        this.setTitle(LibraryBundle.getText("ui5AntaresPro.title.select", [entitySet])!);
    }
}