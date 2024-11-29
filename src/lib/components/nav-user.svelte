<script lang="ts">
	import BadgeCheck from 'lucide-svelte/icons/badge-check';
	import Bell from 'lucide-svelte/icons/bell';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import CreditCard from 'lucide-svelte/icons/credit-card';
	import LogOut from 'lucide-svelte/icons/log-out';
	import Sparkles from 'lucide-svelte/icons/sparkles';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import type { User } from '@/server/auth';
	import { ChartColumnDecreasing, Settings2 } from 'lucide-svelte';

	let {
		user
	}: {
		user: User;
	} = $props();

	const sidebar = useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<Avatar.Image alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{user.name![0] ?? 'A'}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
						<ChevronsUpDown class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-[--bits-dropdown-menu-anchor-width] min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="h-8 w-8 rounded-lg">
							<Avatar.Image alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{user.name![0] ?? 'A'}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">{user.name}</span>
							<span class="truncate text-xs">{user.email}</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<Sparkles />
						Upgrade to Pro
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a href={`/users/${user.id}`} {...props}>
								<ChartColumnDecreasing />
								Your Progress</a
							>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						{#snippet child({ props })}
							<a href={`/settings`} {...props}>
								<Settings2 />
								Settings</a
							>
						{/snippet}
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<Bell />
						Theme
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					{#snippet child({ props })}
						<form {...props} method="POST" action="/logout">
							<button class="flex w-full items-center gap-2">
								<LogOut />
								Log out
							</button>
						</form>
					{/snippet}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
