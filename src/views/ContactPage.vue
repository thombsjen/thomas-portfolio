<script setup>
import { reactive, ref } from 'vue'
import ParticleCanvas from '../components/ParticleCanvas.vue'
import { useScrollGallery } from '../composables/useScrollGallery.js'
import { contactConfig } from '../config/contact.js'
import { buildContactEmail } from '../utils/contactEmailTemplate.js'
import '../styles/scroll-gallery.css'

const { scrollLayer, progressEl } = useScrollGallery('contact-page')

const form = reactive({
  name: '',
  email: '',
  message: '',
})

const honeypot = ref('')
const status = ref('idle')
const errorMessage = ref('')

const formEnabled = Boolean(
  contactConfig.formEndpoint?.trim() && contactConfig.bearerToken?.trim(),
)

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.message = ''
}

const onSubmit = async () => {
  if (!formEnabled || status.value === 'sending') return

  if (honeypot.value) return

  const name = form.name.trim()
  const email = form.email.trim()
  const message = form.message.trim()

  if (!name || !email || !message) {
    status.value = 'error'
    errorMessage.value = 'Please fill in all fields.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    status.value = 'error'
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  status.value = 'sending'
  errorMessage.value = ''

  try {
    const subject = `Portfolio contact from ${name}`
    const { text, html } = buildContactEmail({ name, email, message })

    const response = await fetch(contactConfig.formEndpoint.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${contactConfig.bearerToken.trim()}`,
      },
      body: JSON.stringify({
        to: contactConfig.email,
        subject,
        from: email,
        text,
        html,
      }),
    })

    if (!response.ok) {
      throw new Error('Submission failed')
    }

    resetForm()
    status.value = 'success'
  } catch {
    status.value = 'error'
    errorMessage.value = 'Something went wrong. Please try again or email directly.'
  }
}
</script>

<template>
  <main class="contact-page gallery-page">
    <ParticleCanvas />

    <aside class="sidebar" aria-label="Primary">
      <RouterLink to="/" class="logo-mark" data-hover aria-label="Thomas home">
        <img src="/images/logo.png" alt="" width="28" height="28" />
      </RouterLink>
      <RouterLink to="/contact" class="circle-icon is-active" data-hover aria-label="Contact">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 6h16M4 12h16M4 18h10" stroke-linecap="round" />
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
      <span>{{ contactConfig.location }} · 2026</span>
    </div>
    <div class="meta-top-right">
      BOXCAR VON PRODUCTIONS — MYTH ANTHROPIX &nbsp;/&nbsp; <span class="gold">CONTACT</span>
    </div>

    <header class="page-header">
      <p class="page-eyebrow">Get in touch</p>
      <h1 class="page-title">Contact</h1>
      <p class="page-lead">
        For music projects, software work, and collaborations — send a message below.
      </p>
    </header>

    <div ref="scrollLayer" class="gallery-body">
      <section class="gallery-section">
        <div class="contact-layout">
          <form
            class="contact-form quote-card gallery-reveal"
            novalidate
            @submit.prevent="onSubmit"
          >
            <div class="form-head">
              <span class="form-title">Send a message</span>
              <span class="stats-arrow" aria-hidden="true">↗</span>
            </div>

            <div class="form-field hp-field" aria-hidden="true">
              <label for="contact-website">Website</label>
              <input
                id="contact-website"
                v-model="honeypot"
                type="text"
                name="website"
                tabindex="-1"
                autocomplete="off"
              />
            </div>

            <div class="form-field">
              <label for="contact-name">Name</label>
              <input
                id="contact-name"
                v-model="form.name"
                type="text"
                name="name"
                autocomplete="name"
                required
                :disabled="status === 'sending'"
              />
            </div>

            <div class="form-field">
              <label for="contact-email">Email</label>
              <input
                id="contact-email"
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                required
                :disabled="status === 'sending'"
              />
            </div>

            <div class="form-field">
              <label for="contact-message">Message</label>
              <textarea
                id="contact-message"
                v-model="form.message"
                name="message"
                rows="5"
                required
                :disabled="status === 'sending'"
              />
            </div>

            <p v-if="status === 'success'" class="form-feedback form-feedback--success" role="status">
              Message sent — thank you. I'll get back to you soon.
            </p>
            <p v-else-if="status === 'error'" class="form-feedback form-feedback--error" role="alert">
              {{ errorMessage }}
            </p>
            <p v-else-if="!formEnabled" class="form-feedback form-feedback--hint">
              Form not configured yet — add your endpoint in
              <code>src/config/contact.js</code>.
            </p>

            <button
              type="submit"
              class="form-submit"
              data-hover
              :disabled="!formEnabled || status === 'sending'"
            >
              {{ status === 'sending' ? 'Sending…' : 'Send message' }}
            </button>
          </form>

          <aside class="contact-aside">
            <article class="quote-card gallery-reveal">
              <div class="stats-label contact-label">Location</div>
              <p class="contact-location">{{ contactConfig.location }}</p>
              <p class="contact-note">{{ contactConfig.availability }}</p>
            </article>

            <article v-if="contactConfig.email" class="stats-card gallery-reveal">
              <div class="stats-head">
                <span>Direct</span>
                <span class="stats-arrow" aria-hidden="true">↗</span>
              </div>
              <div class="stats-label">Email</div>
              <div class="stats-value">
                <a
                  :href="`mailto:${contactConfig.email}`"
                  class="contact-link"
                  data-hover
                >
                  {{ contactConfig.email }}
                </a>
              </div>
            </article>
          </aside>
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

.contact-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.85fr);
  gap: clamp(0.85rem, 2vw, 1.25rem);
  align-items: start;
  max-width: 960px;
}

.contact-aside {
  display: flex;
  flex-direction: column;
  gap: clamp(0.85rem, 2vw, 1.25rem);
}

.quote-card {
  position: relative;
  background: rgba(14, 14, 14, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: clamp(1.1rem, 2.5vw, 1.5rem);
  border-radius: 2px;
}

.stats-card {
  background: #c9a84c;
  color: #0a0a0a;
  padding: clamp(1.1rem, 2.5vw, 1.5rem);
  border-radius: 2px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.form-title {
  font-size: 10.5px;
  letter-spacing: 0.18em;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.stats-arrow {
  font-size: 14px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.35);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-field label {
  font-size: 10px;
  letter-spacing: 0.16em;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: 0.65rem 0.75rem;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 2px;
  transition: border-color 0.2s ease, background 0.2s ease;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: rgba(255, 255, 255, 0.25);
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: rgba(201, 168, 76, 0.55);
  background: rgba(255, 255, 255, 0.06);
}

.form-field input:disabled,
.form-field textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-field textarea {
  resize: vertical;
  min-height: 7rem;
}

.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.form-feedback {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.03em;
  line-height: 1.5;
}

.form-feedback--success {
  color: #c9a84c;
}

.form-feedback--error {
  color: #e88a8a;
}

.form-feedback--hint {
  color: rgba(255, 255, 255, 0.4);
}

.form-feedback--hint code {
  font-size: 11px;
  color: rgba(201, 168, 76, 0.85);
}

.form-submit {
  align-self: flex-start;
  margin-top: 0.25rem;
  padding: 0.7rem 1.35rem;
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0a0a0a;
  background: #c9a84c;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.25s ease, opacity 0.25s ease;
}

.form-submit:hover:not(:disabled) {
  background: #e8c87a;
}

.form-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
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

.contact-link {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.contact-label {
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 0.75rem;
}

.contact-location {
  margin: 0 0 1rem;
  font-family: 'Playfair Display', ui-serif, Georgia, serif;
  font-weight: 700;
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #fff;
}

.contact-note {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.04em;
  line-height: 1.6;
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

@media (max-width: 1024px) {
  .contact-layout {
    grid-template-columns: 1fr;
    max-width: none;
  }
}
</style>
