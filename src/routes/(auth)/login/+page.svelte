<script>
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';

	import { Input } from '@/components/ui/input';
</script>

<form method="POST" action="?/login" use:enhance class="flex w-full flex-col gap-4">
	<Input type="email" name="email" placeholder="Email" />
	<Button class="w-full" type="submit">Continue</Button>
</form>
