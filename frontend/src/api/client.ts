import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export const api = axios.create({
    baseURL: "",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

let isLoggingOut = false;
export function setLoggingOut(v: boolean) {
    isLoggingOut = v;
}

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];
const onRefreshed = () => {
    pendingQueue.forEach((r) => r());
    pendingQueue = [];
};
const waitForRefresh = () => new Promise<void>((resolve) => pendingQueue.push(resolve));

let forced = false;
const redirectToLogin = () => {
    if (!forced && window.location.pathname !== "/login") {
        forced = true;
        window.location.replace("/login");
    }
};

api.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
        const { response } = error;
        const original = (error.config || {}) as AxiosRequestConfig;

        // If we're explicitly logging out, never refresh; go to login.
        if (isLoggingOut) {
            redirectToLogin();
            return Promise.reject(error);
        }

        // Not a 401 or no response -> bubble up
        if (!response || response.status !== 401) {
            return Promise.reject(error);
        }

        const url = original.url ?? "";

        // Do not try to refresh for auth endpoints themselves or if already retried
        const isAuthPath =
            url.startsWith("/auth/login") ||
            url.startsWith("/auth/register") ||
            url.startsWith("/auth/refresh");

        if (original._retry || isAuthPath) {
            // Respect silent probes (skipAuthRedirect) to avoid sudden redirects on background calls like /auth/me
            if (!original.skipAuthRedirect) redirectToLogin();
            return Promise.reject(error);
        }

        // If a refresh is already in-flight, wait and then retry this original request once
        if (isRefreshing) {
            await waitForRefresh();
            original._retry = true;
            return api(original);
        }

        // Try to refresh once
        try {
            isRefreshing = true;

            // Use raw axios to avoid this interceptor and mark as "silent"
            await axios.post(
                `/auth/refresh`,
                undefined,
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                    // Custom flag from your axios.d.ts so a failing refresh doesn't hard-redirect by itself
                    skipAuthRedirect: true,
                } as AxiosRequestConfig
            );

            onRefreshed();
            original._retry = true;
            return api(original);
        } catch (e) {
            // Only redirect for non-silent requests
            if (!original.skipAuthRedirect) redirectToLogin();
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    }
);
