<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import { photoConfig, photoGallery } from '../config/photos.js'

const scrollLayer = ref(null)
const progressEl = ref(null)

let scrollHandler = null
let rafId = 0
let sectionsByAnchor = new Map()

const revealedSections = new Set()
const REVEAL_DURATION_MS = 1050
const STAGGER_MS = 120
const REVEAL_FROM_BOTTOM_VH = 0.2
const MOBILE_BREAKPOINT = 720

const parseTopVh = (card) => {
  const top = getComputedStyle(card).top
  if (!top || top === 'auto') return Infinity
  const match = top.match(/^([\d.]+)vh$/)
  return match ? Number(match[1]) : Infinity
}

const revealLineY = () =>
  window.innerHeight * (1 - REVEAL_FROM_BOTTOM_VH / 100)

const shouldRevealSection = (triggerCard) => {
  const { top, bottom } = triggerCard.getBoundingClientRect()
  const line = revealLineY()
  return top <= line && bottom > 0
}

const revealSection = (anchor, cards) => {
  if (revealedSections.has(anchor)) return
  revealedSections.add(anchor)

  const sorted = [...cards].sort(
    (a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left,
  )

  sorted.forEach((card, index) => {
    card.style.setProperty('--reveal-duration', `${REVEAL_DURATION_MS}ms`)
    card.style.setProperty('--reveal-delay', `${index * STAGGER_MS}ms`)
  })

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      sorted.forEach((card) => card.classList.add('is-revealed'))
    })
  })
}

const updateCardReveals = () => {
  for (const [anchor, cards] of sectionsByAnchor) {
    if (revealedSections.has(anchor)) continue
    const trigger = cards.reduce((a, b) => (parseTopVh(a) <= parseTopVh(b) ? a : b))
    if (shouldRevealSection(trigger)) revealSection(anchor, cards)
  }
}

const onScroll = () => {
  const sy = window.scrollY || window.pageYOffset || 0

  updateCardReveals()

  if (progressEl.value) {
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1
    const p = Math.max(0, Math.min(1, sy / max))
    progressEl.value.style.transform = `scaleX(${p})`
  }
}

const setupCardSections = () => {
  const root = scrollLayer.value?.closest('.photo-page')
  if (!root) return

  sectionsByAnchor = new Map()
  for (const card of root.querySelectorAll('.scroll-content .scroll-card')) {
    const anchor = card.dataset.sectionAnchor
    if (!sectionsByAnchor.has(anchor)) sectionsByAnchor.set(anchor, [])
    sectionsByAnchor.get(anchor).push(card)
  }
}

onMounted(() => {
  const root = scrollLayer.value?.closest('.photo-page')
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT

  scrollHandler = () => {
    if (rafId) return
    rafId = window.requestAnimationFrame(() => {
      rafId = 0
      onScroll()
    })
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', scrollHandler, { passive: true })
  setupCardSections()

  if (isMobile && root) {
    root.querySelectorAll('.scroll-content .scroll-card').forEach((card) => {
      card.classList.add('is-revealed')
    })
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(onScroll)
  })
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
    window.removeEventListener('resize', scrollHandler)
  }
})
</script>

