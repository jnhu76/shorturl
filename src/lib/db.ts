import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

let db: Database.Database;
let insertUrl: Database.Statement;
let getUrlByCode: Database.Statement;
let incrementAccessCount: Database.Statement;

export async function initializeDb(dbPath: string = DATABASE_URL) {
    // Ensure database directory exists
    await mkdir(dirname(dbPath), { recursive: true });

    // Close existing connection if any
    if (db) {
        db.close();
    }

    // Initialize database
    db = new Database(dbPath);

    // Create tables if they don't exist
    db.exec(`
        CREATE TABLE IF NOT EXISTS urls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            short_code TEXT UNIQUE NOT NULL,
            original_url TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            access_count INTEGER DEFAULT 0
        );
        CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
    `);

    // Prepare statements for better performance
    insertUrl = db.prepare(`
        INSERT INTO urls (short_code, original_url)
        VALUES (?, ?)
    `);

    getUrlByCode = db.prepare(`
        SELECT original_url, access_count
        FROM urls
        WHERE short_code = ?
    `);

    incrementAccessCount = db.prepare(`
        UPDATE urls
        SET access_count = access_count + 1
        WHERE short_code = ?
    `);
}

export function closeDb() {
    if (db) {
        db.close();
    }
}

export function saveUrl(shortCode: string, originalUrl: string): void {
    if (!db || !insertUrl) {
        throw new Error('Database not initialized');
    }
    insertUrl.run(shortCode, originalUrl);
}

export function getUrl(shortCode: string): { originalUrl: string; accessCount: number } | null {
    if (!db || !getUrlByCode || !incrementAccessCount) {
        throw new Error('Database not initialized');
    }
    const result = getUrlByCode.get(shortCode);
    if (!result) return null;

    // Increment access count asynchronously
    incrementAccessCount.run(shortCode);

    return {
        originalUrl: result.original_url,
        accessCount: result.access_count
    };
}

// Initialize database on module load
initializeDb().catch(console.error);
