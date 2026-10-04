import { Account, AppwriteException, Client, Storage, TablesDB } from 'appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './appwrite-config';

export { DATABASE_ID, AVATAR_BUCKET_ID, TABLES } from './appwrite-config';

/**
 * Browser-side Appwrite client. Sessions are managed by the Appwrite SDK
 * (cookie on the Appwrite domain with a localStorage fallback), so this
 * single shared instance is safe to reuse across the whole app.
 */
export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);
export const storage = new Storage(client);

let hasPinged = false;

/**
 * Sends one ping to Appwrite per page load so the connection can be confirmed
 * (the result is logged, and the Appwrite console shows the ping as received).
 */
export function pingAppwriteOnce() {
    if (hasPinged || typeof window === 'undefined') return;
    hasPinged = true;

    client
        .ping()
        .then(() => console.info(`[appwrite] ping ok (${APPWRITE_ENDPOINT})`))
        .catch((error) => console.error('[appwrite] ping failed:', getErrorMessage(error)));
}

/** True when the error is an Appwrite error with the given HTTP code. */
export function isAppwriteError(error: unknown, code?: number): error is AppwriteException {
    if (!(error instanceof AppwriteException)) return false;
    return code === undefined || error.code === code;
}

/** Normalises any thrown value into a message that is safe to show in the UI. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
    if (error instanceof AppwriteException) {
        switch (error.type) {
            case 'user_invalid_credentials':
                return 'Invalid email or password.';
            case 'user_already_exists':
                return 'An account with this email already exists.';
            case 'user_password_mismatch':
                return 'The passwords do not match.';
            case 'user_session_already_exists':
                return 'You are already logged in.';
            case 'general_rate_limit_exceeded':
                return 'Too many attempts. Please wait a moment and try again.';
            case 'user_invalid_token':
                return 'This link is invalid or has expired. Please request a new one.';
            default:
                return error.message || fallback;
        }
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
}
