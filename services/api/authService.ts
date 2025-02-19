import api from "../api";
import axios from "axios";
import { Warehouseman } from "~/types/types";

const WAREHOUSEMAN_URL = `${process.env.EXPO_PUBLIC_API_URL}/warehousemans`;

export const getUserBySecretKey = async (secret: string): Promise<Warehouseman> => {
    try {
        console.log(secret);
        const response = await axios.get(`${WAREHOUSEMAN_URL}?secretKey=${secret}`);
        console.log(response.data);
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
