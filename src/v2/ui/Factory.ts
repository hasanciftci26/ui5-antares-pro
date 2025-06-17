import { ClassMetadata, FormGenerator } from "ui5/antares/pro/types/Global.types";
import { Settings } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/Factory.types";
import BaseContext from "ui5/antares/pro/v2/core/BaseContext";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class Factory extends BaseContext implements MetaContextOwner {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            formType: { type: "string", defaultValue: "SmartForm" },
            keyEnforcementEnabled: { type: "boolean", defaultValue: true },
            metadataLabelEnabled: { type: "boolean", defaultValue: false },
            guidGenerationMode: { type: "string", defaultValue: "Key" },
            guidVisibilityMode: { type: "string", defaultValue: "NonKey" },
            propertySettings: { type: "object[]", defaultValue: [] },
            propertyOrder: { type: "string[]", defaultValue: [] },
            operation: { type: "string", visibility: "hidden" },
            dialogGenerator: { type: "object", visibility: "hidden" },
            formGenerator: { type: "object", visibility: "hidden" }
        },
        aggregations: {
            navigationProperties: {
                type: "ui5.antares.pro.v2.metadata.NavigationProperty",
                multiple: true,
                singularName: "navigationProperty"
            },
            metaContext: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: Settings) {
        super(settings);
        this.setMetaContext(new MetaContext());
    }

    public getOperation() {
        return this.getProperty("operation") as Operation;
    }

    protected setOperation(operation: Operation) {
        this.setProperty("operation", operation);
    }

    protected getDialogGenerator() {
        return this.getProperty("dialogGenerator") as DialogGenerator;
    }

    protected setDialogGenerator(dialogGenerator: DialogGenerator) {
        this.setProperty("dialogGenerator", dialogGenerator);
    }

    protected getFormGenerator() {
        return this.getProperty("formGenerator") as FormGenerator;
    }

    protected setFormGenerator(formGenerator: FormGenerator) {
        this.setProperty("formGenerator", formGenerator);
    }

    protected getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    protected setMetaContext(metaContext: MetaContext) {
        this.setAggregation("metaContext", metaContext);
    }

    protected async execute() {
        await this.loadMetaContexts();
    }

    private async loadMetaContexts() {
        await this.getMetaContext().load();

        for (const property of this.getNavigationProperties()) {
            await property.load();
        }
    }
}