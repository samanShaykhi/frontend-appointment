import axios from "axios";
import { baseUrl } from "../url";

export const axiosConfig = axios.create({
    baseURL: baseUrl,
    withCredentials: true
})

axiosConfig.interceptors.response.use(
    res => res,
    error => {
        // Network error (سرور خاموش، timeout و غیره)
        if (!error.response) {
            return Promise.reject({
                type: 'NETWORK_ERROR',
                original: error,
            });
        }

        const { status, data } = error.response;

        // Error Validation Input

        if (status === 301) {
            return Promise.reject({
                type: 'VALIDATION_ERROR_INPUT',
                status,
                data,
            });
        }

        // Error Validation Input

        if (status >= 500) {
            return Promise.reject({
                type: 'SERVER_ERROR',
                status,
                data,
            });
        }

        // سایر ارورها (400, 404 و غیره)
        return Promise.reject({
            type: 'API_ERROR',
            status,
            data,
        });
    }
);