/* eslint-disable semi */
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/CustomElement" {
    export default interface CustomElement {
        getPropertyName: GetProperty<string>;
        setPropertyName: SetProperty<string>;
        getElement: GetProperty<Control>;
        setElement: SetProperty<Control>;
        getValidator: GetProperty<Validator | undefined>;
        setValidator: SetProperty<Validator>;
    }
}

export interface ISettings {
    propertyName: string;
    element: Control;
    validator?: Validator;
};

export type Validator = (element: Control) => boolean | Promise<boolean>;