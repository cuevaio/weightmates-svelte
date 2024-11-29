import { type MeasurementSelect } from '$lib/server/db/schema';

export interface DailyWeight {
	date: string;
	weight: number;
	interpolated: boolean;
}

export function interpolateWeights(measurements: MeasurementSelect[]): DailyWeight[] {
	// Sort measurements by date
	const sortedMeasurements = [...measurements].sort(
		(a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
	);

	if (sortedMeasurements.length < 2) {
		return sortedMeasurements.map((m) => ({
			date: m.measuredAt,
			weight: m.weight,
			interpolated: false
		}));
	}

	const result: DailyWeight[] = [];
	const startDate = new Date(sortedMeasurements[0].measuredAt);
	const endDate = new Date(sortedMeasurements[sortedMeasurements.length - 1].measuredAt);

	// Function to find the surrounding measurements for a given date
	const findSurroundingMeasurements = (date: Date) => {
		for (let i = 0; i < sortedMeasurements.length - 1; i++) {
			const curr = new Date(sortedMeasurements[i].measuredAt);
			const next = new Date(sortedMeasurements[i + 1].measuredAt);

			if (date > curr && date < next) {
				return {
					before: sortedMeasurements[i],
					after: sortedMeasurements[i + 1]
				};
			}
		}
		return null;
	};

	// Linear interpolation function
	const interpolate = (date: Date, before: MeasurementSelect, after: MeasurementSelect): number => {
		const t1 = new Date(before.measuredAt).getTime();
		const t2 = new Date(after.measuredAt).getTime();
		const t = date.getTime();

		const w1 = before.weight;
		const w2 = after.weight;

		const progress = (t - t1) / (t2 - t1);
		return w1 + (w2 - w1) * progress;
	};

	// Generate daily weights
	const currentDate = new Date(startDate);
	while (currentDate <= endDate) {
		const surrounding = findSurroundingMeasurements(currentDate);

		if (surrounding) {
			const interpolatedWeight = interpolate(currentDate, surrounding.before, surrounding.after);
			result.push({
				date: currentDate.toISOString().split('T')[0],
				weight: Number(interpolatedWeight.toFixed(1)),
				interpolated: true
			});
		} else {
			// If it's an exact measurement date, use that measurement
			const exactMeasurement = sortedMeasurements.find(
				(m) => m.measuredAt === currentDate.toISOString().split('T')[0]
			);
			if (exactMeasurement) {
				result.push({
					date: exactMeasurement.measuredAt,
					weight: exactMeasurement.weight,
					interpolated: false
				});
			}
		}

		// Move to next day
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return result;
}
