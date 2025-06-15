import CheckBox from "sap/m/CheckBox";
import Input from "sap/m/Input";
import SearchField from "sap/m/SearchField";
import TimePicker from "sap/m/TimePicker";
import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import FilterBar, { FilterBar$SearchEvent } from "sap/ui/comp/filterbar/FilterBar";
import FilterGroupItem from "sap/ui/comp/filterbar/FilterGroupItem";
import ValueHelpDialog, { ValueHelpDialog$CancelEvent, ValueHelpDialog$OkEvent } from "sap/ui/comp/valuehelpdialog/ValueHelpDialog";
import Messaging from "sap/ui/core/Messaging";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { IDateBinding, IDateTimeBinding, INumberBinding } from "ui5/antares/pro/types/v2/ui/SimpleFormGenerator.types";
import { ISettings } from "ui5/antares/pro/types/v2/valuelist/ValueList.types";
import MetaContext from "ui5/antares/pro/v2/metadata/MetaContext";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import NumberSettings from "ui5/antares/pro/v2/util/NumberSettings";
import ResponsiveTable from "sap/m/Table";
import ResponsiveTableColumn from "sap/m/Column";
import GridTable from "sap/ui/table/Table";
import GridTableColumn from "sap/ui/table/Column";
import Label from "sap/m/Label";
import Text from "sap/m/Text";
import ColumnListItem from "sap/m/ColumnListItem";
import BusyIndicator from "sap/ui/core/BusyIndicator";
import Filter from "sap/ui/model/Filter";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import { ValueState } from "sap/ui/core/library";
import MessageBox from "sap/m/MessageBox";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";
import DynamicDateRange, { DynamicDateRange$ChangeEvent } from "sap/m/DynamicDateRange";
import Context from "sap/ui/model/odata/v2/Context";

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
            fixedValueSeparator: { type: "string", visibility: "public", defaultValue: " " },
            searchSupported: { type: "boolean", visibility: "public", defaultValue: false },
            caseSensitiveSearch: { type: "boolean", visibility: "public", defaultValue: false },
            title: { type: "string", visibility: "public" },
            filterBarErrorMessage: { type: "string", visibility: "public" },
            dateRangeOptions: { type: "string", visibility: "public" },
            parameters: { type: "object[]", visibility: "public", defaultValue: [] },
            valueHelpDialog: { type: "object", visibility: "hidden" },
            useChildContext: { type: "boolean", visibility: "public", defaultValue: false }
        },
        aggregations: {
            collectionMetaContext: {
                type: "ui5.antares.pro.v2.metadata.MetaContext",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);
        this.setDefaultTitle();
        this.setDefaultFilterBarErrorMessage();
        this.setCollectionMetaContext(new MetaContext({
            entitySet: this.getCollectionPath().substring(1),
            entitySetType: "Parent"
        }));

        const model = new JSONModel({
            ui5AntaresProVHSearch: ""
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "valueHelpFilter");
    }

    public setCollectionPath(newValue: string) {
        const path = newValue.startsWith("/") ? newValue : `/${newValue}`;
        this.setProperty("collectionPath", path);
    }

    public check() {
        if (this.getFixedValues()) {
            const inOutParam = this.getParameters().find(param => param.type === "InOut");
            const displayOnlyParams = this.getParameters().filter(param => param.type === "DisplayOnly");

            if (!inOutParam || !displayOnlyParams.length) {
                throw new Error(
                    "A ValueList with the Fixed Values option enabled can only have one InOut and one-or-multiple DisplayOnly parameter."
                );
            }
        } else {
            const consistent = this.getParameters().find(param => param.type === "InOut" || param.type === "Out");

            if (!consistent) {
                throw new Error("ValueList must include InOut or Out parameter.");
            }
        }
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

        await this.getCollectionMetaContext().load();

        this.addFilterBar();
        await this.bindTable();

        valueHelpDialog.update();

        if (!valueHelpDialog.isOpen()) {
            valueHelpDialog.open();
        }

        this.setInitialFilters();
        BusyIndicator.hide();
    }

    public getFixedValueInOutParameter() {
        const parameter = this.getParameters().find(param => param.type === "InOut");

        if (parameter?.type !== "InOut") {
            throw new Error("InOut parameter is missing for the fixed value enabled ValueList.");
        }

        return parameter;
    }

    public getFixedValueDisplayOnlyParameters() {
        return this.getParameters().filter(param => param.type === "DisplayOnly");
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
        const props = this.getCollectionMetaContext().getProps();

        for (const parameter of parameters) {
            if (parameter.type === "In") {
                continue;
            }

            const property = props.find(prop => prop.name === parameter.valueListProperty);

            if (!property) {
                throw new Error(parameter.valueListProperty + " was not found in the Entity Set: " + this.getCollectionPath());
            }

            items.push(new FilterGroupItem({
                groupName: "__$INTERNAL$",
                name: property.name,
                label: property.label,
                visibleInFilterBar: true,
                control: this.getFilterBarControl(property)
            }));
        }

        return items;
    }

    private getFilterBarControl(property: IProp) {
        switch (property.type) {
            case "Edm.DateTime":
            case "Edm.DateTimeOffset":
                return this.getDynamicDateRange(property);
            case "Edm.Time":
                return this.getTimePicker(property);
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberInput(property);
            case "Edm.Boolean":
                return this.getBooleanControl(property);
            default:
                return this.getStringInput(property);
        }
    }

    private getDynamicDateRange(property: IProp) {
        const dynamicDateRange = new DynamicDateRange({
            name: property.name,
            standardOptions: this.getDateRangeOptions()
        });

        dynamicDateRange.attachChange(this.onDateRangeChange, this);
        return dynamicDateRange;
    }

    private onDateRangeChange(event: DynamicDateRange$ChangeEvent) {
        if (event.getParameter("valid")) {
            event.getSource().setValueState("None");
        } else {
            event.getSource().setValueState("Error");
        }
    }

    private getDateBinding(property: IProp) {
        const parent = this.getParent() as ContentGenerator;
        const datePattern = parent.getDateTimeSettings()?.datePattern;
        const binding: IDateBinding = {
            path: property.name,
            type: "sap.ui.model.odata.type." + property.type.substring(4),
            constraints: {
                displayFormat: "Date"
            }
        };

        if (datePattern) {
            binding.formatOptions = {
                pattern: datePattern
            };
        }

        return binding;
    }

    private getDateTimeBinding(property: IProp) {
        const parent = this.getParent() as ContentGenerator;
        const dateTimePattern = parent.getDateTimeSettings()?.dateTimePattern;
        const binding: IDateTimeBinding = {
            path: property.name,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (dateTimePattern) {
            binding.formatOptions = {
                pattern: dateTimePattern
            };
        }

        return binding;
    }

    private getTimePicker(property: IProp) {
        const timePicker = new TimePicker({
            value: this.getTimeBinding(property, "Filterbar")
        });

        Messaging.registerObject(timePicker, true);
        return timePicker;
    }

    private getTimeBinding(property: IProp, source: "Filterbar" | "Table") {
        const parent = this.getParent() as ContentGenerator;
        const timePattern = parent.getDateTimeSettings()?.timePattern;
        const path = source === "Filterbar" ? `valueHelpFilter>/${property.name}` : property.name;
        const binding: IDateTimeBinding = {
            path: path,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (timePattern) {
            binding.formatOptions = {
                pattern: timePattern
            };
        }

        return binding;
    }

    private getNumberInput(property: IProp) {
        const input = new Input({
            textAlign: "End",
            value: this.getNumberBinding(property, "Filterbar")
        });

        input.attachSubmit(this.onEnterFilter, this);
        Messaging.registerObject(input, true);
        return input;
    }

    private getNumberBinding(property: IProp, source: "Filterbar" | "Table") {
        const parent = this.getParent() as ContentGenerator;
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());
        const path = source === "Filterbar" ? `valueHelpFilter>/${property.name}` : property.name;
        const binding: INumberBinding = {
            path: path,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (numberSettings) {
            binding.formatOptions = {
                groupingEnabled: numberSettings.groupingEnabled,
                groupingSeparator: numberSettings.groupingSeparator,
                groupingSize: numberSettings.groupingSize,
                decimalSeparator: numberSettings.decimalSeparator
            };
        }

        if (property.precision && property.scale) {
            binding.constraints = {
                precision: property.precision,
                scale: property.scale
            };
        }

        return binding;
    }

    private getBooleanControl(property: IProp) {
        return new CheckBox({
            selected: {
                path: "valueHelpFilter>/" + property.name,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            }
        });
    }

    private getStringInput(property: IProp) {
        const input = new Input({
            value: {
                path: "valueHelpFilter>/" + property.name,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            },
            maxLength: property.maxLength
        });

        input.attachSubmit(this.onEnterFilter, this);
        Messaging.registerObject(input, true);
        return input;
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
        const parent = this.getParent() as ContentGenerator;

        table.setModel(parent.getODataModel());
        table.bindRows({
            path: this.getCollectionPath(),
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
        const props = this.getCollectionMetaContext().getProps();

        for (const parameter of parameters) {
            if (parameter.type === "In" || parameter.type === "FilterOnly") {
                continue;
            }

            const property = props.find(prop => prop.name === parameter.valueListProperty);

            if (!property) {
                throw new Error(parameter.valueListProperty + " was not found in the Entity Set: " + this.getCollectionPath());
            }

            table.addColumn(new GridTableColumn({
                label: new Label({ text: property.label }),
                template: this.getTableColumnText(property)
            }));
        }
    }

    private bindResponsiveTable(table: ResponsiveTable) {
        const parent = this.getParent() as ContentGenerator;

        table.setModel(parent.getODataModel());
        table.bindItems({
            path: this.getCollectionPath(),
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
        const props = this.getCollectionMetaContext().getProps();
        const cells: Text[] = [];

        for (const parameter of parameters) {
            if (parameter.type === "In" || parameter.type === "FilterOnly") {
                continue;
            }

            const property = props.find(prop => prop.name === parameter.valueListProperty);

            if (!property) {
                throw new Error(parameter.valueListProperty + " was not found in the Entity Set: " + this.getCollectionPath());
            }

            table.addColumn(new ResponsiveTableColumn({
                header: new Label({ text: property.label })
            }));

            cells.push(this.getTableColumnText(property));
        }

        return cells;
    }

    private getTableColumnText(property: IProp) {
        switch (property.type) {
            case "Edm.DateTime":
                if (property.displayFormat === "Date") {
                    return this.getDateText(property);
                } else {
                    return this.getDateTimeText(property);
                }
            case "Edm.DateTimeOffset":
                return this.getDateTimeText(property);
            case "Edm.Time":
                return this.getTimeText(property);
            case "Edm.Byte":
            case "Edm.SByte":
            case "Edm.Int16":
            case "Edm.Int32":
            case "Edm.Int64":
            case "Edm.Single":
            case "Edm.Double":
            case "Edm.Decimal":
                return this.getNumberText(property);
            case "Edm.Boolean":
                return this.getBooleanText(property);
            default:
                return this.getRegularText(property);
        }
    }

    private getDateText(property: IProp) {
        return new Text({
            text: this.getDateBinding(property)
        });
    }

    private getDateTimeText(property: IProp) {
        return new Text({
            text: this.getDateTimeBinding(property)
        });
    }

    private getTimeText(property: IProp) {
        return new Text({
            text: this.getTimeBinding(property, "Table")
        });
    }

    private getNumberText(property: IProp) {
        return new Text({
            text: this.getNumberBinding(property, "Table")
        });
    }

    private getBooleanText(property: IProp) {
        const parent = this.getParent() as ContentGenerator;
        const booleanSettings = parent.getBooleanSettings();

        return new Text({
            text: {
                path: property.name,
                formatter: (value: boolean | null) => {
                    if (value == null) {
                        return value;
                    }

                    return value === true ? booleanSettings.trueText : booleanSettings.falseText;
                }
            }
        });
    }

    private getRegularText(property: IProp) {
        return new Text({
            text: {
                path: property.name,
                type: "sap.ui.model.odata.type." + property.type.substring(4)
            }
        });
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
        const props = this.getCollectionMetaContext().getProps();

        for (const param of this.getParameters()) {
            if (param.type === "In") {
                continue;
            }

            const property = props.find(prop => prop.name === param.valueListProperty);

            if (!property) {
                throw new Error(param.valueListProperty + " was not found in the Entity Set: " + this.getCollectionPath());
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
        const filterData: Record<string, any> = this.getValueHelpFilterModel().getData();

        for (const property in filterData) {
            if (property === "ui5AntaresProVHSearch") {
                continue;
            }

            if (filterData[property] != null && filterData[property] !== "") {
                filters.push(new Filter(property, "EQ", filterData[property]));
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
        const parent = this.getParent() as ContentGenerator;

        for (const param of this.getParameters()) {
            if (param.type !== "Out" && param.type !== "InOut") {
                continue;
            }

            const value = context.getProperty(param.valueListProperty);
            parent.getODataModel().setProperty(this.getRelevantContext().getPath() + `/${this.getPropertyPath(param.localDataProperty)}`, value);
        }
    }

    private onCancel(event: ValueHelpDialog$CancelEvent) {
        this.getValueHelpDialog().close();
    }

    private onAfterClose() {
        this.getValueHelpDialog().destroy();
    }

    private setDefaultTitle() {
        if (this.getTitle()) {
            return;
        }

        const entitySet = this.getCollectionPath().substring(1);
        this.setTitle(entitySet);
    }

    private setDefaultFilterBarErrorMessage() {
        if (this.getFilterBarErrorMessage()) {
            return;
        }

        this.setFilterBarErrorMessage(LibraryBundle.getText("ui5AntaresPro.error.invalidValue")!);
    }

    private getCollectionMetaContext() {
        return this.getAggregation("collectionMetaContext") as MetaContext;
    }

    private setCollectionMetaContext(collectionMetaContext: MetaContext) {
        this.setAggregation("collectionMetaContext", collectionMetaContext);
    }

    private getValueHelpDialog() {
        return this.getProperty("valueHelpDialog") as ValueHelpDialog;
    }

    private setValueHelpDialog(valueHelpDialog: ValueHelpDialog) {
        this.setProperty("valueHelpDialog", valueHelpDialog);
    }

    private getValueHelpFilterModel() {
        return this.getModel("valueHelpFilter") as JSONModel;
    }

    private setInitialFilters() {
        const context = this.getRelevantContext();
        const props = this.getCollectionMetaContext().getProps();
        let triggerSearch = false;

        this.getValueHelpFilterModel().setData({ ui5AntaresProVHSearch: "" });

        for (const param of this.getParameters()) {
            if (param.type !== "In" && param.type !== "InOut") {
                continue;
            }

            const contextValue = context.getProperty(this.getPropertyPath(param.localDataProperty));
            const property = props.find(prop => prop.name === param.valueListProperty);

            if (!property) {
                throw new Error(param.valueListProperty + " was not found in the Entity Set: " + this.getCollectionPath());
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

    private async getListBinding() {
        const table = await this.getValueHelpDialog().getTableAsync();

        if (table instanceof GridTable) {
            return table.getBinding("rows") as ODataListBinding;
        }

        if (table instanceof ResponsiveTable) {
            return table.getBinding("items") as ODataListBinding;
        }
    }

    private onEnterFilter() {
        this.getValueHelpDialog().getFilterBar().search();
    }

    private onClearFilterBar() {
        this.getValueHelpFilterModel().setData({ ui5AntaresProVHSearch: "" });
        this.getValueHelpDialog().getFilterBar().search();
    }

    private getRelevantContext() {
        const parent = this.getParent() as ContentGenerator;

        if (this.getUseChildContext()) {
            return parent.getChildContext() || parent.getContext();
        } else {
            return parent.getContext();
        }
    }

    private getPropertyPath(propertyName: string) {
        if (this.getUseChildContext() && propertyName.includes("/")) {
            return propertyName.split("/")[1];
        } else {
            return propertyName;
        }
    }
}