<script lang="ts">
  import { Play, Sparkles } from 'lucide-svelte';
</script>

<div class="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 sm:p-20">
  <main class="row-start-2 flex flex-col items-center gap-8 sm:items-start">
    <div class="text-4xl">
      Weight<span class="font-bold">Mates</span>
    </div>
    <ol class="list-inside list-decimal text-center text-sm sm:text-left">
      <li class="mb-2">Loose weight with your friends and family</li>
      <li>
        Stay motivated with our AI assistant
        <Sparkles class="mb-1 ml-1 inline-flex size-3" />
      </li>
    </ol>
    <div class="flex flex-col items-center gap-4 sm:flex-row">
      <a 
        class="flex h-10 items-center justify-center gap-2 rounded-full border border-solid border-transparent bg-foreground px-4 text-sm text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] sm:h-12 sm:px-5 sm:text-base"
        href="/login"
      >
        <Play class="size-5 fill-current" />
        Start now
      </a>
      <a
        class="flex h-10 items-center justify-center rounded-full border border-solid border-black/[.08] px-4 text-sm transition-colors hover:border-transparent hover:bg-[#f2f2f2] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] sm:h-12 sm:min-w-44 sm:px-5 sm:text-base"
        href="https://github.com/cuevaio/weightmates-svelte"
        target="_blank"
        rel="noopener noreferrer"
      >
        Check the code
      </a>
    </div>
  </main>
  <footer class="row-start-3 flex flex-wrap items-center justify-center">
    Build by
    <a
      class="ml-1 flex items-center gap-2 hover:underline hover:underline-offset-4"
      href="https://cueva.io"
      target="_blank"
      rel="noopener noreferrer"
    >
      cuevaio
    </a>
  </footer>
</div>
