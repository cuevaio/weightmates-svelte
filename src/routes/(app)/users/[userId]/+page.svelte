<script lang="ts">
	import type { PageData } from './$types';
  import { TrendingDownIcon, TrendingUpIcon } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto">
	<h1 class="text-xl font-bold">Welcome, {data.user.name}</h1>
	<div class="my-8 grid w-full grid-cols-2 gap-4 sm:grid-cols-4">
		<div
			class="data-[increasing=false]:text-green-500 data-[increasing=true]:text-red-500"
			data-increasing={data.totalWeeklyLoss > 0}
		>
			<span class="text-4xl font-bold tabular-nums">
				{Math.abs(Math.round(data.totalWeeklyLoss * 100) / 100).toFixed(2)}kg
				{#if data.totalWeeklyLoss > 0}
					<TrendingUpIcon class="inline-flex size-6" />
				{:else}
					<TrendingDownIcon class="inline-flex size-6" />
				{/if}
			</span>
			per week (historical)
		</div>
		<div
			class="data-[increasing=false]:text-green-500 data-[increasing=true]:text-red-500"
			data-increasing={data.totalLossRatePercentage > 0}
		>
			<span class="text-4xl font-bold tabular-nums">
				{Math.abs(Math.round(data.totalLossRatePercentage * 10000) / 100).toFixed(2)}
				%
				{#if data.totalLossRatePercentage > 0 }
					<TrendingUpIcon class="inline-flex size-6" />
				{:else}
					<TrendingDownIcon class="inline-flex size-6" />
				{/if}
			</span>{' '}
			per week (historical)
		</div>
		<div
			class="data-[increasing=false]:text-green-500 data-[increasing=true]:text-red-500"
			data-increasing={data.currentLossRate > 0}
		>
			<span class="text-4xl font-bold tabular-nums">
				{Math.abs(Math.round(data.currentLossRate * 100) / 100).toFixed(2)}kg
				{#if data.currentLossRate > 0 }
					<TrendingUpIcon class="inline-flex size-6" />
				{:else}
					<TrendingDownIcon class="inline-flex size-6" />
				{/if}
			</span>{' '}
			per week (last weigh-in)
		</div>
		<div
			class="data-[increasing=false]:text-green-500 data-[increasing=true]:text-red-500"
			data-increasing={data.currentLossRatePercentage > 0}
		>
			<span class="text-4xl font-bold tabular-nums">
				{Math.abs(Math.round(data.currentLossRatePercentage * 10000) / 100).toFixed(2)}
				%
				{#if data.currentLossRatePercentage > 0 }
					<TrendingUpIcon class="inline-flex size-6" />
				{:else}
					<TrendingDownIcon class="inline-flex size-6" />
				{/if}
			</span>{' '}
			per week (last weigh-in)
		</div>
		<div
			class="data-[increasing=false]:text-green-500 data-[increasing=true]:text-red-500"
			data-increasing={data.totalLoss > 0}
		>
			<span class="text-4xl font-bold tabular-nums">
				{Math.abs(Math.round(data.totalLoss * 100) / 100).toFixed(2)}kg
				{#if data.totalLoss > 0 }
					<TrendingUpIcon class="inline-flex size-6" />
				{:else}
					<TrendingDownIcon class="inline-flex size-6" />
				{/if}
			</span>{' '}
			total
		</div>
	</div>
	<div class="my-8">
		<p class="my-8 ml-8 border-l-4 pl-4">{data.message}</p>
		<p class="text-right text-sm">- WeightMates AI</p>
	</div>
</div>
