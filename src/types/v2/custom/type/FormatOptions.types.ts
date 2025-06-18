export interface NumberFormatOptions {
    groupingEnabled?: boolean;
    groupingSeparator?: string;
    groupingSize?: number;
    decimalSeparator?: string;
    parseEmptyValueToZero?: boolean
}

export interface DateTimeFormatOptions {
    pattern: string;
}