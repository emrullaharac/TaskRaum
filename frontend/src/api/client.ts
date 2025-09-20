import axios, { AxiosError } from "axios";

export const api = axios.create({
    baseURL: "",
    withCredentials: true,
    headers: {"Content-Type": "application/json"},
});

let isLoggingOut = false;
export function setLoggingOut(v: boolean) {
    isLoggingOut = v;
}

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];
const onRefreshed = () => { pendingQueue.forEach(r => r()); pendingQueue = []; };
const waitForRefresh = () => new Promise<void>((r) => pendingQueue.push(r));

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
        const original = error.config!;

        // If we're logging out, never refresh; go to login.
        if (isLoggingOut) {
            redirectToLogin();
            return Promise.reject(error);
        }

        if (!response || response.status !== 401) return Promise.reject(error);

        // allow /auth/me probe to fail quietly
        if (original.skipAuthRedirect) return Promise.reject(error);

        const url = original.url ?? "";
        if (url.startsWith("/auth/login") || url.startsWith("/auth/register") || url.startsWith("/auth/refresh")) {
            redirectToLogin();
            return Promise.reject(error);
        }

        if (original._retry) {
            redirectToLogin();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            await waitForRefresh();
            original._retry = true;
            return api(original);
        }

        try {
            isRefreshing = true;
            // raw axios to avoid this interceptor
            await axios.post(`/auth/refresh`, undefined, {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
                skipAuthRedirect: true,
            });
            onRefreshed();
            original._retry = true;
            return api(original);
        } catch (e) {
            redirectToLogin();
            return Promise.reject(e);
        } finally {
            isRefreshing = false;
        }
    }
);