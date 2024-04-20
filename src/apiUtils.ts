import {AxiosError, AxiosResponse} from 'axios';
import {VariantType} from 'notistack';

export interface Response {
    timestamp: Date;
    success: boolean;
    endpoint: string;
    content: { [key: string]: any };
}

export interface ErrorResponse {
    timestamp: Date;
    success: boolean;
    endpoint: string;
    error: {
        http: string;
        httpCode: number;
        type: string;
        message: string;
    };
}

export const api_base_url: string = 'http://localhost:8080';

const api = async (process: (base: string) => Promise<AxiosResponse>, apiSnack: (message: string) => void): Promise<Response | ErrorResponse | null> => {
    try {
        const response = await process(api_base_url);
        const data: any = response.data;
        return {
            timestamp: new Date(data.timestamp),
            success: data.success,
            endpoint: data.endpoint,
            content: data.content
        };
    } catch (error) {
        const e: AxiosError = error as AxiosError;
        console.error(e);
        if (!e.response) {
            apiSnack('CONNECTION');
            return null;
        }
        const data: any = e.response.data as any;
        apiSnack(data.error.type);
        return {
            timestamp: new Date(data.timestamp),
            success: data.success,
            endpoint: data.endpoint,
            error: data.error
        };
    }
};
export default api;