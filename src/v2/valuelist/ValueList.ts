import SearchField from "sap/m/SearchField";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import FilterBar, { FilterBar$SearchEvent } from "sap/ui/comp/filterbar/FilterBar";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import ValueHelpDialog, { ValueHelpDialog$OkEvent } from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import JSONModel from "sap/ui/model/json/JSONModel";
import { ValueHelpDialog$CancelEvent } from "sap/zen/dsh/widgets/ValueHelpDialog";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { MetaContextOwner } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Operation, PropertySettings } from "ui5/antares/pro/types/v2/ui/Factory.types";
import { Settings } from "ui5/antares/pro/types/v2/valuelist/ValueList.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import Factory from "ui5/antares/pro/v2/ui/Factory";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";
import ResponsiveTable from "sap/m/Table";
import ResponsiveTableColumn from "sap/m/Column";
import GridTable from "sap/ui/table/Table";
import GridTableColumn from "sap/ui/table/Column";
import Label from "sap/m/Label";
import ColumnListItem from "sap/m/ColumnListItem";
import Control from "sap/ui/core/Control";
import Context from "sap/ui/model/odata/v2/Context";
import DynamicDateRange from "sap/m/DynamicDateRange";
import Input from "sap/m/Input";
import TimePicker from "sap/m/TimePicker";
import CheckBox from "sap/m/CheckBox";
import { ValueState } from "sap/ui/core/library";
import MessageBox from "sap/m/MessageBox";
import Filter from "sap/ui/model/Filter";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import PropertyBinding from "sap/ui/model/PropertyBinding";
import CustomFilterBar from "ui5/antares/pro/v2/custom/type/CustomFilterBar";

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
            searchSupported: { type: "boolean", defaultValue: true },
            caseSensitiveSearch: { type: "boolean", defaultValue: false },
            title: { type: "string" },
            filterBarErrorMessage: { type: "string", defaultValue: LibraryBundle.getText("ui5AntaresPro.error.invalidValue") },
            localDataContext: { type: "object" },
            pathPrefix: { type: "string", defaultValue: "" },
            dateRangeOptions: { type: "string[]" },
            parameters: { type: "object[]", defaultValue: [] },
            propertyOrder: { type: "string[]", defaultValue: [] },
            propertyLabels: { type: "object[]", defaultValue: [] },
            valueHelpDialog: { type: "object", visibility: "hidden" },
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

        const model = new JSONModel({
            ui5AntaresProVHSearch: ""
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "valueHelpFilter");
    }

    public getEntitySet() {
        return this.getProperty("entitySet") as string;
    }

    public setEntitySet(entitySet: string) {
        this.setProperty("entitySet", entitySet.startsWith("/") ? entitySet.substring(1) : entitySet);
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
        this.checkValidity();

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
        await this.bindTable();

        valueHelpDialog.update();

        if (!valueHelpDialog.isOpen()) {
            valueHelpDialog.open();
        }

        this.setInitialFilters();
        BusyIndicator.hide();
    }

    private checkValidity() {
        const consistent = this.getParameters().find(param => param.type === "InOut" || param.type === "Out");

        if (!consistent) {
            throw new Error("ValueList must include InOut or Out parameter.");
        }
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
            filterGroupItems: this.getFilterGroupItems(),
            showClearOnFB: true
        });

        filterBar.setModel(this.getValueHelpFilterModel(), "valueHelpFilter");
        filterBar.attachSearch(this.onFilter, this);
        filterBar.attachClear(this.onClearFilterBar, this);

        if (this.getSearchSupported()) {
            const searchField = this.getSearchField();

            filterBar.setBasicSearch(searchField);
            searchField.attachSearch(() => {
                filterBar.search();
            });
        }

        this.getValueHelpDialog().setFilterBar(filterBar);
    }

    private getFilterGroupItems() {
        const items: FilterGroupItem[] = [];
        const parameters = this.getParameters();
        const properties = this.getMetaContext().getEntityProperties();
        const generator = new ControlGenerator({
            generateFor: "Filterbar",
            dateRangeOptions: this.getDateRangeOptions(),
            dateTimeSettings: this.getFactory().getDateTimeSettings(),
            numberSettings: this.getFactory().getNumberSettings()
        });

        for (const parameter of parameters) {
            if (parameter.type === "In") {
                continue;
            }

            const property = properties.find(property => property.name === parameter.valueListProperty);

            if (!property) {
                throw new Error(parameter.valueListProperty + " was not found in the Entity Set: " + this.getEntitySet());
            }

            const control = generator.generate(property, "valueHelpFilter>/" + property.name);

            if (control instanceof Input) {
                control.attachSubmit(() => this.getValueHelpDialog().getFilterBar().search());
            }

            items.push(new FilterGroupItem({
                groupName: "__$INTERNAL$",
                name: property.name,
                label: property.label,
                visibleInFilterBar: true,
                control: control
            }));
        }

        return items;
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

    private async bindTable() {
        const table = await this.getValueHelpDialog().getTableAsync();

        if (table instanceof GridTable) {
            this.bindGridTable(table);
        }

        if (table instanceof ResponsiveTable) {
            this.bindResponsiveTable(table);
        }
    }

    private bindGridTable(table: GridTable) {
        table.setModel(this.getFactory().getODataModel());
        table.bindRows({
            path: "/" + this.getEntitySet(),
            events: {
                dataReceived: () => {
                    this.getValueHelpDialog().update();
                }
            }
        });

        this.addGridTableColumns(table);
    }

    private addGridTableColumns(table: GridTable) {
        const parameters = this.getParameters();
        const properties = this.getMetaContext().getEntityProperties();
        const generator = new ControlGenerator({
            generateFor: "Table",
            dateRangeOptions: this.getDateRangeOptions(),
            dateTimeSettings: this.getFactory().getDateTimeSettings(),
            numberSettings: this.getFactory().getNumberSettings()
        });

        for (const parameter of parameters) {
            if (parameter.type === "In" || parameter.type === "FilterOnly") {
                continue;
            }

            const property = properties.find(property => property.name === parameter.valueListProperty);

            if (!property) {
                throw new Error(parameter.valueListProperty + " was not found in the Entity Set: " + this.getEntitySet());
            }

            table.addColumn(new GridTableColumn({
                label: new Label({ text: property.label }),
                template: generator.generate(property, property.name)
            }));
        }
    }

    private bindResponsiveTable(table: ResponsiveTable) {
        table.setModel(this.getFactory().getODataModel());
        table.bindItems({
            path: "/" + this.getEntitySet(),
            template: new ColumnListItem({
                cells: this.addResponsiveTableColumns(table)
            }),
            events: {
                dataReceived: () => {
                    this.getValueHelpDialog().update();
                }
            }
        });
    }

    private addResponsiveTableColumns(table: ResponsiveTable) {
        const parameters = this.getParameters();
        const properties = this.getMetaContext().getEntityProperties();
        const generator = new ControlGenerator({
            generateFor: "Table",
            dateRangeOptions: this.getDateRangeOptions(),
            dateTimeSettings: this.getFactory().getDateTimeSettings(),
            numberSettings: this.getFactory().getNumberSettings()
        });
        const cells: Control[] = [];

        for (const parameter of parameters) {
            if (parameter.type === "In" || parameter.type === "FilterOnly") {
                continue;
            }

            const property = properties.find(property => property.name === parameter.valueListProperty);

            if (!property) {
                throw new Error(parameter.valueListProperty + " was not found in the Entity Set: " + this.getEntitySet());
            }

            table.addColumn(new ResponsiveTableColumn({
                header: new Label({ text: property.label })
            }));

            cells.push(generator.generate(property, property.name));
        }

        return cells;
    }

    private async onConfirm(event: ValueHelpDialog$OkEvent) {
        const table = await event.getSource().getTableAsync();

        if (table instanceof GridTable) {
            const selectedIndex = table.getSelectedIndices()[0];
            const context = table.getContextByIndex(selectedIndex) as Context;
            this.setOutValues(context);
        }

        if (table instanceof ResponsiveTable) {
            const selectedItem = table.getSelectedItem();
            const context = selectedItem.getBindingContext() as Context;
            this.setOutValues(context);
        }

        this.getValueHelpDialog().close();
    }

    private setOutValues(context: Context) {
        const parent = this.getFactory();

        for (const param of this.getParameters()) {
            if (param.type !== "Out" && param.type !== "InOut") {
                continue;
            }

            const value = context.getProperty(param.valueListProperty);
            parent.getODataModel().setProperty(this.getParameterPath(param.localDataProperty), value);
        }
    }

    private getParameterPath(property: string) {
        const propertyPath = this.getPathPrefix() ? this.getPathPrefix() + "/" + property : property;
        return this.getLocalDataContext().getPath() + "/" + propertyPath;
    }

    private onCancel(event: ValueHelpDialog$CancelEvent) {
        this.getValueHelpDialog().close();
    }

    private onAfterClose() {
        this.getValueHelpDialog().destroy();
    }

    private getValueHelpFilterModel() {
        return this.getModel("valueHelpFilter") as JSONModel;
    }

    private getFactory() {
        const parent = this.getParent() as ManagedObject;

        if (parent.getMetadata().getName() === "ui5.antares.pro.v2.metadata.NavigationProperty") {
            return parent.getParent() as Factory;
        } else {
            return this.getParent() as Factory;
        }
    }

    private setInitialFilters() {
        const context = this.getLocalDataContext();
        const properties = this.getMetaContext().getEntityProperties();
        let triggerSearch = false;

        this.getValueHelpFilterModel().setData({ ui5AntaresProVHSearch: "" });

        for (const param of this.getParameters()) {
            if (param.type !== "In" && param.type !== "InOut") {
                continue;
            }

            const contextValue = context.getProperty(this.getParameterPath(param.localDataProperty));
            const property = properties.find(property => property.name === param.valueListProperty);

            if (!property) {
                throw new Error(param.valueListProperty + " was not found in the Entity Set: " + this.getEntitySet());
            }

            if (contextValue != null && contextValue !== "") {
                if (contextValue instanceof Date) {
                    const dynamicDateRanges = this.getValueHelpDialog().getFilterBar().getFilterGroupItems()
                        .map(item => item.getControl())
                        .filter(item => item instanceof DynamicDateRange);
                    const dynamicDateRange = dynamicDateRanges.find(control => control.getName() === property.name);

                    if (dynamicDateRange) {
                        dynamicDateRange.setValue({
                            operator: "DATE",
                            values: [contextValue]
                        });
                    }
                } else {
                    this.getValueHelpFilterModel().setProperty("/" + property.name, contextValue || null);
                }

                triggerSearch = true;
            }
        }

        if (triggerSearch) {
            this.getValueHelpDialog().getFilterBar().search();
        }
    }

    private async onFilter(event: FilterBar$SearchEvent) {
        const valid = this.checkFilterBarValues();

        if (!valid) {
            MessageBox.error(this.getFilterBarErrorMessage());
            return;
        }

        const filters = this.getFilters();
        const searchFieldFilter = this.getSearchFieldFilter();
        const binding = await this.getListBinding();

        if (!binding) {
            return;
        }

        if (searchFieldFilter) {
            filters.push(searchFieldFilter);
        }

        if (filters.length) {
            const filter = new Filter({
                filters: filters,
                and: true
            });

            binding.filter(filter);
        } else {
            binding.filter();
        }
    }

    private checkFilterBarValues() {
        const filterBar = this.getValueHelpDialog().getFilterBar();
        let valid = true;

        for (const item of filterBar.getFilterGroupItems()) {
            const control = item.getControl() as Input | DynamicDateRange | TimePicker | CheckBox;

            if (control instanceof CheckBox === false) {
                if (control.getValueState() === ValueState.Error) {
                    valid = false;
                    break;
                }
            }
        }

        return valid;
    }

    private getSearchFieldFilter() {
        const value = this.getValueHelpFilterModel().getProperty("/ui5AntaresProVHSearch") as string;

        if (!value) {
            return;
        }

        const filters: Filter[] = [];
        const properties = this.getMetaContext().getEntityProperties();

        for (const param of this.getParameters()) {
            if (param.type === "In") {
                continue;
            }

            const property = properties.find(property => property.name === param.valueListProperty);

            if (!property) {
                throw new Error(param.valueListProperty + " was not found in the Entity Set: " + this.getEntitySet());
            }

            if (property.type !== "Edm.String") {
                continue;
            }

            filters.push(new Filter({
                path: property.name,
                operator: "Contains",
                value1: value,
                caseSensitive: this.getCaseSensitiveSearch()
            }));
        }

        if (!filters.length) {
            return;
        }

        return new Filter({
            filters: filters,
            and: false
        });
    }

    private getFilters() {
        const filters: Filter[] = [];
        const filterBar = this.getValueHelpDialog().getFilterBar();

        for (const item of filterBar.getFilterGroupItems()) {
            const control = item.getControl() as Input | DynamicDateRange | TimePicker | CheckBox;

            if (control instanceof DynamicDateRange) {
                continue;
            }

            const property = control.getName();

            if (control instanceof CheckBox) {
                filters.push(new Filter(property, "EQ", control.getSelected()));
            } else {
                const binding = control.getBinding("value") as PropertyBinding;
                const value = control.getProperty("value");
                const type = binding.getType() as CustomFilterBar;
                const parsedValue = type.parseValue(value, "string");

                if (parsedValue != null && parsedValue !== "") {
                    filters.push(new Filter({
                        path: property,
                        operator: type.getFilterOperator(),
                        value1: parsedValue,
                        caseSensitive: this.getCaseSensitiveSearch()
                    }));
                }
            }
        }

        filters.push(...this.getDateFilters());
        return filters;
    }

    private getDateFilters() {
        const filters: Filter[] = [];
        const filterBar = this.getValueHelpDialog().getFilterBar();

        for (const item of filterBar.getFilterGroupItems()) {
            const control = item.getControl() as Input | DynamicDateRange | TimePicker | CheckBox;

            if (control instanceof DynamicDateRange === false) {
                continue;
            }

            const value = control.getValue();

            if (value) {
                const dates = DynamicDateRange.toDates(value, "Default");
                const property = control.getName();

                if (value.operator === "FROM" || value.operator === "FROMDATETIME") {
                    filters.push(new Filter(property, "GT", dates[0]));
                } else if (value.operator === "TO" || value.operator === "TODATETIME") {
                    filters.push(new Filter(property, "LT", dates[0]));
                } else {
                    filters.push(new Filter(property, "BT", dates[0], dates[1]));
                }
            }
        }

        return filters;
    }

    private async getListBinding() {
        const table = await this.getValueHelpDialog().getTableAsync();

        if (table instanceof GridTable) {
            return table.getBinding("rows") as ODataListBinding;
        }

        if (table instanceof ResponsiveTable) {
            return table.getBinding("items") as ODataListBinding;
        }
    }

    private onClearFilterBar() {
        this.getValueHelpFilterModel().setData({ ui5AntaresProVHSearch: "" });
        this.getValueHelpDialog().getFilterBar().search();
    }
}