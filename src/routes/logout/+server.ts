import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { deleteSessionTokenCookie } from '@/server/auth';

export const POST: RequestHandler = (event) => {
	deleteSessionTokenCookie(event);

	return redirect(303, '/');
};
