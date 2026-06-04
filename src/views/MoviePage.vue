<script setup>
import ParticleCanvas from '../components/ParticleCanvas.vue'
import { useScrollGallery } from '../composables/useScrollGallery.js'
import { movieConfig, movieSections } from '../config/movies.js'
import '../styles/scroll-gallery.css'

const { scrollLayer, progressEl } = useScrollGallery('movie-page')

const youtubeEmbedSrc = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`

const youtubeWatchUrl = (id) => `https://youtu.be/${id}`

const richText = (html) =>
  html.replace(/<gold>/g, '<span class="gold">').replace(/<\/gold>/g, '</span>')

const mediaStyle = (ratio) => ({ '--media-ratio': ratio })

const spanClass = (span) => (span ? `gallery-item--span-${span}` : undefined)
</script>

<template>
  <main class="movie-page gallery-page">
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

    <div ref="scrollLayer" class="gallery-body">
      <section
        v-for="section in movieSections"
        :key="section.id"
        class="gallery-section"
      >
        <div v-if="section.cards" class="section-cards">
          <article class="quote-card gallery-reveal">
            <div class="card-corner">{{ section.cards.quote.corner }}</div>
            <p class="quote-text" v-html="richText(section.cards.quote.text)" />
          </article>
          <article class="stats-card gallery-reveal">
            <div class="stats-head">
              <span>{{ section.cards.stats.heading }}</span>
              <span class="stats-arrow" aria-hidden="true">↗</span>
            </div>
            <div class="stats-label">{{ section.cards.stats.label }}</div>
            <div class="stats-value">{{ section.cards.stats.value }}</div>
          </article>
        </div>

        <div v-if="section.band" class="section-band">
          <article class="quote-card gallery-reveal">
            <div class="card-corner">{{ section.band.corner }}</div>
            <p class="quote-text" v-html="richText(section.band.text)" />
          </article>
        </div>

        <div
          v-if="section.videos?.length"
          class="gallery-grid"
          :class="`gallery-grid--${section.grid}`"
        >
          <article
            v-for="video in section.videos"
            :key="video.title + video.tag"
            class="gallery-item video-card gallery-reveal"
            :class="spanClass(video.span)"
          >
            <div class="video-rect media-rect" :style="mediaStyle(video.ratio)">
              <span class="img-tag">{{ video.tag }}</span>

              <div v-if="video.embed" class="youtube-wrap">
                <iframe
                  class="youtube-iframe"
                  :src="youtubeEmbedSrc(video.youtubeId)"
                  :title="video.title"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  loading="lazy"
                />
              </div>

              <a
                v-else
                :href="youtubeWatchUrl(video.youtubeId)"
                target="_blank"
                rel="noopener noreferrer"
                class="video-poster-link"
                data-hover
                :aria-label="`Watch ${video.title} on YouTube`"
              >
                <img :src="video.poster" :alt="video.title" class="video-poster-img" loading="lazy" />
                <span class="play-btn" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </a>
            </div>
            <div class="video-title">{{ video.title }}</div>
            <div class="img-caption">{{ video.caption }}</div>
          </article>
        </div>

        <div v-if="section.footer" class="section-footer">
          <article class="quote-card gallery-reveal">
            <div class="card-corner">{{ section.footer.quote.corner }}</div>
            <p class="quote-text" v-html="richText(section.footer.quote.text)" />
          </article>
          <article class="stats-card gallery-reveal">
            <div class="stats-head">
              <span>{{ section.footer.stats.heading }}</span>
              <span class="stats-arrow" aria-hidden="true">↗</span>
            </div>
            <div class="stats-label">{{ section.footer.stats.label }}</div>
            <div class="stats-value">{{ section.footer.stats.value }}</div>
          </article>
        </div>
      </section>

      <footer class="gallery-footer gallery-reveal">
        <RouterLink to="/" class="back-link" data-hover>← Back to portfolio</RouterLink>
      </footer>
    </div>
  </main>
</template>

<style scoped>
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

.quote-card {
  position: relative;
  background: rgba(14, 14, 14, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: clamp(1.1rem, 2.5vw, 1.5rem);
  border-radius: 2px;
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
  font-size: clamp(11px, 1.3vw, 13px);
  line-height: 1.5;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #ffffff;
}

.quote-text :deep(.gold) {
  color: #c9a84c;
}

.stats-card {
  background: #c9a84c;
  color: #0a0a0a;
  padding: clamp(1.1rem, 2.5vw, 1.5rem);
  border-radius: 2px;
}

.stats-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 10.5px;
  letter-spacing: 0.18em;
  font-weight: 600;
  margin-bottom: 1.25rem;
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
  font-size: clamp(15px, 1.8vw, 18px);
  line-height: 1.3;
  letter-spacing: -0.01em;
}

.video-card {
  display: block;
}

.video-rect.media-rect {
  background: #141414;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  border-radius: 2px;
}

.youtube-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.youtube-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.video-poster-link {
  position: absolute;
  inset: 0;
  display: block;
  text-decoration: none;
  color: inherit;
}

.video-poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(0.85) contrast(0.95);
  transition: filter 0.35s ease, transform 0.35s ease;
}

.video-poster-link:hover .video-poster-img {
  filter: grayscale(0.25) contrast(1);
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
  width: clamp(44px, 8vw, 56px);
  height: clamp(44px, 8vw, 56px);
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
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  z-index: 3;
}

.video-title {
  margin-top: 0.65rem;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-weight: 700;
  font-size: clamp(13px, 1.5vw, 15px);
  letter-spacing: -0.01em;
  color: rgba(255, 255, 255, 0.92);
}

.img-caption {
  margin-top: 0.35rem;
  font-size: 11px;
  letter-spacing: 0.05em;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.55);
}

.back-link {
  display: inline-block;
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

.gold {
  color: #c9a84c;
}
</style>
