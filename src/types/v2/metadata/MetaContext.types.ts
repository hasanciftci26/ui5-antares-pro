export interface NavigationInfo {
    entitySet: string;
    multiplicity: Multiplicity;
}

export type Multiplicity = "One" | "Many";