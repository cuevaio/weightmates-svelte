export type NavbarItem = {
	name: string;
	url: string;
	// This should be `Component` after lucide-svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon: any;
};