<template>
  <main class="photo-page">
    <ParticleCanvas />

    <aside class="sidebar" aria-label="Primary">
      <RouterLink to="/" class="logo-mark" data-hover aria-label="Thomas home">
        <img src="/images/logo.png" alt="" width="28" height="28" />
      </RouterLink>
      <RouterLink to="/photo" class="circle-icon is-active" data-hover aria-label="Photo">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 7h4l2-2h4l2 2h4v12H4V7z" stroke-linejoin="round" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      </RouterLink>
      <span class="vline" aria-hidden="true" />
      <RouterLink to="/" class="side-text" data-hover>HOME</RouterLink>
    </aside>

    <div class="scroll-progress" aria-hidden="true">
      <span ref="progressEl" class="scroll-progress-bar" />
    </div>

    <div class="meta-top-left">
      <span class="dot-live" aria-hidden="true" />
      <span>{{ photoConfig.location }} · 2026</span>
    </div>
    <div class="meta-top-right">
      BOXCAR VON PRODUCTIONS — MYTH ANTHROPIX &nbsp;/&nbsp; <span class="gold">PHOTO</span>
    </div>

    <header class="page-header">
      <p class="page-eyebrow">Visual work</p>
      <h1 class="page-title">Photo</h1>
      <p class="page-lead">
        Live performance, studio sessions, and visual stories from the stage and behind the lens.
      </p>
    </header>

    <div ref="scrollLayer" class="scroll-content">
      <article
        class="scroll-card quote-card"
        data-section-anchor="10"
        :style="{ top: '8vh', left: '5vw', width: '280px' }"
      >
        <div class="card-corner">01</div>
        <p class="quote-text">
          CAPTURING <span class="gold">LIGHT</span>, MOTION, AND EMOTION IN EVERY FRAME
        </p>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="10"
        :style="{ top: '8vh', right: '5vw', width: '300px' }"
      >
        <div class="stats-head">
          <span>Gallery</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Boxcar von productions — Myth Anthropix</div>
        <div class="stats-value">
          Live music, studio portraits, and behind-the-scenes documentation.
        </div>
      </article>

      <article
        v-for="photo in photoGallery"
        :key="photo.tag + photo.src"
        class="scroll-card image-card"
        :data-section-anchor="photo.anchor"
        :style="photo.position"
      >
        <div class="img-rect" :style="photo.rect">
          <span class="img-tag">{{ photo.tag }}</span>
          <img :src="photo.src" :alt="photo.alt" class="img-rect-img" loading="lazy" />
        </div>
        <div class="img-caption">{{ photo.caption }}</div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="55"
        :style="{ top: '42vh', right: '6vw', width: '260px' }"
      >
        <div class="card-corner">02</div>
        <p class="quote-text">
          FROM THE <span class="gold">STAGE</span> TO THE STUDIO — VISUAL NARRATIVES THAT MOVE
        </p>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="105"
        :style="{ top: '105vh', left: '5vw', width: '280px' }"
      >
        <div class="stats-head">
          <span>Focus</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Categories</div>
        <div class="stats-value">
          Live performance · Studio portraits · Behind the scenes · Event coverage · Creative direction
        </div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="105"
        :style="{ top: '108vh', right: '7vw', width: '270px' }"
      >
        <div class="card-corner">03</div>
        <p class="quote-text">
          EVERY SHOT IS A STORY — <span class="gold">RAW</span> TEXTURE AND CONTROLLED LIGHT
        </p>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="155"
        :style="{ top: '168vh', left: '5vw', width: '300px' }"
      >
        <div class="card-corner">04</div>
        <p class="quote-text">
          MINNEAPOLIS-BASED — MUSIC, MEDIA, AND <span class="gold">VISUAL</span> PRODUCTION
        </p>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="155"
        :style="{ top: '168vh', right: '5vw', width: '280px' }"
      >
        <div class="stats-head">
          <span>Collaborate</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Available for</div>
        <div class="stats-value">
          Live event photography · Artist portraits · Album and promo shoots · Creative direction
        </div>
      </article>

      <article
        class="scroll-card quote-card centered"
        data-section-anchor="155"
        :style="{ top: '178vh', width: '300px' }"
      >
        <RouterLink to="/" class="back-link" data-hover>← Back to portfolio</RouterLink>
      </article>
    </div>
  </main>
</template>

<style scoped>
.photo-page {
  position: relative;
  width: 100%;
  max-width: 1680px;
  margin-inline: auto;
  height: 210vh;
  background: #0a0a0a;
  color: #fff;
  overflow: hidden;
}

.page-header {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  pointer-events: none;
  user-select: none;
  max-width: min(90vw, 640px);
  opacity: 0;
  animation: header-fade 1s ease-out 0.15s forwards;
}

@keyframes header-fade {
  to {
    opacity: 1;
  }
}

.page-eyebrow {
  margin: 0 0 0.5rem;
  font-size: 10px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.page-title {
  margin: 0;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-weight: 800;
  font-size: clamp(72px, 14vw, 140px);
  line-height: 0.9;
  letter-spacing: -0.02em;
  text-shadow: 0 0 80px rgba(201, 168, 76, 0.05);
}

.page-lead {
  margin: 1rem 0 0;
  font-size: 12px;
  letter-spacing: 0.06em;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.55);
}

.sidebar {
  position: fixed;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.logo-mark,
.circle-icon,
.side-text {
  text-decoration: none;
  transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

.logo-mark {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
}

.logo-mark img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.logo-mark:hover {
  opacity: 0.75;
}

.circle-icon {
  width: 30px;
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: rgba(255, 255, 255, 0.7);
}

.circle-icon.is-active,
.circle-icon:hover {
  color: #fff;
  border-color: #fff;
}

.vline {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
}

.side-text {
  writing-mode: vertical-rl;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.5);
}

.side-text:hover {
  color: #fff;
}

.scroll-progress {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  z-index: 25;
  pointer-events: none;
}

.scroll-progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #c9a84c, #e8c87a);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

.meta-top-left,
.meta-top-right {
  position: fixed;
  top: 1.4rem;
  z-index: 30;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  pointer-events: none;
}

.meta-top-left {
  left: 1.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.meta-top-right {
  right: 1.5rem;
}

.dot-live {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c9a84c;
  box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.6);
  animation: pulse 2s ease-out infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(201, 168, 76, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0);
  }
}

.scroll-content {
  position: absolute;
  inset: 0;
  z-index: 20;
  pointer-events: none;
}

