import BaseObject from "sap/ui/base/Object";
import { HourString, MinuteSecondString } from "ui5/antares/pro/types/v2/validation/TimeValidation.types";

/**
 * Utility class used for validation scenarios involving **Edm.Time** properties.
 *
 * The **ValidationLogic** mechanism supports various OData types. However, **Edm.Time** requires special handling
 * because its values are internally represented as time-of-day objects rather than simple strings or numbers.
 *
 * This class enables consumers to define time values in the format of hours, minutes, and seconds,
 * and internally converts them into milliseconds for accurate comparison in validation logic.
 *
 * To define **value1** or **value2** in a **ValidationLogic** condition for a property of type **Edm.Time**,
 * an instance of this class must be created and passed instead of a raw string or number.
 *
 * @example
 * ```ts
 * new TimeValidation("08", "30", "00"); // Represents 08:30:00
 * ```
 * 
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

    /**
     * Converts the stored time values (hours, minutes, and seconds) into milliseconds.
     *
     * This method is used internally by the validation engine to compare time values
     * when performing checks on **Edm.Time** properties. The result is a numeric representation
     * of the time of day, which can be used in logical operations such as greater than, less than, etc.
     *
     * @returns The time expressed in milliseconds.
     */
    public getMilliseconds() {
        const hours = parseInt(this.hours, 10);
        const minutes = parseInt(this.minutes, 10);
        const seconds = parseInt(this.seconds, 10);

        return (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    }
}