import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/core/Root.types";
import Root from "ui5/antares/pro/v2/core/Root";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import DialogGenerator from "ui5/antares/pro/v2/ui/DialogGenerator";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default abstract class extends Root {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        abstract: true,
        properties: {
            navigationProperties: { type: "string[]", visibility: "public", defaultValue: [] }
        },
        aggregations: {
            metaContexts: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: true,
                singularName: "metaContext",
                visibility: "hidden"
            },
            dialogGenerator: {
                type: "ui5.antares.pro.v2.ui.DialogGenerator",
                multiple: false,
                visibility: "hidden"
            },
            simpleFormGenerator: {
                type: "ui5.antares.pro.v2.ui.SimpleFormGenerator",
                multiple: false,
                visibility: "hidden"
            },
            smartFormGenerator: {
                type: "ui5.antares.pro.v2.ui.SmartFormGenerator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: ISettings) {
        super(settings);
    }

    protected getMetaContexts() {
        return this.getAggregation("metaContexts") as MetaContext[];
    }

    protected getPrimaryMetaContext() {
        const context = this.getMetaContexts().find(context => context.getPrimary());
        return context as MetaContext;
    }

    protected addMetaContext(metaContext: MetaContext) {
        this.addAggregation("metaContexts", metaContext);
    }

    protected insertMetaContext(metaContext: MetaContext, index: number) {
        this.insertAggregation("metaContexts", metaContext, index);
    }

    protected indexOfMetaContext(metaContext: MetaContext) {
        return this.indexOfAggregation("metaContexts", metaContext);
    }

    protected removeMetaContext(reference: number | string | MetaContext) {
        this.removeAggregation("metaContexts", reference);
    }

    protected removeAllMetaContexts() {
        this.removeAllAggregation("metaContexts");
    }

    protected destroyMetaContexts() {
        this.destroyAggregation("metaContexts");
    }

    protected getDialogGenerator() {
        return this.getAggregation("dialogGenerator") as DialogGenerator;
    }

    protected setDialogGenerator(dialogGenerator: DialogGenerator) {
        this.setAggregation("dialogGenerator", dialogGenerator);
    }

    protected destroyDialogGenerator() {
        this.destroyAggregation("dialogGenerator");
    }

    protected getSimpleFormGenerator() {
        return this.getAggregation("simpleFormGenerator") as SimpleFormGenerator;
    }

    protected setSimpleFormGenerator(simpleFormGenerator: SimpleFormGenerator) {
        this.setAggregation("simpleFormGenerator", simpleFormGenerator);
    }

    protected destroySimpleFormGenerator() {
        this.destroyAggregation("simpleFormGenerator");
    }

    protected getSmartFormGenerator() {
        return this.getAggregation("smartFormGenerator") as SmartFormGenerator;
    }

    protected setSmartFormGenerator(smartFormGenerator: SmartFormGenerator) {
        this.setAggregation("smartFormGenerator", smartFormGenerator);
    }

    protected destroySmartFormGenerator() {
        this.destroyAggregation("smartFormGenerator");
    }
}