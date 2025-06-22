import Label from "sap/m/Label";
import CustomData from "sap/ui/core/CustomData";
import { Binding$ChangeEvent } from "sap/ui/model/Binding";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import Column from "sap/ui/table/Column";
import Table from "sap/ui/table/Table";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { P13nProperty, Settings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
import ControlGenerator from "ui5/antares/pro/v2/custom/control/ControlGenerator";
import TableGeneratorBase from "ui5/antares/pro/v2/ui/TableGeneratorBase";

/**
 * @namespace ui5.antares.pro.v2.ui
 */
export default class GridTableGenerator extends TableGeneratorBase {
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

    public generate() {
        const properties = this.getMetaContext().getEntityProperties().filter(prop => prop.visible);
        const table = new Table({
            selectionMode: "Single",
            extension: this.getToolbar(properties.length > this.getVisibleColumnCount())
        });

        this.initialize();

        table.bindRows({
            path: this.getOwnerParent().getName(),
            events: {
                change: (event: Binding$ChangeEvent) => {
                    const length = (event.getSource() as ODataListBinding).getLength();
                    this.setCount(length);
                }
            }
        });

        table.addStyleClass("sapUiSmallMargin");

        const p13nProperties = this.addColumns(table, properties);
        
        this.setTableInstance(table);
        this.setTable(table);
        this.setContent(table);
        this.registerP13n(p13nProperties);
    }

    private addColumns(table: Table, properties: EntityProperty[]) {
        const p13nProperties: P13nProperty[] = [];
        const generator = new ControlGenerator({
            generateFor: "Table",
            dateTimeSettings: this.getFactory().getDateTimeSettings(),
            numberSettings: this.getFactory().getNumberSettings()
        });
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
                label: new Label({ text: property.label }),
                template: generator.generate(property, property.name)
            }));

            index++;
        }

        return p13nProperties;
    }
}