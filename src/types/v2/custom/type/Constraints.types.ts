export interface INumberConstraints {
    precision?: number;
    scale?: number;
    nullable?: string | boolean
}

export interface IDateTimeConstraints {
    displayFormat: "Date";
}