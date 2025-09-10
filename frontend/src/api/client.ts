import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const API_BASE = import.meta.env.DEV ? "/api" : "";

/** Single axios instance for the whole app */
export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // send/receive HttpOnly cookies
    headers: { "Content-Type": "application/json" },
});

/** Mark config as retried once to avoid infinite loops */
type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

/** Avoid parallel refresh storms */
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

function onRefreshed() {
    pendingQueue.forEach((resolve) => resolve());
    pendingQueue = [];
}

function redirectToLogin() {
    // keep it simple; works anywhere (no hooks)
    window.location.replace("/login");
}

/** RESPONSE INTERCEPTOR */
api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const { config, response } = error;
        const original = config as RetriableConfig;

        // If no response or not 401 → just reject
        if (!response || response.status !== 401) {
            return Promise.reject(error);
        }

        // Do not try to refresh on auth endpoints themselves
        const url = original?.url ?? "";
        if (url?.startsWith("/auth/login") || url?.startsWith("/auth/register") || url?.startsWith("/auth/refresh")) {
            redirectToLogin();
            return Promise.reject(error);
        }

        // Already retried once → give up
        if (original?._retry) {
            redirectToLogin();
            return Promise.reject(error);
        }

        // Queue the retry until refresh completes
        if (isRefreshing) {
            await new Promise<void>((resolve) => pendingQueue.push(resolve));
            original._retry = true;
            return api(original); // retry after someone else refreshed
        }

        // Perform refresh
        try {
            isRefreshing = true;
            await api.post("/auth/refresh"); // sets new cookies
            onRefreshed();
            original._retry = true;
            return api(original); // retry original call
        } catch (e) {
            redirectToLogin();
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    }
);