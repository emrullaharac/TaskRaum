import "axios";

declare module "axios" {
    interface AxiosRequestConfig {
        _retry?: boolean;
        skipAuthRedirect?: boolean;
    }
}