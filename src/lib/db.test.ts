import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { saveUrl, getUrl, initializeDb, closeDb } from './db';
import { mkdir, rm } from 'fs/promises';
import { dirname } from 'path';

const TEST_DB_PATH = './data/test.sqlite';

describe('URL Database', () => {
    beforeAll(async () => {
        // Create test database directory
        await mkdir(dirname(TEST_DB_PATH), { recursive: true });
    });

    beforeEach(async () => {
        // Initialize fresh database for each test
        await initializeDb(TEST_DB_PATH);
    });

    afterEach(() => {
        // Close database after each test
        closeDb();
    });

    afterAll(async () => {
        // Clean up test database file
        await rm(TEST_DB_PATH, { force: true });
    });

    it('should save a URL successfully', async () => {
        const shortCode = 'test123';
        const originalUrl = 'https://example.com';

        saveUrl(shortCode, originalUrl);
        const result = getUrl(shortCode);
        
        expect(result).toBeTruthy();
        expect(result?.originalUrl).toBe(originalUrl);
        expect(result?.accessCount).toBe(0);
    });

    it('should retrieve a saved URL', async () => {
        const shortCode = 'abc123';
        const originalUrl = 'https://test.com';

        saveUrl(shortCode, originalUrl);
        const result = getUrl(shortCode);

        expect(result).toBeTruthy();
        expect(result?.originalUrl).toBe(originalUrl);
        expect(result?.accessCount).toBe(0);
    });

    it('should increment access count when retrieving URL', async () => {
        const shortCode = 'count123';
        const originalUrl = 'https://counter.com';

        saveUrl(shortCode, originalUrl);
        
        // First access
        let result = getUrl(shortCode);
        expect(result?.accessCount).toBe(0);

        // Second access
        result = getUrl(shortCode);
        expect(result?.accessCount).toBe(1);
    });

    it('should return null for non-existent short code', async () => {
        const result = getUrl('nonexistent');
        expect(result).toBeNull();
    });

    it('should throw error for duplicate short code', async () => {
        const shortCode = 'duplicate';
        const url1 = 'https://first.com';
        const url2 = 'https://second.com';

        saveUrl(shortCode, url1);
        expect(() => saveUrl(shortCode, url2)).toThrow();
    });

    it('should handle special characters in URLs', async () => {
        const shortCode = 'special';
        const originalUrl = 'https://example.com/path?param=value&special=!@#$%^&*()';

        saveUrl(shortCode, originalUrl);
        const result = getUrl(shortCode);

        expect(result?.originalUrl).toBe(originalUrl);
    });
});