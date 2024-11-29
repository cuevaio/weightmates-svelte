<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
	import * as InputOTP from '@/components/ui/input-otp';
	import { Input } from '@/components/ui/input';
	import { otpAlphabetRegex } from '@/nanoid';
	import { page } from '$app/stores';
</script>

<form method="POST" action="?/validate" use:enhance class="flex w-[300px] flex-col gap-4">
	<Input
		type="email"
		name="email"
		placeholder="Email"
		value={$page.url.searchParams.get('email') ?? ''}
	/>
	<p class="text-xs">Enter the one time password that has been sent to your email</p>
	<InputOTP.Root maxlength={6} name="otp" pattern={otpAlphabetRegex} class="mx-auto">
		{#snippet children({ cells }: { cells: any[] })}
			<InputOTP.Group>
				{#each cells.slice(0, 3) as cell}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
			<InputOTP.Separator />
			<InputOTP.Group>
				{#each cells.slice(3, 6) as cell}
					<InputOTP.Slot {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>

	<Button type="submit" class="w-full">Login</Button>
</form>
