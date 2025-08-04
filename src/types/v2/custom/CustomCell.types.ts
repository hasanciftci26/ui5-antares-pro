/* eslint-disable semi */
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/custom/CustomCell" {
    export default interface CustomCell {
        /**
         * Returns the name of the property for which a custom cell control is defined.
         *
         * @returns The name of the target property in the navigation entity set.
         */
        getPropertyName: GetProperty<string>;

        /**
         * Sets the name of the property for which a custom cell control should be used.
         *
         * @param newValue The name of the target property in the navigation entity set.
         */
        setPropertyName: SetProperty<string>;

        /**
         * Returns the custom SAPUI5 control assigned for rendering the cell.
         *
         * @returns The control instance that replaces the default **sap.m.Text** in the cell.
         */
        getCell: GetProperty<Control>;

        /**
         * Sets the custom SAPUI5 control to be used as the cell content.
         *
         * @param newValue A control instance (e.g., **sap.m.ObjectStatus**) that replaces the default text cell.
         */
        setCell: SetProperty<Control>;
    }
}

export interface Settings {
    /**
     * Name of the property for which the default cell control should be overridden.
     *
     * This must match the name of a property in the navigation entity set. The UI5 Antares Pro library
     * uses this name to identify which column's default **sap.m.Text** should be replaced with the
     * specified custom control.
     */
    propertyName: string;

    /**
     * A custom SAPUI5 control instance to be rendered in place of the default cell control.
     *
     * The provided control (e.g., **sap.m.ObjectStatus**, **sap.m.RatingIndicator**) is rendered
     * in the cell corresponding to the specified property name. This enables consumers to enhance
     * the visual representation or interactivity of the data.
     *
     * ⚠️ Ensure that the control does not use fixed or duplicate IDs.
     */
    cell: Control;
};