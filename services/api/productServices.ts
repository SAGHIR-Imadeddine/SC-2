import api from "../api";
import { Product } from "~/types/types";

const PRODUCTS_URL = "/products";

export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const response = await api.get(PRODUCTS_URL);      
        if (!response.data || !response.data.length) {
            throw new Error("No products found");
        }
        return response.data;
        
    } catch (error: any) {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }
        throw new Error("Server error. Please try again later");
    }
}

export const getProductById = async (id: number): Promise<Product> => {
    try {

        const response = await api.get(`${PRODUCTS_URL}?id=${id}`);
        if (!response.data || !response.data.length) {
            throw new Error("Product not found");
        }
        return response.data[0];

    } catch (error: any) {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }
        throw new Error("Server error. Please try again later");
    }
}

export const createProduct = async (product: Product): Promise<Product> => {
    try {
        const response = await api.post(PRODUCTS_URL, product);
        return response.data;
    } catch (error: any) {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }
        throw new Error("Server error. Please try again later");
    }
}

export const getProductByBarcode = async (barcode: string): Promise<Product> => {
    try {
        const response = await api.get(`${PRODUCTS_URL}?barcode=${barcode}`);
        return response.data[0];
    } catch (error: any) {
        throw new Error("Server error. Please try again later");
    }
}

export const updateProductStock = async (product: Product): Promise<Product> => {
    try {
        const response = await api.put(`${PRODUCTS_URL}/${product.id}`, product);
        if (!response.data) {
            throw new Error("No data received from server");
        }
        return response.data;
    } catch (error: any) {
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }
        // Get the specific error message if available
        const errorMessage = error.response?.data?.message || error.message || "Failed to update product stock";
        throw new Error(errorMessage);
    }
}   
