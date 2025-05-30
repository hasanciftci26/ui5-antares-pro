/* eslint-disable semi */
import SmartForm from "sap/ui/comp/smartform/SmartForm";
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";

declare module "ui5/antares/pro/v2/ui/SmartFormGenerator" {
    export default interface SmartFormGenerator {
        getEntitySet: GetProperty<string>;
        setEntitySet: SetProperty<string>;        
        getForm: GetProperty<SmartForm>;
        setForm: SetProperty<SmartForm>;
    }
}

export interface ISettings {
    entitySet: string;
}