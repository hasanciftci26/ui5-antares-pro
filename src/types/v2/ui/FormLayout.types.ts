/* eslint-disable semi */
import LayoutData from "sap/ui/core/LayoutData";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/FormLayout" {
    export default interface FormLayout {
        /**
         * Gets the layout type used by the form layout.
         * Determines the overall layout algorithm used to arrange the form content.
         * Supported types are "ResponsiveGridLayout" and "ColumnLayout".
         * 
         * @returns The current layout type, defaults to "ResponsiveGridLayout".
         */
        getLayoutType: GetProperty<LayoutType>;

        /**
         * Sets the layout type for the form layout.
         * Changing the layout type affects how controls are visually arranged in the form.
         * 
         * @param newValue The layout type to set ("ResponsiveGridLayout" | "ColumnLayout").
         */
        setLayoutType: SetProperty<LayoutType>;

        /**
         * Gets the number of columns used on extra-large (XL) screen sizes.
         * Controls the horizontal division of form fields when displayed on wide screens.
         * 
         * @returns Number of columns configured for XL screens; default is 1.
         */
        getColumnsXL: GetProperty<number>;

        /**
         * Sets the number of columns for extra-large (XL) screen sizes.
         * Increasing columnsXL allows more fields per row on wide displays.
         * 
         * @param newValue Number of columns for XL screens.
         */
        setColumnsXL: SetProperty<number>;

        /**
         * Gets the number of columns used on large (L) screen sizes.
         * Controls form layout for desktop-sized or large tablet screens.
         * 
         * @returns Number of columns configured for L screens; default is 1.
         */
        getColumnsL: GetProperty<number>;

        /**
         * Sets the number of columns for large (L) screen sizes.
         * This influences the form’s width utilization on large screens.
         * 
         * @param newValue Number of columns for L screens.
         */
        setColumnsL: SetProperty<number>;

        /**
         * Gets the number of columns used on medium (M) screen sizes.
         * Relevant for tablets and medium-sized displays.
         * 
         * @returns Number of columns configured for M screens; default is 1.
         */
        getColumnsM: GetProperty<number>;

        /**
         * Sets the number of columns for medium (M) screen sizes.
         * Helps optimize form appearance on medium devices.
         * 
         * @param newValue Number of columns for M screens.
         */
        setColumnsM: SetProperty<number>;

        /**
         * Gets the label span on extra-large (XL) screens.
         * Specifies how many grid cells the label of each field occupies.
         * Larger values make labels wider relative to inputs.
         * 
         * @returns Label span in grid cells for XL screens; default is 12.
         */
        getLabelSpanXL: GetProperty<number>;

        /**
         * Sets the label span on extra-large (XL) screens.
         * Adjust this to control label width in the form’s grid layout.
         * 
         * @param newValue Label span in grid cells for XL screens.
         */
        setLabelSpanXL: SetProperty<number>;

        /**
         * Gets the label span on large (L) screens.
         * Defines label width for large desktop or tablet screens.
         * 
         * @returns Label span in grid cells for L screens; default is 12.
         */
        getLabelSpanL: GetProperty<number>;

        /**
         * Sets the label span on large (L) screens.
         * Modifies how much horizontal space labels take on large screens.
         * 
         * @param newValue Label span in grid cells for L screens.
         */
        setLabelSpanL: SetProperty<number>;

        /**
         * Gets the label span on medium (M) screens.
         * Controls label size for medium devices like tablets.
         * 
         * @returns Label span in grid cells for M screens; default is 12.
         */
        getLabelSpanM: GetProperty<number>;

        /**
         * Sets the label span on medium (M) screens.
         * Adjust label widths on medium-sized screens.
         * 
         * @param newValue Label span in grid cells for M screens.
         */
        setLabelSpanM: SetProperty<number>;

        /**
         * Gets the label span on small (S) screens.
         * Relevant for phones and small screen devices.
         * 
         * @returns Label span in grid cells for S screens; default is 12.
         */
        getLabelSpanS: GetProperty<number>;

        /**
         * Sets the label span on small (S) screens.
         * Controls how wide labels are on smaller devices.
         * 
         * @param newValue Label span in grid cells for S screens.
         */
        setLabelSpanS: SetProperty<number>;

        /**
         * Gets the empty span on extra-large (XL) screens.
         * Empty span adds whitespace at the end of a line in the grid.
         * Useful for aligning form fields or creating visual gaps.
         * 
         * @returns Number of grid cells reserved as empty space on XL screens; default is 0.
         */
        getEmptySpanXL: GetProperty<number>;

        /**
         * Sets the empty span on extra-large (XL) screens.
         * Adjust whitespace padding at the end of the line on XL devices.
         * 
         * @param newValue Number of grid cells to reserve as empty space on XL screens.
         */
        setEmptySpanXL: SetProperty<number>;

        /**
         * Gets the empty span on large (L) screens.
         * Provides trailing whitespace at the end of rows on large screens.
         * 
         * @returns Number of grid cells reserved as empty space on L screens; default is 0.
         */
        getEmptySpanL: GetProperty<number>;

        /**
         * Sets the empty span on large (L) screens.
         * Controls padding space at the end of the row for large devices.
         * 
         * @param newValue Number of grid cells to reserve as empty space on L screens.
         */
        setEmptySpanL: SetProperty<number>;

        /**
         * Gets the empty span on medium (M) screens.
         * Adds blank grid cells at the end of rows for medium-sized devices.
         * 
         * @returns Number of empty cells on M screens; default is 0.
         */
        getEmptySpanM: GetProperty<number>;

        /**
         * Sets the empty span on medium (M) screens.
         * Adjust trailing space on medium screens.
         * 
         * @param newValue Number of empty grid cells on M screens.
         */
        setEmptySpanM: SetProperty<number>;

        /**
         * Gets the empty span on small (S) screens.
         * Adds trailing whitespace at the end of rows on small devices.
         * 
         * @returns Number of empty grid cells on S screens; default is 0.
         */
        getEmptySpanS: GetProperty<number>;

        /**
         * Sets the empty span on small (S) screens.
         * Controls trailing whitespace for small screens.
         * 
         * @param newValue Number of empty grid cells on S screens.
         */
        setEmptySpanS: SetProperty<number>;

        /**
         * Gets additional layout data for the form.
         * This object may contain any custom configuration needed by the layout.
         * It can be used to provide further layout-specific metadata or options.
         * 
         * @returns The current layout data object or undefined if not set.
         */
        getLayoutData: GetProperty<LayoutData | undefined>;

        /**
         * Sets additional layout data for the form.
         * Pass custom configuration or metadata to influence the form layout behavior.
         * 
         * @param newValue The layout data object to assign.
         */
        setLayoutData: SetProperty<LayoutData>;
    }
}

