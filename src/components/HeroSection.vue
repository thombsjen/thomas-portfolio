<script setup>
const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]
</script>

<template>
  <header class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(167,139,250,0.15),transparent)]"
      aria-hidden="true"
    />

    <nav class="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <a href="#" class="font-display text-xl font-semibold tracking-tight text-white">
        Thomas
      </a>
      <ul class="hidden gap-8 sm:flex">
        <li v-for="link in navLinks" :key="link.href">
          <a
            :href="link.href"
            class="text-sm text-zinc-400 transition-colors hover:text-white"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>
    </nav>

    <section class="relative mx-auto max-w-6xl px-6 pb-32 pt-16 sm:pt-24">
      <p class="mb-4 text-sm font-medium uppercase tracking-widest text-accent">
        Portfolio
      </p>
      <h1
        class="font-display max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
      >
        Crafting thoughtful digital experiences.
      </h1>
      <p class="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
        Developer &amp; designer building beautiful, performant web applications.
        Welcome to my corner of the internet.
      </p>
      <div class="mt-10 flex flex-wrap gap-4">
        <a
          href="#work"
          class="inline-flex items-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-surface transition hover:bg-violet-300"
        >
          View my work
        </a>
        <a
          href="#contact"
          class="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-white"
        >
          Get in touch
        </a>
      </div>
    </section>
  </header>
</template>
