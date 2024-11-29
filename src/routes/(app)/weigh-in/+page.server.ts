import { db } from '@/server/db';

import type { Actions } from './$types';

import { z } from 'zod';
import * as schema from '@/server/db/schema';
import { nanoid } from '@/nanoid';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	'weigh-in': async ({ request, locals }) => {
		if (!locals.user || !locals.session) {
			return fail(401, { error: 'Sign in first' });
		}
		const formData = await request.formData();

		const weight = formData.get('weight');
		const parsedWeight = z.coerce.number().min(30).max(200).safeParse(weight);

		if (!parsedWeight.success) {
			return fail(400, { field: 'weight', incorrect: true });
		}

		const date = formData.get('date');
		const parsedDate = z.string().date().safeParse(date);

		if (!parsedDate.success) {
			return fail(400, { field: 'date', incorrect: true });
		}

		try {
			await db.insert(schema.measurements).values({
				id: nanoid(),
				userId: locals.session.userId,
				weight: parsedWeight.data.toString(),
				measuredAt: parsedDate.data
			});
		} catch (err) {
			return fail(422, {
				error: err instanceof Error ? err.message : 'Something went wrong'
			});
		}

		return redirect(303, '/users/' + locals.session.userId);
	}
} satisfies Actions;
