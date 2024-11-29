<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { buttonVariants } from '@/components/ui/button';
	import type { LayoutServerData } from './$types';
	let { children, data }: { children: any; data: LayoutServerData } = $props();

	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	const teamId = writable<string | null>(null);
	setContext('teamId', teamId);
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} />
	<Sidebar.Inset>
		<div class="sticky top-0 z-50 bg-sidebar pt-2">
			<header
				class="flex shrink-0 items-center gap-2 rounded-t-xl border-b bg-background px-4 py-2"
			>
				<div class="flex w-full items-center justify-between">
					<div class="flex items-center gap-4">
						<Sidebar.Trigger class="-ml-1" />
						<a class="flex" href="/">
							<span>Weight</span>
							<span class="font-bold">Mates</span>
							™
						</a>
					</div>
					<span>{data.user.name}</span>
					<a class={buttonVariants({ variant: 'default' })} href="/weigh-in">Weigh in</a>
				</div>
			</header>
		</div>
		<div class="flex flex-1 flex-col gap-4 p-4 py-2">{@render children()}</div>
	</Sidebar.Inset>
</Sidebar.Provider>
