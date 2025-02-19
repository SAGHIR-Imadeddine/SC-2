export interface Warehouseman {
    id: number;
    name: string;
    dob: string;
    city: string;
    secretKey?: string;
    warehouseId: number;
}

export interface AuthState  {
    isAuthenticated: boolean;
    loading: boolean;
    user: Warehouseman | null;
    error: string | null;
};

export interface Localisation {
    city: string;
    latitude: number;
    longitude: number;
}

export interface WarehouseStock {
    id: number;
    name: string;
    quantity: number;
    localisation: Localisation;
}         

export interface EditedBy {
    warehousemanId: number;
    at: string;
}       

export interface Product {
    id: number;
    name: string;
    type: string;
    barcode: string;
    price: number;
    solde: number;
    supplier: string;
    image: string;
    stocks: WarehouseStock[];
    editedBy: EditedBy[];
    totalQuantity?: number;
}

export interface ProductState {
    products: Product[];
    product: Product | null;
    loading: boolean;
    error: string | null;
}