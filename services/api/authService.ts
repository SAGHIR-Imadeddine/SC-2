import api from "../api";
import { Warehouseman } from "~/types/types";

export const getUserBySecretKey = async (secret: string): Promise<Warehouseman> => {
    try {
        const response = await api.get(`warehousemans?secretKey=${secret}`);
        
        if (!response.data || !response.data.length) {
            throw new Error("Invalid credentials");
        }
        
        const {secretKey, ...user} = response.data[0];
        return user;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new Error("Invalid credentials");
        }
        if (!navigator.onLine) {
            throw new Error("No internet connection");
        }
        throw new Error("Server error. Please try again later");
    }
}
