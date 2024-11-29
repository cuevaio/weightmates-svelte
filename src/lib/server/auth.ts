import type { RequestEvent } from '@sveltejs/kit';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';

import { redis } from '$lib/server/redis';

export const SESSION_TOKEN_COOKIE_NAME = 'auth_session_token';
export const SESSION_TOKEN_COOKIE_EXPIRES_IN_S = 60 * 60 * 24 * 30; // 30 days

export type User = {
	id: string;
	email: string;
	createdAt: string;
	name?: string;
};

export type Session = {
	id: string;
	userId: string;
	expiresAt: Date;
};

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function validateSessionToken(
	token: string
): Promise<{ session: Session | null; user: User | null }> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	let session = await redis.hgetall<Session>(`session:${sessionId}`);

	if (!session) {
		return { session: null, user: null };
	}

	const user = await redis.hgetall<User>(`user:${session.userId}`);

	if (!user) {
		return { session: null, user: null };
	}

	session = {
		...session,
		expiresAt: new Date(session.expiresAt)
	};

	if (Date.now() >= session.expiresAt.getTime()) {
		await redis.hdel(`session:${sessionId}`);
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() - (1000 * SESSION_TOKEN_COOKIE_EXPIRES_IN_S) / 2) {
		// 15 days
		await redis.hset(`session:${session.id}`, {
			expiresAt: session.expiresAt.getTime() + 1000 * SESSION_TOKEN_COOKIE_EXPIRES_IN_S // 30 days
		});
		await redis.expire(`session:${session.id}`, SESSION_TOKEN_COOKIE_EXPIRES_IN_S); // 30 days
	}

	return { session, user };
}

export function setSessionTokenCookie(event: RequestEvent, token: string) {
	event.cookies.set(SESSION_TOKEN_COOKIE_NAME, token, {
		expires: new Date(Date.now() + 1000 * SESSION_TOKEN_COOKIE_EXPIRES_IN_S),
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(SESSION_TOKEN_COOKIE_NAME, {
		path: '/'
	});
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * SESSION_TOKEN_COOKIE_EXPIRES_IN_S) // 30 days
	};

	await redis.hset(`session:${session.id}`, session);
	await redis.expire(`session:${session.id}`, SESSION_TOKEN_COOKIE_EXPIRES_IN_S); // 30 days
	return session;
}
