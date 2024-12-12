import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import crypto from 'crypto';
import { saveUrl } from '$lib/db';

// In-memory storage for URLs (in production, this should be replaced with a database)
// export const urlMap = new Map<string, string>();
const baseUrl = 'http://localhost:5173'; // Change this in production

function generateShortCode(): string {
	// Generate a random 6-character string
	return crypto.randomBytes(3).toString('hex').slice(0, 6);
}

function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { url } = await request.json();

		if (!url) {
			return json({ error: 'URL is required' }, { status: 400 });
		}

		if (!isValidUrl(url)) {
			return json({ error: 'Invalid URL format' }, { status: 400 });
		}

		// Generate a unique short code
		const shortCode = generateShortCode();

		try {
			// Save to database
			saveUrl(shortCode, url);

			// Return the shortened URL
			const shortUrl = `${baseUrl}/${shortCode}`;
			return json({ shortUrl });
		} catch (dbError) {
			console.error('Database error:', dbError);
			// If there's a unique constraint violation, try again
			if (dbError.message.includes('UNIQUE constraint failed')) {
				return json({ error: 'Please try again' }, { status: 500 });
			}
			throw dbError;
		}
	} catch (error) {
		console.error('Error processing URL:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
