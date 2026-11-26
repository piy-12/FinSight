import { Platform } from 'react-native';

const DEV_PORT = 5000;
const AI_DEV_PORT = 8000;

const DEV_API_URL = Platform.select({
  android: `http://localhost:${DEV_PORT}`,
  ios: `http://localhost:${DEV_PORT}`,
  default: `http://localhost:${DEV_PORT}`,
});

const DEV_AI_API_URL = Platform.select({
  android: `http://localhost:${AI_DEV_PORT}`,
  ios: `http://localhost:${AI_DEV_PORT}`,
  default: `http://localhost:${AI_DEV_PORT}`,
});

const PROD_API_URL = 'https://api.yourfinsight.com';
const PROD_AI_API_URL = 'https://ai.yourfinsight.com';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;
export const AI_API_BASE_URL = __DEV__ ? DEV_AI_API_URL : PROD_AI_API_URL;

export const API_TIMEOUT_MS = 15000;
export const AI_TIMEOUT_MS = 60000;