export interface Settings {
    /**
     * Defines the layout type used for the form.
     * Allowed values are "ResponsiveGridLayout" or "ColumnLayout".
     * This controls the overall structure and responsiveness of the form.
     */
    layoutType?: LayoutType;

    /**
     * Number of columns to display on extra-large screens (XL).
     * Determines how many columns the form will have on very large displays.
     */
    columnsXL?: number;

    /**
     * Number of columns to display on large screens (L).
     * Controls the column count for large screen sizes.
     */
    columnsL?: number;

    /**
     * Number of columns to display on medium screens (M).
     * Adjusts the form layout for medium-sized devices like tablets.
     */
    columnsM?: number;

    /**
     * Number of grid cells occupied by the label on extra-large screens (XL).
     * Influences the width of the label portion relative to the input field.
     */
    labelSpanXL?: number;

    /**
     * Number of grid cells occupied by the label on large screens (L).
     * Defines the label width for large screen layouts.
     */
    labelSpanL?: number;

    /**
     * Number of grid cells occupied by the label on medium screens (M).
     * Sets the label width on medium device screens.
     */
    labelSpanM?: number;

    /**
     * Number of grid cells occupied by the label on small screens (S).
     * Controls label width on smaller devices such as phones.
     */
    labelSpanS?: number;

    /**
     * Number of empty grid cells added at the end of the line on extra-large screens (XL).
     * This adds spacing at the end of each row to control the layout width.
     */
    emptySpanXL?: number;

    /**
     * Number of empty grid cells added at the end of the line on large screens (L).
     * Adds spacing at the end of each row for large screen layouts.
     */
    emptySpanL?: number;

    /**
     * Number of empty grid cells added at the end of the line on medium screens (M).
     * Adds spacing at the end of each row on medium devices.
     */
    emptySpanM?: number;

    /**
     * Number of empty grid cells added at the end of the line on small screens (S).
     * Controls spacing at the end of each row on small screen devices.
     */
    emptySpanS?: number;

    /**
     * Additional layout-specific data that can be used to customize the form's appearance or behavior.
     * The structure of this object depends on the layoutType chosen.
     */
    layoutData?: LayoutData;
}

export type LayoutType = "ResponsiveGridLayout" | "ColumnLayout";