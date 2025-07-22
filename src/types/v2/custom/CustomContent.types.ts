/* eslint-disable semi */
import Control from "sap/ui/core/Control";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/custom/CustomContent" {
    export default interface CustomContent {
        getContent: GetProperty<Control>;
        setContent: SetProperty<Control>;
        getIndex: GetProperty<number>;
        setIndex: SetProperty<number>;
    }
}

export interface Settings {
    content: Control;
    index?: number;
};