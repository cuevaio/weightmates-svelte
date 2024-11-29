import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.session && locals.user) {
    if (locals.user.name) {
      redirect(303, `/users/${locals.user.id}`);
    }
    redirect(303, "/register")
	}

	return {
		user: locals.user
	};
};
