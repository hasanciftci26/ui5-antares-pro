import SearchField from "sap/m/SearchField";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import FilterBar from "sap/ui/comp/filterbar/FilterBar";
import ValueHelpDialog, { ValueHelpDialog$OkEvent } from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import { ValueHelpDialog$CancelEvent } from "sap/zen/dsh/widgets/ValueHelpDialog";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Operation, PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";
import { Settings } from "ui5/antares/pro/types/v2/valuelist/ValueList.types";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";

/**
 * @namespace ui5.antares.pro.v2.valuelist
 */
export default class ValueList extends ManagedObject implements MetaContextOwner {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            localDataProperty: { type: "string" },
            entitySet: { type: "string" },
            searchSupported: { type: "boolean", defaultValue: false },
            caseSensitiveSearch: { type: "boolean", defaultValue: false },
            title: { type: "string" },
            filterBarErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.error.invalidValue") },
            dateRangeOptions: { type: "string" },
            parameters: { type: "object[]", defaultValue: [] },
            propertyOrder: { type: "string[]", defaultValue: [] },
            propertyLabels: { type: "object[]", defaultValue: [] },
            valueHelpDialog: { type: "object", visibility: "hidden" }
        },
        aggregations: {
            metaContext: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: Settings) {
        super(settings as $ManagedObjectSettings);
        this.setDefaultTitle();
        this.setMetaContext(new MetaContext());
    }

    public checkValidity() {

    }

    public getOperation() {
        return "Create" as Operation;
    };

    public getPropertySettings() {
        const settings: PropertySettings[] = this.getPropertyLabels().map((property) => {
            return {
                name: property.name,
                label: property.label
            };
        });

        return settings;
    }

    public async open() {
        BusyIndicator.show(0);

        const valueHelpDialog = new ValueHelpDialog({
            title: this.getTitle(),
            supportMultiselect: false,
            supportRanges: false
        });

        this.setValueHelpDialog(valueHelpDialog);
        valueHelpDialog.attachOk(this.onConfirm, this);
        valueHelpDialog.attachCancel(this.onCancel, this);
        valueHelpDialog.attachAfterClose(this.onAfterClose, this);

        await this.getMetaContext().load();

        this.addFilterBar();
        // await this.bindTable();

        valueHelpDialog.update();

        if (!valueHelpDialog.isOpen()) {
            valueHelpDialog.open();
        }

        // this.setInitialFilters();
        BusyIndicator.hide();        
    }

    private getMetaContext() {
        return this.getAggregation("metaContext") as MetaContext;
    }

    private setMetaContext(metaContext: MetaContext) {
        this.setAggregation("metaContext", metaContext);
    }

    private getValueHelpDialog() {
        return this.getProperty("valueHelpDialog") as ValueHelpDialog;
    }

    private setValueHelpDialog(valueHelpDialog: ValueHelpDialog) {
        this.setProperty("valueHelpDialog", valueHelpDialog);
    }    

    private setDefaultTitle() {
        if (this.getTitle()) {
            return;
        }

        this.setTitle(this.getEntitySet());
    }

    private addFilterBar() {
        const filterBar = new FilterBar({
            advancedMode: true,
            isRunningInValueHelpDialog: true,
            // filterGroupItems: this.getFilterGroupItems(),
            showClearOnFB: true
        });

        // filterBar.setModel(this.getValueHelpFilterModel(), "valueHelpFilter");
        // filterBar.attachSearch(this.onFilter, this);
        // filterBar.attachClear(this.onClearFilterBar, this);

        if (this.getSearchSupported()) {
            const searchField = this.getSearchField();

            filterBar.setBasicSearch(searchField);
            searchField.attachSearch(() => {
                filterBar.search();
            });
        }

        this.getValueHelpDialog().setFilterBar(filterBar);
    }
    
    private getSearchField() {
        const searchField = new SearchField({
            value: {
                path: "valueHelpFilter>/ui5AntaresProVHSearch",
                type: "sap.ui.model.odata.type.String"
            }
        });

        return searchField;
    }    

    private async onConfirm(event: ValueHelpDialog$OkEvent) {
        const table = await event.getSource().getTableAsync();

        // if (table instanceof GridTable) {
        //     const selectedIndex = table.getSelectedIndices()[0];
        //     const context = table.getContextByIndex(selectedIndex) as Context;
        //     this.setOutValues(context);
        // }

        // if (table instanceof ResponsiveTable) {
        //     const selectedItem = table.getSelectedItem();
        //     const context = selectedItem.getBindingContext() as Context;
        //     this.setOutValues(context);
        // }

        this.getValueHelpDialog().close();
    }    

    private onCancel(event: ValueHelpDialog$CancelEvent) {
        this.getValueHelpDialog().close();
    }

    private onAfterClose() {
        this.getValueHelpDialog().destroy();
    }    
}