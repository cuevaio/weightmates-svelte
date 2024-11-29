<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { NavbarItem } from './types';

	let {
		ref = $bindable(null),
		items,
		...restProps
	}: {
		items: NavbarItem[];
	} & ComponentProps<typeof Sidebar.Group> = $props();
</script>

<Sidebar.Group bind:ref {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.name)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="sm">
						{#snippet child({ props })}
							<a href={item.url} {...props}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
