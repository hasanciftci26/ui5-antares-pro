import Column from "sap/m/Column";
import ColumnListItem from "sap/m/ColumnListItem";
import Label from "sap/m/Label";
import Table from "sap/m/Table";
import CustomData from "sap/ui/core/CustomData";
import Fragment from "sap/ui/core/Fragment";
import { Binding$ChangeEvent } from "sap/ui/model/Binding";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { P13nProperty, Settings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import TableGeneratorBase from "ui5/antares/pro/v2/ui/TableGeneratorBase";

/**
 * **Internal use only.**
 *
 * This class is part of the internal implementation of the **UI5 Antares Pro** library
 * and is not intended for public use or direct consumption.
 *
 * It may change or be removed without notice in future versions.
 *
 * @internal
 * 
 * @namespace ui5.antares.pro.v2.ui
 */
export default class ResponsiveTableGenerator extends TableGeneratorBase {
    static metadata: ClassMetadata = {
        library: "ui5.antares.pro",
        final: true,
        properties: {
            content: { type: "object" },
            table: { type: "object" }
        }
    };

    constructor(settings: Settings) {
        super(settings);
    }

    public async generate() {
        const table = await this.loadTable();
        const p13nProperties = this.addColumns(table);

        this.initialize();
        table.setHeaderToolbar(this.getToolbar());

        table.bindItems({
            path: this.getOwnerParent().getName(),
            factory: this.tableFactory.bind(this),
            events: {
                change: (event: Binding$ChangeEvent) => {
                    const length = (event.getSource() as ODataListBinding).getLength();
                    this.setCount(length);
                }
            }
        });

        this.setTableInstance(table);
        this.setTable(table);
        this.setContent(table);
        this.registerP13n(p13nProperties);
        this.setTableLayoutData();
    }

    private addColumns(table: Table) {
        const properties = this.getMetaContext().getEntityProperties().filter(prop => prop.visible);
        const p13nProperties: P13nProperty[] = [];
        const visibleColumns: string[] = [];
        let index = 0;

        for (const property of properties) {
            p13nProperties.push({
                key: property.name,
                label: property.label,
                path: property.name
            });

            table.addColumn(new Column({
                customData: new CustomData({ key: "p13nKey", value: property.name }),
                visible: index < this.getVisibleColumnCount(),
                header: new Label({ text: property.label }),
            }));

            if (index < this.getVisibleColumnCount()) {
                visibleColumns.push(property.name);
            }

            index++;
        }

        this.setVisibleColumns(visibleColumns);
        return p13nProperties;
    }

    private tableFactory(id: string) {
        const properties = this.getMetaContext().getEntityProperties().filter(prop => prop.visible);
        const generator = new ControlGenerator({
            generateFor: "Table",
            dateTimeSettings: this.getFactory().getDateTimeSettings(),
            numberSettings: this.getFactory().getNumberSettings()
        });
        const template = new ColumnListItem({
            id: id
        });

        for (const column of this.getVisibleColumns()) {
            const property = properties.find(property => property.name === column);

            if (property) {
                template.addCell(generator.generate(property, property.name));
            }
        }

        return template;
    }

    private async loadTable() {
        const table = await Fragment.load({
            id: "responsiveTable" + Date.now(),
            name: "ui5.antares.pro.v2.ui.static.ResponsiveTable"
        }) as Table;

        return table;
    }
}