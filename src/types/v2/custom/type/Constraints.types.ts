export interface NumberConstraints {
    precision?: number;
    scale?: number;
    nullable?: string | boolean    
}

export interface DateTimeConstraints {
    displayFormat: "Date";
}