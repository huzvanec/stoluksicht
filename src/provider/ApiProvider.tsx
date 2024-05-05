import React, {createContext, PropsWithChildren, useContext, useEffect, useState} from 'react';
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import {Setter} from './StoluProvider';

export const apiBaseUrl: string = process.env.REACT_APP_BASE_URL as string;
export const tokenStorageKey: string = 'token';

export interface AnyData {
    [key: string]: any;
}

export interface Response extends AnyData {
    timestamp: Date;
    success: boolean;
    endpoint: string;
}

export interface SuccessResponse extends Response {
    success: true;
    content: AnyData;
}

export interface ErrorResponse extends Response {
    success: false;
    error: {
        http: string;
        httpCode: number;
        type: string;
        message: string;
    };
}

export type ApiProcess = (api: AxiosInstance) => Promise<AxiosResponse>;
export type ApiCallFunction = (process: ApiProcess) => Promise<Response | null>;

interface ApiContextType {
    apiCall: ApiCallFunction;
    token: string | null;
    setToken: Setter<string | null>;
}

export const ApiContext = createContext<ApiContextType>({
    apiCall: () => Promise.resolve(null),
    token: null,
    setToken: () => {
    }
});

const useApi = () => useContext(ApiContext);
export default useApi;

export type ApiProviderProps = PropsWithChildren & {}

const api = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const ApiProvider: React.FC<ApiProviderProps> = ({children}) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem(tokenStorageKey));

    const setAxiosToken = () => {
        api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
    };

    const reloadToken = async () => {
        console.debug('Authentication...');
        if (!token) {
            localStorage.removeItem(tokenStorageKey);
            setAxiosToken();
            console.debug('Token not present.');
            return;
        }
        localStorage.setItem(tokenStorageKey, token);
        setAxiosToken();
        const response = await apiCall(api => api.get('/test-auth'));
        if (!response || !response.success) {
            console.debug('Token invalid, removing...');
            setToken(null); // 1-deep recursion (calls useEffect)
            return;
        }
        console.debug('Token valid.');
    };

    useEffect(() => {
        reloadToken();
    }, [token]);

    const apiCall: ApiCallFunction = async (process: ApiProcess) => {
        try {
            const response: AxiosResponse = await process(api);
            const data: AnyData = response.data;
            return {
                timestamp: new Date(data.timestamp),
                success: data.success,
                endpoint: data.endpoint,
                content: data.content ?? {}
            };
        } catch (e_) {
            const error: AxiosError = e_ as AxiosError;
            console.debug(error);
            if (!error.response) return null;
            const data: AnyData = error.response.data as AnyData;
            if (data.error.type === 'AUTHENTICATION_INVALID') {
                setToken(null);
            }
            return {
                timestamp: new Date(data.timestamp),
                success: data.success,
                endpoint: data.endpoint,
                error: data.error
            };
        }
    };

    const value: ApiContextType = {apiCall, token, setToken};
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
};