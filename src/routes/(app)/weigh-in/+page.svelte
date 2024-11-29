<script lang="ts">
	import { CalendarIcon } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import * as Popover from '@/components/ui/popover';
	import { cn } from '@/utils';
	import { Calendar } from '@/components/ui/calendar';

	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let date = $state<DateValue>();

	let { form }: { form: ActionData } = $props();
</script>

<p>Add two measurements to start tracking your progress!</p>
<form use:enhance class="max-w-[300px] space-y-4" method="POST" action="?/weigh-in">
	<Input type="number" name="weight" placeholder="Weight" step="0.01" />
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					variant="outline"
					class={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}
					{...props}
				>
					<CalendarIcon class="mr-2 size-4" />
					{date ? df.format(date.toDate(getLocalTimeZone())) : 'Select a date'}
					<input type="hidden" name="date" value={date?.toString()} />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0">
			<Calendar bind:value={date} type="single" class="w-full" initialFocus />
		</Popover.Content>
	</Popover.Root>
	{#if form?.field}<p class="text-destructive">Invalid {form.field}</p>{/if}

	<Button type="submit" class="w-full">Add</Button>
</form>
