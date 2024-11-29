import { env } from '$env/dynamic/private';
import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
	apiKey: env.OPENAI_API_KEY
});
