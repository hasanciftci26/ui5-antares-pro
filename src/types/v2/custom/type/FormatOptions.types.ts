export interface INumberFormatOptions {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean
}

export interface IDateTimeFormatOptions {
    pattern: string;
}