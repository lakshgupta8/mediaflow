/**
 * One-time provisioning for MediaFlow's Appwrite project.
 *
 * Creates the database, tables, columns, indexes and the avatars bucket.
 * Safe to re-run: anything that already exists is skipped.
 *
 *   bun run setup:appwrite
 *
 * Bun loads .env.local automatically. Required variables:
 *   NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY
 */
import {
    AppwriteException,
    Client,
    Compression,
    Permission,
    Role,
    Storage,
    TablesDB,
    TablesDBIndexType,
} from 'node-appwrite';
import {
    APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID,
    AVATAR_BUCKET_ID,
    DATABASE_ID,
    TABLES,
} from '../lib/appwrite-config';

const apiKey = process.env.APPWRITE_API_KEY;
if (!APPWRITE_PROJECT_ID || !apiKey) {
    console.error('Missing NEXT_PUBLIC_APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env.local');
    process.exit(1);
}

const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT_ID).setKey(apiKey);
const db = new TablesDB(client);
const storage = new Storage(client);

type ColumnSpec =
    | { type: 'varchar'; key: string; size: number; required: boolean }
    | { type: 'text'; key: string; required: boolean }
    | { type: 'integer'; key: string; required: boolean; min?: number; max?: number }
    | { type: 'datetime'; key: string; required: boolean }
    | { type: 'enum'; key: string; elements: string[]; required: boolean };

type IndexSpec = { key: string; type: TablesDBIndexType; columns: string[] };

interface TableSpec {
    id: string;
    name: string;
    columns: ColumnSpec[];
    indexes: IndexSpec[];
}

/** Runs an operation, treating "already exists" (409) as success. */
async function ensure(label: string, fn: () => Promise<unknown>) {
    try {
        await fn();
        console.log(`  created  ${label}`);
    } catch (error) {
        if (error instanceof AppwriteException && error.code === 409) {
            console.log(`  exists   ${label}`);
            return;
        }
        throw error;
    }
}

const mediaColumns: ColumnSpec[] = [
    { type: 'varchar', key: 'user_id', size: 36, required: true },
    { type: 'integer', key: 'media_id', required: true, min: 0 },
    { type: 'enum', key: 'media_type', elements: ['movie', 'tv'], required: true },
];

const userMediaIndexes: IndexSpec[] = [
    { key: 'user_media_unique', type: TablesDBIndexType.Unique, columns: ['user_id', 'media_id', 'media_type'] },
    { key: 'user_idx', type: TablesDBIndexType.Key, columns: ['user_id'] },
];

const tables: TableSpec[] = [
    {
        id: TABLES.profiles,
        name: 'Profiles',
        columns: [
            { type: 'varchar', key: 'full_name', size: 128, required: true },
            { type: 'text', key: 'avatar_url', required: false },
        ],
        indexes: [],
    },
    {
        id: TABLES.watchlists,
        name: 'Watchlists',
        columns: mediaColumns,
        indexes: userMediaIndexes,
    },
    {
        id: TABLES.favorites,
        name: 'Favorites',
        columns: mediaColumns,
        indexes: userMediaIndexes,
    },
    {
        id: TABLES.recentWatches,
        name: 'Recent Watches',
        columns: [
            ...mediaColumns,
            { type: 'datetime', key: 'last_watched_at', required: true },
        ],
        indexes: [
            ...userMediaIndexes,
            { key: 'user_last_watched_idx', type: TablesDBIndexType.Key, columns: ['user_id', 'last_watched_at'] },
        ],
    },
    {
        id: TABLES.reviews,
        name: 'Reviews',
        columns: [
            ...mediaColumns,
            { type: 'text', key: 'content', required: true },
            { type: 'varchar', key: 'parent_id', size: 36, required: false },
        ],
        indexes: [
            { key: 'media_idx', type: TablesDBIndexType.Key, columns: ['media_id', 'media_type'] },
            { key: 'user_idx', type: TablesDBIndexType.Key, columns: ['user_id'] },
        ],
    },
];

function createColumn(tableId: string, column: ColumnSpec) {
    const base = { databaseId: DATABASE_ID, tableId, key: column.key, required: column.required };
    switch (column.type) {
        case 'varchar':
            return db.createVarcharColumn({ ...base, size: column.size });
        case 'text':
            return db.createTextColumn(base);
        case 'integer':
            return db.createIntegerColumn({ ...base, min: column.min, max: column.max });
        case 'datetime':
            return db.createDatetimeColumn(base);
        case 'enum':
            return db.createEnumColumn({ ...base, elements: column.elements });
    }
}

/** Columns are built asynchronously; indexes can only be created once they are available. */
async function waitForColumns(tableId: string) {
    for (let attempt = 0; attempt < 60; attempt++) {
        const { columns } = await db.listColumns({ databaseId: DATABASE_ID, tableId });
        const failed = columns.filter((c) => c.status === 'failed' || c.status === 'stuck');
        if (failed.length) {
            throw new Error(`Columns failed on ${tableId}: ${failed.map((c) => c.key).join(', ')}`);
        }
        if (columns.every((c) => c.status === 'available')) return;
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    throw new Error(`Timed out waiting for columns on ${tableId}`);
}

async function main() {
    console.log(`Appwrite project ${APPWRITE_PROJECT_ID} @ ${APPWRITE_ENDPOINT}\n`);

    console.log('Database');
    await ensure(DATABASE_ID, () => db.create({ databaseId: DATABASE_ID, name: 'MediaFlow' }));

    for (const table of tables) {
        console.log(`\nTable ${table.id}`);

        // Row security on: each row carries its own read/update/delete permissions,
        // and any logged-in user may create rows.
        await ensure('table', () =>
            db.createTable({
                databaseId: DATABASE_ID,
                tableId: table.id,
                name: table.name,
                permissions: [Permission.create(Role.users())],
                rowSecurity: true,
            })
        );

        for (const column of table.columns) {
            await ensure(`column ${column.key}`, () => createColumn(table.id, column));
        }

        await waitForColumns(table.id);

        for (const index of table.indexes) {
            await ensure(`index ${index.key}`, () =>
                db.createIndex({
                    databaseId: DATABASE_ID,
                    tableId: table.id,
                    key: index.key,
                    type: index.type,
                    columns: index.columns,
                })
            );
        }
    }

    console.log('\nStorage');
    await ensure(`bucket ${AVATAR_BUCKET_ID}`, () =>
        storage.createBucket({
            bucketId: AVATAR_BUCKET_ID,
            name: 'Avatars',
            permissions: [Permission.create(Role.users())],
            fileSecurity: true,
            enabled: true,
            maximumFileSize: 2 * 1024 * 1024,
            allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
            compression: Compression.None,
        })
    );

    console.log('\nDone.');
}

main().catch((error) => {
    console.error('\nSetup failed:', error instanceof Error ? error.message : error);
    process.exit(1);
});
