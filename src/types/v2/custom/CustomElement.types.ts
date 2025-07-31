/* eslint-disable semi */
import UI5Element from "sap/ui/core/Element";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/custom/CustomElement" {
    export default interface CustomElement {
        /**
         * Returns the name of the target property this custom element is bound to.
         *
         * @returns The name of the metadata property in the target **EntitySet**.
         */
        getPropertyName: GetProperty<string>;

        /**
         * Sets the name of the target property for which the custom element should be applied.
         *
         * @param newValue - The name of the metadata property in the target **EntitySet**.
         */
        setPropertyName: SetProperty<string>;

        /**
         * Returns the custom SAPUI5 control instance associated with this element.
         *
         * @returns The SAPUI5 control used in place of the default control.
         */
        getElement: GetProperty<UI5Element>;

        /**
         * Sets the custom SAPUI5 control to be rendered in place of the default control.
         *
         * @param newValue - A fully initialized SAPUI5 control instance.
         */
        setElement: SetProperty<UI5Element>;

        /**
         * Returns the validator function, if one has been defined.
         *
         * @returns The validator function or **undefined** if none has been set.
         */
        getValidator: GetProperty<Validator | undefined>;

        /**
         * Sets a validator function to be used for validating this custom control.
         *
         * @param newValue - A function that takes the custom control as input and returns
         *                   a boolean or a Promise<boolean> indicating validation success.
         */
        setValidator: SetProperty<Validator>;
    }
}

export interface Settings<T extends UI5Element> {
    /**
     * The name of the target property this custom element is associated with.
     *
     * This must match the name of a property in the metadata of the underlying **EntitySet**
     * provided to the Entry class. The library uses this value to determine which default control
     * should be replaced.
     */
    propertyName: string;

    /**
     * The custom SAPUI5 control to be rendered in place of the default control.
     *
     * This control (e.g., **Slider**, **ComboBox**, etc.) is inserted into the generated form UI
     * and must be fully configured and managed by the consumer.
     */
    element: UI5Element;

    /**
     * An optional custom validator function to determine whether the control’s value is valid.
     *
     * The function receives the control instance as its argument and may return either:
     * - **true** to indicate successful validation
     * - **false** to indicate a validation failure
     * - A **Promise<boolean>** for asynchronous validation
     *
     * If no validator is provided, the field will not undergo library-managed validation.
     *
     * @remarks
     * This is the only way to validate **CustomElements**, as **ValidationLogic** is not supported for them.
     */
    validator?: Validator<T>;
};

export type Validator<T extends UI5Element = UI5Element> = (element: T) => boolean | Promise<boolean>;