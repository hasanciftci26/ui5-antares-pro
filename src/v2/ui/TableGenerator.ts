import ManagedObject, { $ManagedObjectSettings } from "sap/ui/base/ManagedObject";
import JSONModel from "sap/ui/model/json/JSONModel";
import { IClassMetadata } from "ui5/antares/pro/types/Global.types";
import { ISettings } from "ui5/antares/pro/types/v2/ui/TableGenerator.types";
import ContentGenerator from "ui5/antares/pro/v2/ui/ContentGenerator";
import LibraryBundle from "ui5/antares/pro/v2/util/LibraryBundle";
import ResponsiveTable from "sap/m/Table";
import ResponsiveTableColumn from "sap/m/Column";
import GridTable from "sap/ui/table/Table";
import GridTableColumn from "sap/ui/table/Column";
import OverflowToolbar from "sap/m/OverflowToolbar";
import Control from "sap/ui/core/Control";
import Title from "sap/m/Title";
import ToolbarSpacer from "sap/m/ToolbarSpacer";
import OverflowToolbarButton from "sap/m/OverflowToolbarButton";
import ColumnListItem from "sap/m/ColumnListItem";
import Label from "sap/m/Label";
import { IProp } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import Text from "sap/m/Text";
import { IDateBinding, IDateTimeBinding, INumberBinding } from "ui5/antares/pro/types/v2/ui/SimpleFormGenerator.types";
import NumberSettings from "ui5/antares/pro/v2/util/NumberSettings";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class TableGenerator extends ManagedObject {
    static metadata: IClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            entitySet: { type: "string", visibility: "public" },
            table: { type: "object", visibility: "public" },
            tableTitle: { type: "string", visibility: "public" },
            formTitle: { type: "string", visibility: "public" },
            count: { type: "int", visibility: "public", defaultValue: 0 },
            navProperty: { type: "object", visibility: "public" },
            context: { type: "object", visibility: "public" }
        },
        aggregations: {
            navDialogGenerator: {
                type: "ui5.antares.pro.v2.ui.DialogGenerator",
                multiple: false,
                visibility: "hidden"
            },
            navSimpleFormGenerator: {
                type: "ui5.antares.pro.v2.ui.SimpleFormGenerator",
                multiple: false,
                visibility: "hidden"
            },
            navSmartFormGenerator: {
                type: "ui5.antares.pro.v2.ui.SmartFormGenerator",
                multiple: false,
                visibility: "hidden"
            }
        }
    };

    constructor(settings: ISettings) {
        super(settings as $ManagedObjectSettings);

        const model = new JSONModel({
            tableTitle: this.getTableTitle(),
            formTitle: this.getFormTitle(),
            count: this.getCount()
        });

        model.setDefaultBindingMode("TwoWay");
        this.setModel(model, "table");

        this.bindProperties([
            "tableTitle",
            "formTitle",
            "count"
        ]);
    }

    public generate() {
        this.setDefaultTableFormTitle();

        if (this.getNavProperty().tableClass === "sap.m.Table") {
            this.generateResponsiveTable();
        } else {
            this.generateGridTable();
        }
    }

    private generateResponsiveTable() {
        const table = new ResponsiveTable({
            mode: "SingleSelectMaster",
            headerToolbar: new OverflowToolbar({
                content: this.getToolbarContent()
            })
        });

        table.setModel(this.getModel("table"), "table");
        table.bindItems({
            path: this.getNavProperty().name,
            template: new ColumnListItem({
                cells: this.addResponsiveTableColumns(table)
            })
        });
        table.addStyleClass("sapUiSmallMargin");

        this.setTable(table);
    }

    private addResponsiveTableColumns(table: ResponsiveTable) {
        const parent = this.getParent() as ContentGenerator;
        const metaContext = parent.getMetaContextByEntitySet(this.getEntitySet());
        const props = metaContext.getProps();
        const cells: Text[] = [];

        for (const property of props) {
            table.addColumn(new ResponsiveTableColumn({
                visible: property.visible,
                header: new Label({ text: property.label })
            }));

            cells.push(this.getTableColumnText(property));
        }

        return cells;
    }

    private generateGridTable() {
        const table = new GridTable({
            selectionMode: "Single",
            extension: new OverflowToolbar({
                content: this.getToolbarContent()
            })
        });

        table.setModel(this.getModel("table"), "table");
        table.bindRows({
            path: this.getNavProperty().name
        });
        table.addStyleClass("sapUiSmallMargin");

        this.addGridTableColumns(table);
        this.setTable(table);
    }

    private addGridTableColumns(table: GridTable) {
        const parent = this.getParent() as ContentGenerator;
        const metaContext = parent.getMetaContextByEntitySet(this.getEntitySet());
        const props = metaContext.getProps();

        for (const property of props) {
            table.addColumn(new GridTableColumn({
                label: new Label({ text: property.label }),
                template: this.getTableColumnText(property)
            }));
        }
    }

    private getToolbarContent() {
        const parent = this.getParent() as ContentGenerator;
        const content: Control[] = [
            new Title({ text: "{table>/tableTitle} ({table>/count})" })
        ];

        switch (parent.getOperation()) {
            case "Create":
            case "Update":
                content.push(new ToolbarSpacer());
                content.push(this.getTableCreateButton());
                content.push(this.getTableUpdateButton());
                content.push(this.getTableDeleteButton());
                break;
            case "Delete":
                content.push(new ToolbarSpacer());
                content.push(this.getTableDeleteButton());
                break;
        }

        return content;
    }

    private getTableCreateButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://add"
        });

        return button;
    }

    private getTableUpdateButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://edit"
        });

        return button;
    }

    private getTableDeleteButton() {
        const button = new OverflowToolbarButton({
            icon: "sap-icon://delete"
        });

        return button;
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
            text: this.getTimeBinding(property)
        });
    }

    private getNumberText(property: IProp) {
        return new Text({
            text: this.getNumberBinding(property)
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

    private getTimeBinding(property: IProp) {
        const parent = this.getParent() as ContentGenerator;
        const timePattern = parent.getDateTimeSettings()?.timePattern;
        const binding: IDateTimeBinding = {
            path: property.name,
            type: "sap.ui.model.odata.type." + property.type.substring(4)
        };

        if (timePattern) {
            binding.formatOptions = {
                pattern: timePattern
            };
        }

        return binding;
    }

    private getNumberBinding(property: IProp) {
        const parent = this.getParent() as ContentGenerator;
        const numberSettings = NumberSettings.prepare(parent.getNumberSettings());
        const binding: INumberBinding = {
            path: property.name,
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

    private setDefaultTableFormTitle() {
        const navProperty = this.getNavProperty();
        const parent = this.getParent() as ContentGenerator;

        this.setTableTitle(navProperty.tableTitle || this.getEntitySet());

        switch (parent.getOperation()) {
            case "Create":
                this.setFormTitle(navProperty.formTitle || LibraryBundle.getText("ui5AntaresPro.title.createEntry", [this.getEntitySet()])!);
                break;
            case "Update":
                this.setFormTitle(navProperty.formTitle || LibraryBundle.getText("ui5AntaresPro.title.updateEntry", [this.getEntitySet()])!);
                break;
            case "Delete":
                this.setFormTitle(navProperty.formTitle || LibraryBundle.getText("ui5AntaresPro.title.deleteEntry", [this.getEntitySet()])!);
                break;
            case "Read":
                this.setFormTitle(navProperty.formTitle || LibraryBundle.getText("ui5AntaresPro.title.readEntry", [this.getEntitySet()])!);
                break;
        }
    }

    private bindProperties(properties: string[]) {
        for (const property of properties) {
            this.bindProperty(property, {
                path: "/" + property,
                model: "table",
                mode: "TwoWay"
            });
        }
    }
}