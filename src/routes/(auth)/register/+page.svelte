<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
</script>

<form method="POST" action="?/register" use:enhance class="flex w-full flex-col gap-4">
	<Input type="name" name="name" placeholder="Name" />

	<Button type="submit" class="w-full">Complete registration</Button>
</form>
