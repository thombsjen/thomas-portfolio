<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import { movieConfig, movieGallery } from '../config/movies.js'

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

const youtubeEmbedSrc = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`

const youtubeWatchUrl = (id) => `https://youtu.be/${id}`

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
  const root = scrollLayer.value?.closest('.movie-page')
  if (!root) return

  sectionsByAnchor = new Map()
  for (const card of root.querySelectorAll('.scroll-content .scroll-card')) {
    const anchor = card.dataset.sectionAnchor
    if (!sectionsByAnchor.has(anchor)) sectionsByAnchor.set(anchor, [])
    sectionsByAnchor.get(anchor).push(card)
  }
}

onMounted(() => {
  const root = scrollLayer.value?.closest('.movie-page')
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
  <main class="movie-page">
    <ParticleCanvas />

    <aside class="sidebar" aria-label="Primary">
      <RouterLink to="/" class="logo-mark" data-hover aria-label="Thomas home">
        <img src="/images/logo.png" alt="" width="28" height="28" />
      </RouterLink>
      <RouterLink to="/movie" class="circle-icon is-active" data-hover aria-label="Movie">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke-linejoin="round" />
          <path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" />
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
      <span>{{ movieConfig.location }} · 2026</span>
    </div>
    <div class="meta-top-right">
      BOXCAR VON PRODUCTIONS — MYTH ANTHROPIX &nbsp;/&nbsp; <span class="gold">MOVIE</span>
    </div>

    <header class="page-header">
      <p class="page-eyebrow">Film &amp; video</p>
      <h1 class="page-title">Movie</h1>
      <p class="page-lead">
        Narrative film, live capture, and visual production — stories in motion from stage to screen.
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
          MOTION, <span class="gold">SOUND</span>, AND STORY — EVERY FRAME HAS A RHYTHM
        </p>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="10"
        :style="{ top: '8vh', right: '5vw', width: '300px' }"
      >
        <div class="stats-head">
          <span>Reel</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Boxcar von productions — Myth Anthropix</div>
        <div class="stats-value">
          Music videos, live films, documentaries, and creative direction for visual media.
        </div>
      </article>

      <article
        v-for="movie in movieGallery"
        :key="movie.tag + movie.title"
        class="scroll-card video-card"
        :data-section-anchor="movie.anchor"
        :style="movie.position"
      >
        <div class="video-rect" :style="movie.rect">
          <span class="img-tag">{{ movie.tag }}</span>

          <div v-if="movie.embed" class="youtube-wrap">
            <iframe
              class="youtube-iframe"
              :src="youtubeEmbedSrc(movie.youtubeId)"
              :title="movie.title"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              loading="lazy"
            />
          </div>

          <a
            v-else
            :href="youtubeWatchUrl(movie.youtubeId)"
            target="_blank"
            rel="noopener noreferrer"
            class="video-poster-link"
            data-hover
            :aria-label="`Watch ${movie.title} on YouTube`"
          >
            <img :src="movie.poster" :alt="movie.title" class="video-poster-img" loading="lazy" />
            <span class="play-btn" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </a>
        </div>
        <div class="video-title">{{ movie.title }}</div>
        <div class="img-caption">{{ movie.caption }}</div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="55"
        :style="{ top: '42vh', right: '6vw', width: '260px' }"
      >
        <div class="card-corner">02</div>
        <p class="quote-text">
          FROM <span class="gold">CONCEPT</span> TO FINAL CUT — CINEMATIC STORYTELLING AT EVERY SCALE
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
          Music videos · Live performance films · Documentaries · Promo reels · Event coverage · Creative direction
        </div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="105"
        :style="{ top: '108vh', right: '7vw', width: '270px' }"
      >
        <div class="card-corner">03</div>
        <p class="quote-text">
          EDITING WITH <span class="gold">INTENT</span> — PACE, TONE, AND VISUAL NARRATIVE
        </p>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="155"
        :style="{ top: '168vh', left: '5vw', width: '300px' }"
      >
        <div class="card-corner">04</div>
        <p class="quote-text">
          MINNEAPOLIS-BASED — MUSIC, MEDIA, AND <span class="gold">FILM</span> PRODUCTION
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
          Music video production · Live event filming · Documentary · Promo content · Post-production
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
.movie-page {
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

.video-card {
  display: block;
}

.video-rect {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0) 70%),
    repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 2px, #161616 2px, #161616 4px),
    #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.video-rect::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.06), transparent 60%);
  pointer-events: none;
  z-index: 1;
}

.youtube-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.youtube-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-poster-link {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.video-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(1) contrast(0.95);
  transition: filter 0.35s ease, transform 0.35s ease;
}

.video-poster-link:hover .video-poster-img {
  filter: grayscale(0.4) contrast(1);
  transform: scale(1.02);
}

.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(201, 168, 76, 0.92);
  color: #0a0a0a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, background 0.3s ease;
}

.video-poster-link:hover .play-btn {
  transform: translate(-50%, -50%) scale(1.08);
  background: #e8c87a;
}

.img-tag {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-size: 9.5px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 500;
  z-index: 3;
}

.video-title {
  margin-top: 0.75rem;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.9);
}

.img-caption {
  margin-top: 0.35rem;
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
  .movie-page {
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

  .video-card .video-rect {
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 16 / 9;
  }

  .img-caption {
    font-size: 12px;
  }
}
</style>
