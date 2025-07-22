import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { FormUtilityProvider } from "ui5/antares/pro/types/v2/core/BaseContext.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Settings } from "ui5/antares/pro/types/v2/metadata/NavigationProperty.types";
import { Settings as TableGeneratorSettings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
import { Operation } from "ui5/antares/pro/types/v2/ui/Factory.types";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import FormGeneratorBase from "ui5/antares/pro/v2/ui/FormGeneratorBase";
import GridTableGenerator from "ui5/antares/pro/v2/ui/GridTableGenerator";
import ResponsiveTableGenerator from "ui5/antares/pro/v2/ui/ResponsiveTableGenerator";
import SimpleFormGenerator from "ui5/antares/pro/v2/ui/SimpleFormGenerator";
import SmartFormGenerator from "ui5/antares/pro/v2/ui/SmartFormGenerator";
import TableGeneratorBase from "ui5/antares/pro/v2/ui/TableGeneratorBase";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * @namespace ui5.antares.pro.v2.metadata
 */
export default class NavigationProperty extends ManagedObject implements MetaContextOwner, FormUtilityProvider {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            name: { type: "string" },
            tableClass: { type: "string", defaultValue: "sap.ui.table.Table" },
            tableTitle: { type: "string" },
            tableLayoutData: { type: "object" },
            createFormTitle: { type: "string" },
            updateFormTitle: { type: "string" },
            deleteFormTitle: { type: "string" },
            readFormTitle: { type: "string" },
            createButtonText: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.button.create") },
            createButtonType: { type: "string", defaultValue: "Emphasized" },
            updateButtonText: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.button.update") },
            updateButtonType: { type: "string", defaultValue: "Emphasized" },
            deleteButtonText: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.button.delete") },
            deleteButtonType: { type: "string", defaultValue: "Emphasized" },
            closeButtonText: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.button.close") },
            closeButtonType: { type: "string", defaultValue: "Default" },
            visibleColumnCount: { type: "int", defaultValue: 5 },
            entitySet: { type: "string" },
            multiplicity: { type: "string" },
            context: { type: "object" },
            propertySettings: { type: "object[]", defaultValue: [] },
            propertyOrder: { type: "string[]", defaultValue: [] },
            inheritValues: { type: "object[]", defaultValue: [] },
            operation: { type: "string", visibility: "hidden" }
        },
        aggregations: {
            validationLogics: {
                type: "ui5.antares.pro.v2.validation.ValidationLogic",
                multiple: true,
                singularName: "validationLogic"
            },
            valueLists: {
                type: "ui5.antares.pro.v2.valuelist.ValueList",
                multiple: true,
                singularName: "valueList"
            },
            formLayout: {
                type: "ui5.antares.pro.v2.ui.FormLayout",
                multiple: false
            },
            metaContext: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: false,
                visibility: "hidden"
            },
            formGenerator: {
                type: "ui5.antares.pro.v2.ui.FormGeneratorBase",
                multiple: false,
                visibility: "hidden"
            },
            tableGenerator: {
                type: "ui5.antares.pro.v2.ui.TableGeneratorBase",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
        this.setMetaContext(new MetaContext());
    }

    public async load() {
        const parent = this.getOwnerParent();
        const navigationInfo = await MetaContext.getNavigationInfo(parent.getODataModel(), parent.getEntitySet(), this.getName());

        this.setEntitySet(navigationInfo.entitySet);
        this.setMultiplicity(navigationInfo.multiplicity);
        this.setOperation(this.getOwnerParent().getOperation());
        await this.getMetaContext().load();

        if (navigationInfo.multiplicity === "One") {
            this.setContext(parent.getContext());
        }
    }

    public async generate() {
        if (this.getMultiplicity() === "One") {
            if (this.getOwnerParent().getFormType() === "SimpleForm") {
                this.setFormGenerator(new SimpleFormGenerator());
            } else {
                this.setFormGenerator(new SmartFormGenerator());
            }

            this.getFormGenerator().generate();
        } else {
            if (this.getTableClass() === "sap.m.Table") {
                this.setTableGenerator(new ResponsiveTableGenerator(this.getTableGeneratorSettings()));
            } else {
                this.setTableGenerator(new GridTableGenerator(this.getTableGeneratorSettings()));
            }

            await this.getTableGenerator().generate();
        }
    }

    public getContent() {
        if (this.getMultiplicity() === "One") {
            return this.getFormGenerator().getForm();
        } else {
            return this.getTableGenerator().getContent();
        }
    }

    public getOwnerParent() {
        return this.getParent() as Factory;
    }

    public getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    public getOperation() {
        return this.getProperty("operation") as Operation;
    }

    public getValidationLogicByProperty(property: string) {
        return this.getValidationLogics().find(logic => logic.getPropertyName() === property);
    }

    public getValueListByProperty(property: string) {
        return this.getValueLists().find(valueList => valueList.getLocalDataProperty() === property);
    }

    public async validate() {
        if (this.getMultiplicity() === "Many") {
            throw new Error("NavigationProperty validate method can only be used for navigations with multiplicity: One.");
        }

        return this.getFormGenerator().validate();
    }

    public setOperation(operation: Operation) {
        this.setProperty("operation", operation);
    }

    public deregisterP13n() {
        if (this.getMultiplicity() === "Many") {
            this.getTableGenerator().deregisterP13n();
        }
    }

    private setMetaContext(metaContext: MetaContext) {
        this.setAggregation("metaContext", metaContext);
    }

    private getFormGenerator() {
        return this.getAggregation("formGenerator") as FormGeneratorBase;
    }

    private setFormGenerator(formGenerator: FormGeneratorBase) {
        this.setAggregation("formGenerator", formGenerator);
    }

    private getTableGenerator() {
        return this.getAggregation("tableGenerator") as TableGeneratorBase;
    }

    private setTableGenerator(tableGenerator: TableGeneratorBase) {
        this.setAggregation("tableGenerator", tableGenerator);
    }

    private getTableGeneratorSettings() {
        const settings: TableGeneratorSettings = {
            tableTitle: this.getTableTitle(),
            createFormTitle: this.getCreateFormTitle(),
            updateFormTitle: this.getUpdateFormTitle(),
            deleteFormTitle: this.getDeleteFormTitle(),
            readFormTitle: this.getReadFormTitle(),
            createButtonText: this.getCreateButtonText(),
            createButtonType: this.getCreateButtonType(),
            updateButtonText: this.getUpdateButtonText(),
            updateButtonType: this.getUpdateButtonType(),
            deleteButtonText: this.getDeleteButtonText(),
            deleteButtonType: this.getDeleteButtonType(),
            closeButtonText: this.getCloseButtonText(),
            closeButtonType: this.getCloseButtonType(),
            visibleColumnCount: this.getVisibleColumnCount()
        };

        return settings;
    }
}