/* eslint-disable semi */
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/custom/CustomCell" {
    export default interface CustomCell {
        getPropertyName: GetProperty<string>;
        setPropertyName: SetProperty<string>;
        getCell: GetProperty<Control>;
        setCell: SetProperty<Control>;
    }
}

export interface Settings {
    propertyName: string;
    cell: Control;
};