@property --reveal-p {
  syntax: '<percentage>';
  inherits: false;
  initial-value: 0%;
}

.scroll-card {
  position: absolute;
  pointer-events: auto;
  overflow: hidden;
  isolation: isolate;
  opacity: 0;
  transform: translate3d(-72px, 0, 0) scale(0.96);
  filter: blur(8px);
  transition:
    transform var(--reveal-duration, 1s) cubic-bezier(0.18, 1, 0.32, 1),
    opacity calc(var(--reveal-duration, 1s) * 0.82) ease-out,
    filter calc(var(--reveal-duration, 1s) * 0.9) ease-out;
  transition-delay: var(--reveal-delay, 0ms);
  will-change: transform, opacity, filter;
}

.scroll-card.is-revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0) scale(1);
  filter: blur(0);
}

.scroll-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: 2;
  background: linear-gradient(
    110deg,
    rgba(201, 168, 76, 0) 0%,
    rgba(201, 168, 76, 0.42) 42%,
    rgba(255, 255, 255, 0.22) 50%,
    rgba(201, 168, 76, 0.42) 58%,
    rgba(201, 168, 76, 0) 100%
  );
  transform: translateX(-130%);
  opacity: 0;
  pointer-events: none;
  transition:
    transform calc(var(--reveal-duration, 1s) * 0.95) cubic-bezier(0.2, 0.9, 0.25, 1),
    opacity calc(var(--reveal-duration, 1s) * 0.4) ease-out;
  transition-delay: var(--reveal-delay, 0ms);
}

.scroll-card.is-revealed::before {
  transform: translateX(130%);
  opacity: 1;
}

.scroll-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  background: #0a0a0a;
  opacity: 1;
  --reveal-p: 0%;
  -webkit-mask-image: linear-gradient(to right, transparent var(--reveal-p), #000 var(--reveal-p));
  mask-image: linear-gradient(to right, transparent var(--reveal-p), #000 var(--reveal-p));
  transition:
    --reveal-p var(--reveal-duration, 1s) cubic-bezier(0.22, 1, 0.36, 1),
    opacity calc(var(--reveal-duration, 1s) * 0.92) cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--reveal-delay, 0ms);
  will-change: --reveal-p, opacity;
  pointer-events: none;
}

.scroll-card.is-revealed::after {
  --reveal-p: 100%;
  opacity: 0;
}

.scroll-card.centered {
  left: 50%;
  margin-left: calc(-1 * 150px);
}

.quote-card {
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.card-corner {
  position: absolute;
  top: 0.6rem;
  right: 0.75rem;
  font-size: 9.5px;
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.35);
  font-weight: 500;
}

.quote-text {
  margin: 0;
  font-weight: 700;
  font-size: 13px;
  line-height: 1.45;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
}

.gold {
  color: #c9a84c;
}

.stats-card {
  background: #c9a84c;
  color: #0a0a0a;
  padding: 1.5rem;
}

.stats-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  font-weight: 600;
  margin-bottom: 1.6rem;
  text-transform: uppercase;
}

.stats-arrow {
  font-size: 14px;
  line-height: 1;
}

.stats-label {
  font-size: 11px;
  letter-spacing: 0.16em;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
  opacity: 0.85;
}

.stats-value {
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.image-card {
  display: block;
}

.img-rect {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 70%),
    repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 2px, #161616 2px, #161616 4px),
    #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.img-rect::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.06), transparent 60%);
  pointer-events: none;
}

.img-rect-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(1) contrast(0.95);
}

.img-tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 9.5px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  z-index: 1;
}

.img-caption {
  margin-top: 0.75rem;
  font-size: 11px;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.55);
}

.back-link {
  display: block;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #c9a84c;
}

@media (max-width: 720px) {
  .photo-page {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 1rem 0 2rem;
  }

  .page-header {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin: 0 auto 1.5rem;
    z-index: 1;
  }

  .sidebar,
  .meta-top-right {
    display: none;
  }

  .meta-top-left {
    position: relative;
    top: auto;
    left: auto;
    display: flex;
    justify-content: center;
    margin: 0 auto 1rem;
    letter-spacing: 0.12em;
  }

  .scroll-progress {
    display: none;
  }

  .scroll-content {
    position: relative;
    inset: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: min(92vw, 560px);
    margin: 0 auto;
    pointer-events: auto;
  }

  .scroll-card {
    position: relative !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    left: auto !important;
    width: 100% !important;
    margin: 0 !important;
  }

  .scroll-card::after {
    display: none;
  }

  .quote-card,
  .stats-card {
    padding: 1rem;
  }

  .scroll-card.centered {
    margin-left: 0 !important;
    text-align: center;
  }

  .image-card .img-rect {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 4 / 3;
  }

  .img-caption {
    font-size: 12px;
  }
}
</style>
