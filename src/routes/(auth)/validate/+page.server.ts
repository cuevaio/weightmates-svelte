import type { Actions } from './$types';

import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { redis } from '@/server/redis';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie,
	type User
} from '@/server/auth';

export const actions = {
	validate: async (event) => {
		const { locals, request } = event;
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

		const rawOtp = formData.get('otp');
		const parsedOtp = z.string().min(6).safeParse(rawOtp);
		if (!parsedOtp.success) {
			return fail(400, { field: 'otp', incorrect: true });
		}

		const otp = parsedOtp.data;

		const dontMatch = 'OTP and email do not match';

		const existingUserId = await redis.get<string>(`userIdByEmail:${email}`);

		if (!existingUserId) {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			return fail(400, { error: true, message: dontMatch });
		}

		const storedOtp = await redis.get<string>(`otpByUserId:${existingUserId}`);

		// TODO: encrypt otp
		if (storedOtp !== otp) {
			await new Promise((resolve) => setTimeout(resolve, 5000));
			return fail(400, { error: true, message: dontMatch });
		}

		const sessionToken = generateSessionToken();
		await createSession(sessionToken, existingUserId);

		setSessionTokenCookie(event, sessionToken);

		const user = await redis.hgetall<User>(`user:${existingUserId}`);

		if (!user?.name) {
			redirect(303, '/register');
			return { ok: false };
		}

		redirect(303, '/users/' + existingUserId);
		return { ok: true };
	}
} satisfies Actions;
