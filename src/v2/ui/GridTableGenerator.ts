import Label from "sap/m/Label";
import { Binding$ChangeEvent } from "sap/ui/model/Binding";
import ODataListBinding from "sap/ui/model/odata/v2/ODataListBinding";
import Column from "sap/ui/table/Column";
import Table from "sap/ui/table/Table";
import { ClassMetadata } from "ui5/antares/pro/types/Global.types";
import { EntityProperty } from "ui5/antares/pro/types/v2/metadata/MetaContext.types";
import { Settings } from "ui5/antares/pro/types/v2/ui/TableGeneratorBase.types";
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

        this.addColumns(table, properties);
        this.setTableInstance(table);
        this.setTable(table);
        this.setContent(table);
    }

    private addColumns(table: Table, properties: EntityProperty[]) {
        const generator = new ControlGenerator({
            generateFor: "Table",
            dateTimeSettings: this.getFactory().getDateTimeSettings(),
            numberSettings: this.getFactory().getNumberSettings()
        });

        for (const property of properties) {
            table.addColumn(new Column({
                label: new Label({ text: property.label }),
                template: generator.generate(property, property.name)
            }));
        }
    }
}