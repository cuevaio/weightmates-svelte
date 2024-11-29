<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { NavbarItem } from './types';

	let {
		items
	}: {
		items: NavbarItem[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Personal</Sidebar.GroupLabel>
	<Sidebar.GroupContent>
		<Sidebar.Menu>
			{#each items as item (item.name)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
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
