export interface IProductKeys {
    ID: string;
}

export interface IProduct extends IProductKeys {
    name: string | null;
    description: string | null;
    brand: string | null;
    price: number;
    currency: string;
    quantityInStock: number | null;
    categoryID: string;
    supplierID: string;
    isActive: boolean | null;
}

export interface ICustomerKeys {
    ID: string;
}

export interface ICustomer extends ICustomerKeys {
    name: string;
    country: string | null;
    city: string | null;
}

export interface ISupplierKeys {
    ID: string;
}

export interface ISupplier extends ISupplierKeys {
    companyName: string;
    contactName: string | null;
    contactTitle: string | null;
    country: string | null;
    city: string | null;
    paymentTerms: string | null;
}

export interface ICategoryKeys {
    ID: string;
}

export interface ICategory extends ICategoryKeys {
    name: string;
}

export interface ICountryKeys {
    code: string;
}

export interface ICountry extends ICountryKeys {
    country: string | null;
}

export interface ICurrencyKeys {
    ID: string;
}

export interface ICurrency extends ICurrencyKeys {
    description: string | null;
}

export interface IPaymentMethodKeys {
    ID: string;
}

export interface IPaymentMethod extends IPaymentMethodKeys {
    description: string | null;
}

export interface IPaymentTermKeys {
    ID: string;
}

export interface IPaymentTerm extends IPaymentTermKeys {
    description: string | null;
}