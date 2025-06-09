import BaseObject from "sap/ui/base/Object";
import { HourString, MinuteSecondString } from "ui5/antares/pro/types/v2/validation/TimeValidation.types";

/**
 * @namespace ui5.antares.pro.v2.validation
 */
export default class TimeValidation extends BaseObject {
    private hours: HourString;
    private minutes: MinuteSecondString;
    private seconds: MinuteSecondString;

    constructor(hours: HourString, minutes: MinuteSecondString, seconds: MinuteSecondString) {
        super();
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    public getMilliseconds() {
        const hours = parseInt(this.hours, 10);
        const minutes = parseInt(this.minutes, 10);
        const seconds = parseInt(this.seconds, 10);

        return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    }
}