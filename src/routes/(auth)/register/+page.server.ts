import type { Actions } from './$types';

import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { redis } from '@/server/redis';
import { type User } from '@/server/auth';
import { db, schema } from '@/server/db';
import { eq } from 'drizzle-orm';

export const actions = {
	register: async (event) => {
		const { locals, request } = event;
		if (!locals.user || !locals.session) {
			redirect(303, '/login');
			return { ok: false };
		}
		const formData = await request.formData();
		const rawName = formData.get('name');

		const parsedName = z.string().min(2).safeParse(rawName);

		if (!parsedName.success) {
			return fail(400, { field: 'name', incorrect: true });
		}
		const name = parsedName.data;
		const [userDB] = await db
			.select()
			.from(schema.users)
			.where(eq(schema.users.id, locals.session.userId))
			.limit(1);

		if (!userDB?.name) {
			await db.insert(schema.users).values({
				id: locals.session.userId,
				name: name,
				email: locals.user.email
			});
		}

		const userRedis = await redis.hgetall<User>(`user:${locals.session.userId}`);

		if (!userRedis) {
			redirect(303, '/login');
			return { ok: false };
		}

		if (!userRedis.name) {
			await redis.hset(`user:${userRedis.id}`, {
				id: userRedis.id,
				name
			});
		}

		redirect(303, '/users/' + locals.user.id);
		return { ok: true };
	}
} satisfies Actions;
