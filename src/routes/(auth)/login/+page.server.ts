import type { Actions } from './$types';

import { z } from 'zod';
import { nanoid, otp } from '@/nanoid';
import { fail, redirect } from '@sveltejs/kit';
import { redis } from '@/server/redis';
import type { User } from '@/server/auth';
import { resend } from '@/server/resend';

export const actions = {
	login: async ({ request, locals }) => {
		if (locals.user && locals.session) {
			redirect(303, '/users/' + locals.session.userId);
			return { ok: false };
		}
		const formData = await request.formData();

		const rawEmail = formData.get('email');
		const parsedEmail = z.string().email().safeParse(rawEmail);

		if (!parsedEmail.success) {
			return fail(400, { field: 'email', incorrect: true });
		}

		const email = parsedEmail.data.toLowerCase();

		let userId: string | null = null;

		const existingUserId = await redis.get<string>(`userIdByEmail:${email}`);

		if (existingUserId) {
			userId = existingUserId;
		} else {
			userId = nanoid();

			const user: User = {
				id: userId,
				email,
				createdAt: new Date().toISOString()
			};

			await redis.set(`userIdByEmail:${email}`, userId);
			await redis.hset(`user:${userId}`, user);
		}

		const oneTimePassword = otp();

		const response = await resend.emails.send({
			from: 'onboarding@updates.cueva.io',
			to: parsedEmail.data,
			subject: 'Your one-time password for WeightMates',
			text: `Your one-time password for WeightMates is ${oneTimePassword}`
		});

		if (response.error) {
			return fail(422, {
				error: 'Error sending email'
			});
		}

		try {
			await redis.set(`otpByUserId:${userId}`, oneTimePassword);
			await redis.expire(`otpByUserId:${userId}`, 60 * 15); // 15 minutes
		} catch (err) {
			return fail(422, {
				error: err instanceof Error ? err.message : 'Something went wrong'
			});
		}

		redirect(303, '/validate?email=' + email);
		return { ok: false };
	}
} satisfies Actions;
