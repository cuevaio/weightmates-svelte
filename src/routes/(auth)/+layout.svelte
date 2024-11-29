<script lang="ts">
	let { children } = $props();
</script>

<div class="grid h-screen w-screen grid-cols-2">
	<div class="mx-auto flex max-w-md flex-col items-center justify-center gap-4">
		<h1 class="text-xl font-bold">Ready to loose some weight?</h1>
		<p class="text-sm text-muted-foreground">
			Join hundreds of folks loosing weight together{' '}
		</p>

		{@render children()}
	</div>
	<div class="relative overflow-hidden">
		<img src="/pexels-spaceshipguy-16381486.jpg" alt="Login" class="h-full w-full object-cover" />
	</div>
</div>
