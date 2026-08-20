import { Platform } from 'react-native';

/**
 * Backend base URL.
 *
 * - Android emulator can't reach your machine's `localhost` — it must use
 *   the special alias `10.0.2.2`.
 * - iOS simulator can reach `localhost` directly.
 * - A physical device needs your machine's LAN IP (e.g. 192.168.x.x).
 *
 * Override at build time by editing DEV_API_URL below, or point PROD_API_URL
 * at your deployed backend before making a release build.
 */
const DEV_PORT = 5000;

const DEV_API_URL = Platform.select({
  android: `http://192.168.1.9:${DEV_PORT}`,
  ios: `http://localhost:${DEV_PORT}`,
  default: `http://localhost:${DEV_PORT}`,
});

const PROD_API_URL = 'https://api.yourfinsight.com';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const API_TIMEOUT_MS = 15000;
