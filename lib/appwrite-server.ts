import { Account, Client, Storage, TablesDB, Users } from 'node-appwrite';
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from './appwrite-config';

export { DATABASE_ID, AVATAR_BUCKET_ID, TABLES, USER_OWNED_TABLES } from './appwrite-config';

/**
 * Server-only Appwrite client authenticated with the project API key.
 * Never import this from a client component: the key must stay on the server.
 */
export function createAdminClient() {
    const apiKey = process.env.APPWRITE_API_KEY;
    if (!apiKey) {
        throw new Error('APPWRITE_API_KEY is not set. Add it to .env.local (server-side only).');
    }

    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setKey(apiKey);

    return {
        client,
        users: new Users(client),
        tablesDB: new TablesDB(client),
        storage: new Storage(client),
    };
}

/**
 * Server-side client acting on behalf of a logged-in user, using a short-lived
 * JWT that the browser obtained via `account.createJWT()`.
 */
export function createUserClient(jwt: string) {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(APPWRITE_PROJECT_ID)
        .setJWT(jwt);

    return {
        client,
        account: new Account(client),
    };
}
