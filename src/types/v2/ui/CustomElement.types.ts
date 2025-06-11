/* eslint-disable semi */
import UI5Element from "sap/ui/core/Element";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/CustomElement" {
    export default interface CustomElement {
        getPropertyName: GetProperty<string>;
        setPropertyName: SetProperty<string>;
        getElement: GetProperty<UI5Element>;
        setElement: SetProperty<UI5Element>;
        getValidator: GetProperty<Validator | undefined>;
        setValidator: SetProperty<Validator>;
    }
}

export interface ISettings<T extends UI5Element> {
    propertyName: string;
    element: UI5Element;
    validator?: Validator<T>;
};

export type Validator<T extends UI5Element = UI5Element> = (element: T) => boolean | Promise<boolean>;