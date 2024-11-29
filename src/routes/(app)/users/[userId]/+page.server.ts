import { db } from '@/server/db';
import { type MeasurementSelect, type UserSelect } from '@/server/db/schema';

import { interpolateWeights } from '@/interpolate';
import type { PageServerLoad } from './$types';

import { generateText } from 'ai';
import { openai } from '@/server/openai';

import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const today = new Date().toISOString().split('T')[0];

	const user = (await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, params.userId),
		with: {
			measurements: {
				orderBy: (measurements, { desc }) => desc(measurements.measuredAt),
				limit: 100,
				where: (measurements, { lte }) => lte(measurements.measuredAt, today)
			}
		}
	})) as UserSelect & {
		measurements: MeasurementSelect[];
	};

	if (!user) {
		error(404, {
			message: 'Not found'
		});
	}

	if (user.measurements.length < 2) {
		redirect(303, '/weigh-in');
	}

	const lastMeasurement = user.measurements[0];
	const initialMeasurement = user.measurements[user.measurements.length - 1];
	const penultimateMeasurement = user.measurements[1];

	const totalLoss = lastMeasurement.weight - initialMeasurement.weight;

	const currentLossDays =
		(new Date(lastMeasurement.measuredAt).getTime() -
			new Date(initialMeasurement.measuredAt).getTime()) /
		1000 /
		3600 /
		24;

	const totalWeeklyLoss = totalLoss / (currentLossDays / 7);

	const totalLossRatePercentage =
		(lastMeasurement.weight / initialMeasurement.weight) ** (7 / currentLossDays) - 1;

	const currentLossRate =
		((lastMeasurement.weight - penultimateMeasurement.weight) / currentLossDays) * 7;

	const currentLossRatePercentage =
		(lastMeasurement.weight / penultimateMeasurement.weight) ** (7 / currentLossDays) - 1;

	const data = interpolateWeights(user.measurements as MeasurementSelect[]);

	for (
		let i = 0;
		i < (new Date().getTime() - new Date(lastMeasurement.measuredAt).getTime()) / 1000 / 3600 / 24;
		i++
	) {
		data.push({
			date: new Date(new Date(lastMeasurement.measuredAt).getTime() + 24 * 3600 * 1000 * i)
				.toISOString()
				.split('T')[0],
			interpolated: true,
			weight: lastMeasurement.weight
		});
	}

	let prompt = '';

	if (user.measurements.length > 1) {
		prompt = `Write a motivational message for ${user.name} who started with ${user.measurements[user.measurements.length - 1].weight}kg in ${user.measurements[user.measurements.length - 1].measuredAt} and now ${new Date().toISOString().split('T')[0]} is ${user.measurements[0].weight}. If the user has not lossed weight, but gained, then motivate him o her to work harder. If he or she has loosed weight, congratulate him/her.`;
	} else {
		prompt = `Write a welcome message to WeightMates app for ${user.name}`;
	}

	const { text: message } = await generateText({
		model: openai('gpt-4o-mini'),
		system:
			'You are the WeightMates assistant, an app to loose weight with a team and compete with other teams.',
		prompt
	});

	return {
		user,
		data,
		message,
		totalLoss,
		currentLossRatePercentage,
		currentLossRate,
		totalLossRatePercentage,
		totalWeeklyLoss
	};
};
