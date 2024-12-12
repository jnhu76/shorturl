import { test, expect } from '@playwright/test';

test.describe('URL Shortener', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5173');
    });

    test('should display the homepage correctly', async ({ page }) => {
        // Check main elements
        await expect(page.getByRole('heading', { name: 'URL短链接生成器' })).toBeVisible();
        await expect(page.getByPlaceholder('请输入要缩短的URL')).toBeVisible();
        await expect(page.getByRole('button', { name: '生成短链接' })).toBeVisible();
    });

    test('should create a short URL successfully', async ({ page }) => {
        const longUrl = 'https://example.com/very/long/url/that/needs/shortening';
        
        // Input the long URL
        await page.getByPlaceholder('请输入要缩短的URL').fill(longUrl);
        await page.getByRole('button', { name: '生成短链接' }).click();

        // Wait for the result
        const shortUrlElement = await page.waitForSelector('.short-url');
        const shortUrl = await shortUrlElement.textContent();
        
        // Verify short URL format
        expect(shortUrl).toMatch(/^http:\/\/localhost:5173\/[a-zA-Z0-9]{6}$/);

        // Click copy button and verify it's working
        await page.getByRole('button', { name: '复制' }).click();
        await expect(page.getByText('已复制到剪贴板')).toBeVisible();
    });

    test('should handle invalid URLs', async ({ page }) => {
        // Test with invalid URL
        await page.getByPlaceholder('请输入要缩短的URL').fill('not-a-valid-url');
        await page.getByRole('button', { name: '生成短链接' }).click();

        // Verify error message
        await expect(page.getByText('Invalid URL format')).toBeVisible();
    });

    test('should handle empty input', async ({ page }) => {
        // Click generate without entering URL
        await page.getByRole('button', { name: '生成短链接' }).click();

        // Verify error message
        await expect(page.getByText('请输入URL')).toBeVisible();
    });

    test('should redirect short URLs correctly', async ({ page, context }) => {
        // First create a short URL
        const longUrl = 'https://example.com';
        await page.getByPlaceholder('请输入要缩短的URL').fill(longUrl);
        await page.getByRole('button', { name: '生成短链接' }).click();

        // Get the generated short URL
        const shortUrlElement = await page.waitForSelector('.short-url');
        const shortUrl = await shortUrlElement.textContent();
        expect(shortUrl).toBeTruthy();

        // Open the short URL in a new page
        const newPage = await context.newPage();
        await newPage.goto(shortUrl!);

        // Verify we're redirected to the original URL
        expect(newPage.url()).toBe(longUrl);
    });

    test('should handle multiple URL shortenings', async ({ page }) => {
        const urls = [
            'https://example.com/1',
            'https://example.com/2',
            'https://example.com/3'
        ];

        for (const url of urls) {
            // Clear input and enter new URL
            await page.getByPlaceholder('请输入要缩短的URL').fill(url);
            await page.getByRole('button', { name: '生成短链接' }).click();

            // Verify short URL is generated
            const shortUrlElement = await page.waitForSelector('.short-url');
            const shortUrl = await shortUrlElement.textContent();
            expect(shortUrl).toMatch(/^http:\/\/localhost:5173\/[a-zA-Z0-9]{6}$/);
        }
    });

    test('should handle special characters in URLs', async ({ page }) => {
        const longUrl = 'https://example.com/path?param=value&special=!@#$%^&*()';
        
        // Input URL with special characters
        await page.getByPlaceholder('请输入要缩短的URL').fill(longUrl);
        await page.getByRole('button', { name: '生成短链接' }).click();

        // Verify short URL is generated
        const shortUrlElement = await page.waitForSelector('.short-url');
        const shortUrl = await shortUrlElement.textContent();
        expect(shortUrl).toMatch(/^http:\/\/localhost:5173\/[a-zA-Z0-9]{6}$/);

        // Verify redirection works
        const response = await page.request.get(shortUrl!);
        expect(response.status()).toBe(301);
        expect(response.headers()['location']).toBe(longUrl);
    });
});