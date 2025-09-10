import axios from "axios";

export const API_BASE = import.meta.env.DEV ? "/api" : "";
export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});