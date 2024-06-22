import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useContext,
    useLayoutEffect,
    useState
} from 'react';
import axios, {AxiosError, AxiosInstance, AxiosResponse} from 'axios';
import useStolu from './StoluProvider';
import {VariantType} from 'notistack';
import {useTranslation} from 'react-i18next';
import {apiBaseUrl} from './process.ts';

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

export interface ApiResponse {
    response?: Response,
    state: ApiState
}

export type ApiProcess = (api: AxiosInstance) => Promise<AxiosResponse>;
export type ApiCallFunction = (process: ApiProcess) => Promise<ApiResponse>;

interface ApiContextType {
    apiCall: ApiCallFunction;
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
    authenticated: boolean;
}

export const ApiContext = createContext<ApiContextType>(null!);

const useApi = () => useContext(ApiContext);
export default useApi;

export type ApiProviderProps = PropsWithChildren

const api: AxiosInstance = axios.create({
    baseURL: apiBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export type ApiState = 'success' | 'error' | 'processing';

export const ApiProvider: React.FC<ApiProviderProps> = ({children}) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem(tokenStorageKey));
    const {snack} = useStolu();
    const [t, i18n] = useTranslation();

    const errorSnack = (error: string, type: VariantType = 'error') => {
        if (!i18n.exists(error)) {
            snack(t('OTHER', {type: error}), type);
            return;
        }
        snack(t(error), type);
    };

    const setAxiosToken = () => {
        api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : undefined;
    };

    const reloadToken = async () => {
        console.debug('Authentication...');
        if (!token) {
            console.debug('Token not present.');
            localStorage.removeItem(tokenStorageKey);
            setAxiosToken();
            return;
        }
        localStorage.setItem(tokenStorageKey, token);
        setAxiosToken();
        const response = await apiCall(api => api.get('/test-auth'));
        if (response.state === 'error') {
            console.debug('Token invalid, removing...');
            setToken(null); // 1-deep recursion (calls useLayoutEffect)
            return;
        }
        console.debug('Token valid.');
    };

    useLayoutEffect(() => { // calls before render to prevent calling the api without token
        reloadToken();
    }, [token]);

    const apiCall: ApiCallFunction = async (process: ApiProcess) => {
        try {
            const response: AxiosResponse = await process(api);
            const data: AnyData = response.data;
            return {
                state: 'success',
                response: {
                    timestamp: new Date(data.timestamp),
                    success: data.success,
                    endpoint: data.endpoint,
                    content: data.content ?? {}
                }
            };
        } catch (e_) {
            const error: AxiosError = e_ as AxiosError;
            console.debug(error);
            if (!error.response) {
                errorSnack('CONNECTION');
                return {
                    state: 'error'
                };
            }
            const data: AnyData = error.response.data as AnyData;
            if (data.error.type === 'AUTHENTICATION_INVALID') {
                setToken(null);
            }
            errorSnack(data.error.type);
            return {
                state: 'error',
                response: {
                    timestamp: new Date(data.timestamp),
                    success: data.success,
                    endpoint: data.endpoint,
                    error: data.error
                }
            };
        }
    };

    const value: ApiContextType = {
        apiCall,
        token,
        setToken,
        authenticated: !!token
    };

    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
};