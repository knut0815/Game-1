export const WS_PORT = 3000;
export const HTTP_PORT = 8888;

export const CLIENT_FPS = 1e3 / 60;
export const SERVER_FPS = 1e3 / 30;

export const MAX_CONNECTIONS = 64;

export const DEV_MODE = true;

export const PUBLIC_PATH = process.cwd() + "/static/";

export const IS_SERVER = !!(typeof window === "undefined");

export const MIN_SCALE = 5;
export const MAX_SCALE = 15;