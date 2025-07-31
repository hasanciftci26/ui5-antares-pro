/* eslint-disable semi */
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/custom/CustomContent" {
    export default interface CustomContent {
        /**
         * Retrieves the SAPUI5 control defined in the **content** property.
         *
         * This control will be inserted into the dialog or component during UI generation.
         *
         * @returns The **Control** instance provided as custom content.
         */
        getContent: GetProperty<Control>;

        /**
         * Sets the SAPUI5 control to be used as custom content.
         *
         * This control will be placed into the generated dialog or component.
         * The control must be fully managed by the consumer.
         *
         * @param newValue The **Control** instance to assign as custom content.
         */
        setContent: SetProperty<Control>;

        /**
         * Retrieves the target index defined in the **index** property.
         *
         * This determines where the custom content will be inserted within the dialog or component.
         * If no index is defined, the content will be placed at the end by default.
         *
         * @returns The index position, or the default value 999.
         */
        getIndex: GetProperty<number>;

        /**
         * Sets the index position at which the custom content should be inserted.
         *
         * This value defines the position of the control inside the dialog or component content aggregation.
         * If not set, the content will be added to the end.
         *
         * @param newValue The numeric index to assign.
         */
        setIndex: SetProperty<number>;
    }
}

export interface Settings {
    /**
     * The SAPUI5 control to be inserted as custom content.
     *
     * This is the main UI element that will be placed into the generated dialog or component.
     * The control must be created and managed entirely by the consumer.
     *
     * This property is required.
     */
    content: Control;

    /**
     * The target index position within the dialog or component at which the custom content should be inserted.
     *
     * If not specified, the content is added to the end of the content aggregation.
     *
     * This property is optional.
     */
    index?: number;
};