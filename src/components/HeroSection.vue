<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import ParticleCanvas from './ParticleCanvas.vue'

const nameEl = ref(null)
const scrollLayer = ref(null)
const progressEl = ref(null)

let scrollHandler = null
let rafId = 0
let sectionsByAnchor = new Map()

const revealedSections = new Set()
/** Total wipe duration per card (overlay opacity/mask 0% → 100% transparent, left → right). */
const REVEAL_DURATION_MS = 2500
/** Left-to-right order when a section has multiple cards (kept small vs. wipe time). */
const STAGGER_MS = 80
const REVEAL_FROM_BOTTOM_VH = 0.2

const YOUTUBE_VIDEO_ID = '9iHbUniBWqI'
const youtubeEmbedSrc = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&enablejsapi=0`
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

// Reveal: card stays fixed; ::after mask sweeps left→right (opaque → transparent, content appears).
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

  // Double rAF so the browser applies initial overlay state before animating.
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

  if (nameEl.value) {
    const dy = Math.max(-60, Math.min(60, sy * 0.05))
    nameEl.value.style.transform = `translate(-50%, calc(-50% + ${dy}px))`
  }

  if (progressEl.value) {
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1
    const p = Math.max(0, Math.min(1, sy / max))
    progressEl.value.style.transform = `scaleX(${p})`
  }
}

const setupCardSections = () => {
  const root = scrollLayer.value?.closest('.hero')
  if (!root) return

  sectionsByAnchor = new Map()
  for (const card of root.querySelectorAll('.scroll-content .scroll-card')) {
    const anchor = card.dataset.sectionAnchor
    if (!sectionsByAnchor.has(anchor)) sectionsByAnchor.set(anchor, [])
    sectionsByAnchor.get(anchor).push(card)
  }
}

onMounted(() => {
  const root = scrollLayer.value?.closest('.hero')
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
    // Mobile uses a simple vertical layout, so reveal all cards immediately.
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
  <main class="hero">
    <ParticleCanvas />

    <h1 ref="nameEl" class="giant-name" aria-label="Thomas">Thomas</h1>

    <aside class="sidebar" aria-label="Primary">
      <a href="#" class="logo-mark" data-hover aria-label="Thomas home">
        <img src="/images/logo.png" alt="" width="28" height="28" />
      </a>
      <a href="#" class="circle-icon" data-hover aria-label="Information">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4M12 16h0" stroke-linecap="round" />
        </svg>
      </a>
      <span class="vline" aria-hidden="true" />
      <a href="#" class="side-text" data-hover>EN</a>
    </aside>

    <a href="https://youtu.be/9iHbUniBWqI?si=1wlnjetebWr0HsJ2" target="_blank" class="spotify" data-hover>
      <span class="spotify-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="12" fill="#1DB954" />
          <path
            d="M17.4 16.5a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.55-1.04 8.47-.59 11.66 1.34.35.21.46.68.25 1.03zm1.43-2.85a.94.94 0 0 1-1.29.31c-3.23-1.99-8.16-2.57-11.99-1.4a.94.94 0 1 1-.55-1.8c4.38-1.34 9.81-.7 13.52 1.59.44.27.58.86.31 1.3zm.13-2.97c-3.87-2.3-10.27-2.51-13.97-1.39a1.13 1.13 0 1 1-.66-2.16c4.25-1.29 11.31-1.04 15.79 1.61a1.13 1.13 0 0 1-1.16 1.94z"
            fill="#fff"
          />
        </svg>
      </span>
      <span class="spotify-text">Creative Production • Music • Software Engineering • Digital Innovation</span>
    </a>

    <div class="scroll-progress" aria-hidden="true">
      <span ref="progressEl" class="scroll-progress-bar" />
    </div>

    <div class="meta-top-left">
      <span class="dot-live" aria-hidden="true" />
      <span>Minneapolis, Minnesota · 2026</span>
    </div>
    <div class="meta-top-right">
      BOXCAR VON PRODUCTIONS — MYTH ANTHROPIX &nbsp;/&nbsp; <span class="gold">VOL.01</span>
    </div>

    <!-- <div class="scroll-content">
      <article
        class="scroll-card video-card"
        data-section-anchor="5"
        :style="{ top: '0vh', left: '0vw', width: '100vw', height: '100vh' }"
        aria-label="Background video"
      >
        <div class="youtube-wrap">
          <iframe
            class="youtube-iframe"
            :src="youtubeEmbedSrc"
            title=""
            tabindex="-1"
            frameborder="0"
            allow="autoplay; encrypted-media"
            loading="lazy"
          />
        </div>
      </article>
    </div> -->

    <div ref="scrollLayer" class="scroll-content">
      <article
        class="scroll-card quote-card"
        data-section-anchor="5"
        :style="{ top: '5vh', left: '5vw', width: '240px' }"
      >
        <div class="card-corner">01</div>
        <p class="quote-text">
          Boxcar von productions — <span class="gold">Myth Anthropix</span>
        </p>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="5"
        :style="{ top: '5vh', right: '5vw', width: '240px' }"
      >
        <div class="stats-head">
          <span>Hero Section</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Building Sound, Stories, and Software</div>
        <div class="stats-value">Professional Musician & Software Engineer</div>
      </article>

      <article
        class="scroll-card image-card"
        data-section-anchor="85"
        :style="{ top: '55vh', left: '5vw' }"
      >
        <div class="img-rect" style="width: 600px; height: 320px;">
          <span class="img-tag">ABOUT</span>
          <img src="/images/band1.jpg" alt="" class="img-rect-img" />
        </div>
        <div class="img-caption">A multidisciplinary creator working at the intersection of music and technology.</div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="85"
        :style="{ top: '55vh', right: '8vw', width: '280px' }"
      >
        <div class="card-corner">02</div>
        <p class="quote-text">
          I CREATE IMMERSIVE MUSIC EXPERIENCES, DIGITAL PRODUCTS, AND <span class="gold">SOFTWARE</span>
        </p>
      </article>

      <article
        class="scroll-card image-card"
        data-section-anchor="130"
        :style="{ top: '108vh', right: '6vw' }"
      >
        <div class="img-rect" style="width: 320px; height: 420px;">
          <span class="img-tag">ME</span>
          <img src="/images/me.jpg" alt="" class="img-rect-img" />
        </div>
        <div class="img-caption">An artist and engineer blending creativity, performance, and technology.</div>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="174"
        :style="{ top: '108vh', left: '5vw', width: '260px' }"
      >
        <div class="stats-head">
          <span>Services</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Music & Creative Production</div>
        <div class="stats-value">Music Production · Audio Engineering · Sound Design · Mixing & Mastering</div>
      </article>

      <article
        class="scroll-card image-card"
        data-section-anchor="174"
        :style="{ top: '150vh', left: '5vw' }"
      >
        <div class="img-rect" style="width: 280px; height: 360px;">
          <span class="img-tag">SOFTWARE ENGINEERING</span>
          <img src="/images/band2.jpg" alt="" class="img-rect-img" />
        </div>
        <div class="img-caption">Full stack web development, APIs, cloud infrastructure, and technical consulting.</div>
      </article>

      <article
        class="scroll-card quote-card centered"
        data-section-anchor="174"
        :style="{ top: '178vh', width: '300px' }"
      >
        <div class="card-corner">03</div>
        <p class="quote-text">
          CREATIVITY MEETS <span class="gold">ENGINEERING</span>
        </p>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="261"
        :style="{ top: '208vh', left: '5vw', width: '300px' }"
      >
        <div class="stats-head">
          <span>Featured Skills</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Technical Skills</div>
        <div class="stats-value">
          JavaScript / Node.js <br> React <br> API Development <br> Cloud &amp; Server Infrastructure <br>
          Database Systems <br> Real-Time Streaming <br> Frontend &amp; Backend Development <br>
          Performance Optimization
        </div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="261"
        :style="{ top: '222vh', right: '7vw', width: '300px' }"
      >
        <div class="card-corner">04</div>
        <p class="quote-text">
          CREATIVE SKILLS: COMPOSITION, AUDIO PRODUCTION, SOUND DESIGN, BRANDING, LIVE <span class="gold">PERFORMANCE</span>
        </p>
      </article>

      <article
        class="scroll-card image-card"
        data-section-anchor="351"
        :style="{ top: '284vh', right: '8vw' }"
      >
        <div class="img-rect" style="width: 540px; height: 300px;">
          <!-- <span class="img-tag">PHOTO 03</span> -->
          <img src="/images/engineer.jpg" alt="" class="img-rect-img" />
        </div>
        <div class="img-caption">Selected Work: Creative productions, technical projects, and digital experiences.</div>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="351"
        :style="{ top: '312vh', left: '5vw', width: '260px' }"
      >
        <div class="card-corner">05</div>
        <p class="quote-text">
          LET'S BUILD SOMETHING <span class="gold">MEANINGFUL</span>
        </p>
      </article>

      <article
        class="scroll-card quote-card"
        data-section-anchor="351"
        :style="{ top: '292vh', left: '5vw', width: '330px' }"
      >
        <div class="card-corner">06</div>
        <p class="quote-text">
          PROFESSIONAL, CREATIVE, AND TECHNICALLY SHARP — A UNIQUE CREATIVE
          <span class="gold">VISION</span>
        </p>
      </article>
      <article
        class="scroll-card image-card"
        data-section-anchor="351"
        :style="{ top: '342vh', left: '5vw' }"
      >
        <div class="img-rect" style="width: 540px; height: 300px;">
          <img src="/images/band3.jpg" alt="" class="img-rect-img" />
        </div>
        <div class="img-caption">Full stack web development, APIs, cloud infrastructure, and technical consulting.</div>
      </article>

      <article
        class="scroll-card stats-card"
        data-section-anchor="351"
        :style="{ top: '342vh', left: '67vw', width: '300px' }"
      >
        <div class="stats-head">
          <span>Short Bio</span>
          <span class="stats-arrow" aria-hidden="true">↗</span>
        </div>
        <div class="stats-label">Minneapolis-based</div>
        <div class="stats-value">Combining artistic vision with technical expertise to build meaningful digital experiences.</div>
      </article>
    </div>
  </main>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  max-width: 1680px;
  margin-inline: auto;
  height: 400vh;
  background: #0a0a0a;
  color: #fff;
  overflow: hidden;
}

.giant-name {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-weight: 800;
  font-size: clamp(120px, 18vw, 220px);
  line-height: 0.9;
  letter-spacing: -0.02em;
  color: #ffffff;
  z-index: 10;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  opacity: 0;
  animation: name-fade 1s ease-out 0.15s forwards;
  text-shadow: 0 0 80px rgba(201, 168, 76, 0.05);
}

@keyframes name-fade {
  to {
    opacity: 1;
  }
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

.logo-mark {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  text-decoration: none;
  transition: opacity 0.3s ease;
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
  text-decoration: none;
  transition: opacity 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

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
  text-decoration: none;
  transition: color 0.3s ease;
}

.side-text:hover {
  color: #fff;
}

.spotify {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 30;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.6);
  transition: color 0.3s ease, opacity 0.3s ease;
}

.spotify:hover {
  color: #fff;
  opacity: 1;
}

.spotify-icon {
  display: inline-flex;
  width: 20px;
  height: 20px;
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

/* Scroll reveal: fixed card; ::after hides content, then mask sweeps L→R (0% → 100% transparent). */
.scroll-card {
  position: absolute;
  pointer-events: auto;
  overflow: hidden;
  isolation: isolate;
}

.scroll-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  background: #0a0a0a;
  opacity: 1;
  --reveal-p: 0%;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent var(--reveal-p),
    #000 var(--reveal-p)
  );
  mask-image: linear-gradient(
    to right,
    transparent var(--reveal-p),
    #000 var(--reveal-p)
  );
  transition:
    --reveal-p var(--reveal-duration, 1.5s) cubic-bezier(0.22, 1, 0.36, 1),
    opacity var(--reveal-duration, 1.5s) cubic-bezier(0.22, 1, 0.36, 1);
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
  position: absolute;
}

.video-card {
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #0a0a0a;
  position: absolute;
}

.youtube-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  pointer-events: none;
}

.youtube-iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 280%;
  height: 280%;
  border: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
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
  position: absolute;
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
  position: absolute;
}

.img-rect {
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.0) 70%),
    repeating-linear-gradient(
      45deg,
      #1a1a1a 0px,
      #1a1a1a 2px,
      #161616 2px,
      #161616 4px
    ),
    #1a1a1a;
  filter: grayscale(1) contrast(0.95);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.img-rect::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 30% 20%,
    rgba(255, 255, 255, 0.06),
    transparent 60%
  );
  pointer-events: none;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  text-transform: none;
}

@media (max-width: 720px) {
  .hero {
    height: auto;
    min-height: 100vh;
    overflow: visible;
    padding: 1rem 0 2rem;
  }

  .giant-name {
    position: relative;
    top: auto;
    left: auto;
    transform: none !important;
    font-size: clamp(72px, 24vw, 120px);
    text-align: center;
    margin: 0 auto 1rem;
    z-index: 1;
  }

  .sidebar,
  .meta-top-right,
  .spotify {
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
  }

  .image-card {
    display: block;
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
