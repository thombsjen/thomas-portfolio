<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isOpen = ref(false)
const route = useRoute()
const router = useRouter()

const menuItems = [
  { label: 'Home', to: '/', anchor: null, number: '01' },
  { label: 'Photo', to: '/photo', anchor: '55', number: '02' },
  { label: 'Movie', to: '/movie', anchor: '105', number: '03' },
  { label: 'Contact', to: '/contact', anchor: null, number: '04' },
]

const YOUTUBE_URL = 'https://youtu.be/9iHbUniBWqI?si=1wlnjetebWr0HsJ2'

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const scrollToAnchor = (anchor) => {
  const top = (Number(anchor) / 100) * window.innerHeight
  window.scrollTo({ top, behavior: 'smooth' })
}

const waitForPageLayout = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })

const navigate = async (item) => {
  close()

  if (route.path !== item.to) {
    await router.push(item.to)
    await waitForPageLayout()
  }

  if (item.anchor) {
    scrollToAnchor(item.anchor)
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''

  if (open) window.addEventListener('keydown', onKeydown)
  else window.removeEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="slide-menu">
    <button
      type="button"
      class="menu-trigger"
      :class="{ 'is-open': isOpen }"
      :aria-expanded="isOpen"
      aria-controls="site-menu-panel"
      :aria-label="isOpen ? 'Close menu' : 'Open menu'"
      data-hover
      @click="toggle"
    >
      <span class="menu-icon" aria-hidden="true">
        <span class="bar" />
        <span class="bar" />
        <span class="bar" />
      </span>
      <span class="menu-label" aria-hidden="true">MENU</span>
    </button>

    <div
      class="menu-backdrop"
      :class="{ 'is-open': isOpen }"
      aria-hidden="true"
      @click="close"
    />

    <nav
      id="site-menu-panel"
      class="menu-panel"
      :class="{ 'is-open': isOpen }"
      aria-label="Site navigation"
      :aria-hidden="!isOpen"
    >
      <div class="menu-panel-inner">
        <header class="menu-header">
          <span class="menu-eyebrow">Navigation</span>
          <p class="menu-brand">
            Boxcar von <span class="gold">Productions</span>
          </p>
        </header>

        <ul class="menu-list">
          <li v-for="item in menuItems" :key="item.label">
            <button
              type="button"
              class="menu-link"
              data-hover
              @click="navigate(item)"
            >
              <span class="menu-link-num">{{ item.number }}</span>
              <span class="menu-link-label">{{ item.label }}</span>
              <span class="menu-link-arrow" aria-hidden="true">↗</span>
            </button>
          </li>
        </ul>

        <footer class="menu-footer">
          <a
            :href="YOUTUBE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="menu-external"
            data-hover
            @click="close"
          >
            <span>Spotify / YouTube</span>
            <span aria-hidden="true">↗</span>
          </a>
          <p class="menu-meta">Minneapolis, Minnesota · 2026</p>
        </footer>
      </div>
    </nav>
  </div>
</template>

<style scoped>
.slide-menu {
  --menu-gold: #c9a84c;
  --menu-ease: cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-trigger {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  width: 44px;
  height: 88px;
  padding: 0;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.75);
  cursor: none;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.bar {
  display: block;
  width: 22px;
  height: 1.5px;
  background: currentColor;
  border-radius: 1px;
  transform-origin: center;
  transition:
    transform 0.38s var(--menu-ease),
    opacity 0.22s ease,
    width 0.32s var(--menu-ease);
}

.menu-trigger:hover .bar,
.menu-trigger.is-open .bar {
  background: #fff;
}

.menu-trigger:hover .menu-icon .bar:nth-child(1),
.menu-trigger.is-open .menu-icon .bar:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.menu-trigger:hover .menu-icon .bar:nth-child(2),
.menu-trigger.is-open .menu-icon .bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.menu-trigger:hover .menu-icon .bar:nth-child(3),
.menu-trigger.is-open .menu-icon .bar:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

.menu-label {
  margin-top: 0.75rem;
  writing-mode: vertical-rl;
  font-size: 10px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  transition: color 0.3s ease;
}

.menu-trigger:hover .menu-label,
.menu-trigger.is-open .menu-label {
  color: var(--menu-gold);
}

.menu-backdrop {
  position: fixed;
  inset: 0;
  z-index: 45;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(4px);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 0.45s ease,
    visibility 0.45s ease;
}

.menu-backdrop.is-open {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

.menu-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 50;
  width: min(420px, 90vw);
  height: 100dvh;
  background: linear-gradient(
    165deg,
    rgba(14, 14, 14, 0.98) 0%,
    rgba(10, 10, 10, 0.99) 100%
  );
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: -24px 0 80px rgba(0, 0, 0, 0.45);
  transform: translateX(100%);
  transition: transform 0.58s var(--menu-ease);
  overflow: hidden;
}

.menu-panel.is-open {
  transform: translateX(0);
}

.menu-panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(2rem, 6vh, 3.5rem) clamp(1.75rem, 5vw, 2.75rem);
}

.menu-header {
  margin-bottom: clamp(2rem, 8vh, 3.5rem);
}

.menu-eyebrow {
  display: block;
  font-size: 10px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.menu-brand {
  margin: 0.65rem 0 0;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.gold {
  color: var(--menu-gold);
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.05rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: transparent;
  color: rgba(255, 255, 255, 0.82);
  text-align: left;
  cursor: none;
  opacity: 0;
  transform: translateX(28px);
  transition:
    opacity 0.42s ease,
    transform 0.42s var(--menu-ease),
    color 0.25s ease;
}

.menu-panel.is-open .menu-link {
  opacity: 1;
  transform: translateX(0);
}

.menu-panel.is-open .menu-list li:nth-child(1) .menu-link { transition-delay: 0.1s; }
.menu-panel.is-open .menu-list li:nth-child(2) .menu-link { transition-delay: 0.16s; }
.menu-panel.is-open .menu-list li:nth-child(3) .menu-link { transition-delay: 0.22s; }
.menu-panel.is-open .menu-list li:nth-child(4) .menu-link { transition-delay: 0.28s; }

.menu-link:hover {
  color: #fff;
}

.menu-link-num {
  font-size: 10px;
  letter-spacing: 0.18em;
  color: var(--menu-gold);
  min-width: 1.5rem;
}

.menu-link-label {
  flex: 1;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-size: clamp(1.35rem, 4.5vw, 1.85rem);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.menu-link-arrow {
  font-size: 1rem;
  opacity: 0;
  transform: translate(-6px, 6px);
  transition:
    opacity 0.28s ease,
    transform 0.28s var(--menu-ease);
  color: var(--menu-gold);
}

.menu-link:hover .menu-link-arrow {
  opacity: 1;
  transform: translate(0, 0);
}

.menu-footer {
  margin-top: auto;
  padding-top: 2rem;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.45s ease 0.38s,
    transform 0.45s var(--menu-ease) 0.38s;
}

.menu-panel.is-open .menu-footer {
  opacity: 1;
  transform: translateY(0);
}

.menu-external {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.25s ease;
}

.menu-external:hover {
  color: var(--menu-gold);
}

.menu-meta {
  margin: 1rem 0 0;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
}

@media (max-width: 720px) {
  .menu-trigger {
    right: 1rem;
    top: auto;
    bottom: 1.25rem;
    transform: none;
    height: auto;
    flex-direction: row;
    gap: 10px;
    width: auto;
    padding: 0.65rem 0.85rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    background: rgba(10, 10, 10, 0.82);
    backdrop-filter: blur(8px);
  }

  .menu-label {
    writing-mode: horizontal-tb;
    margin-top: 0;
    letter-spacing: 0.2em;
  }

}

@media (hover: none) and (pointer: coarse) {
  .menu-trigger,
  .menu-link,
  .menu-external {
    cursor: pointer;
  }
}
</style>
