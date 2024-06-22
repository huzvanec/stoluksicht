export const env = import.meta.env;
export const apiBaseUrl: string = env.VITE_API_BASE_URL;
export const headHash: string | undefined = env.VITE_HEAD_HASH;
export const buildTime: string | undefined = env.VITE_BUILD_TIME;