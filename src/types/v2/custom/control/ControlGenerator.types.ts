/* eslint-disable semi */
import { GetProperty, SetProperty } from "ui5/antares/pro/types/Global.types";
import { DateTimeSettings, NumberSettings } from "ui5/antares/pro/types/v2/ui/Factory.types";

declare module "ui5/antares/pro/v2/custom/control/ControlGenerator" {
    export default interface ControlGenerator {
        getGenerateFor: GetProperty<GenerateFor>;
        setGenerateFor: SetProperty<GenerateFor>;
        getRequiredPropertyError: GetProperty<string | undefined>;
        setRequiredPropertyError: SetProperty<string | undefined>;
        getDateTimeSettings: GetProperty<DateTimeSettings | undefined>;
        setDateTimeSettings: SetProperty<DateTimeSettings | undefined>;
        getNumberSettings: GetProperty<NumberSettings | undefined>;
        setNumberSettings: SetProperty<NumberSettings | undefined>;
        getDateRangeOptions: GetProperty<string[] | undefined>;
        setDateRangeOptions: SetProperty<string[] | undefined>;
    }
}

export type Settings = {
    generateFor: "SimpleForm";
    requiredPropertyError: string;
    dateTimeSettings?: DateTimeSettings;
    numberSettings?: NumberSettings;
    dateRangeOptions?: string[];
} | {
    generateFor: "SmartForm" | "Table" | "Filterbar";
    dateTimeSettings?: DateTimeSettings;
    numberSettings?: NumberSettings;
    dateRangeOptions?: string[];
};

export type GenerateFor = "SimpleForm" | "SmartForm" | "Table" | "Filterbar";

export interface StandardBinding {
    path: string;
    type: string;
    constraints?: Record<string, any>;
    formatOptions?: Record<string, any>;
}