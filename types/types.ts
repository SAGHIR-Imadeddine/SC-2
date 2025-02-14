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
