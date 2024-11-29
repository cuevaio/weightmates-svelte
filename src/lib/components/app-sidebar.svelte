<script lang="ts">
	import NavMain from '$lib/components/nav-main.svelte';
	import NavProjects from '@/components/nav-team.svelte';
	import NavSecondary from '$lib/components/nav-secondary.svelte';
	import NavUser from '$lib/components/nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import Command from 'lucide-svelte/icons/command';
	import { getContext, type ComponentProps } from 'svelte';
	import type { User } from '@/server/auth';
	import {
		BookOpen,
		ChartColumnDecreasing,
		LifeBuoy,
		MailOpen,
		Send,
		Settings2,
		Users
	} from 'lucide-svelte';
	import NavTeam from '@/components/nav-team.svelte';

	let {
		ref = $bindable(null),
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & {
		user: User;
	} = $props();

	const teamId = getContext<string | null>('teamId');
</script>

<Sidebar.Root bind:ref variant="inset" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="##" {...props}>
							<div
								class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
							>
								<Command class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">Acme Inc</span>
								<span class="truncate text-xs">Enterprise</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain
			items={[
				{
					name: 'Your Progress',
					url: '/users/' + user.id,
					icon: ChartColumnDecreasing
				},
				{
					name: 'Teams',
					url: '/teams',
					icon: BookOpen
				},
				{
					name: 'Invites',
					url: '/invites',
					icon: MailOpen
				},
				{
					name: 'Settings',
					url: '#',
					icon: Settings2
				}
			]}
		/>
		<NavTeam
			items={teamId
				? [
						{
							name: 'Team Progress',
							url: '/teams/' + teamId,
							icon: ChartColumnDecreasing
						},
						{
							name: 'Members',
							url: `/teams/${teamId}/members`,
							icon: Users
						},
						{
							name: 'Invites',
							url: `/teams/${teamId}/invites`,
							icon: MailOpen
						},
						{
							name: 'Settings',
							url: `/teams/${teamId}/settings`,
							icon: Settings2
						}
					]
				: []}
		/>
		<NavSecondary
			items={[
				{
					name: 'Support',
					url: '#',
					icon: LifeBuoy
				},
				{
					name: 'Feedback',
					url: '#',
					icon: Send
				}
			]}
			class="mt-auto"
		/>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
