import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUrl } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
	const { shortCode } = params;
	const result = getUrl(shortCode);

	if (!result) {
		throw redirect(302, '/'); // Redirect to home page if URL not found
	}

	// Use 301 for permanent redirect
	throw redirect(301, result.originalUrl);
};
