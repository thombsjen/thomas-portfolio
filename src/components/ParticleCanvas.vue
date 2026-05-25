<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvasEl = ref(null)

const COUNT = 240
const COLORS = ['#c9a84c', '#d4af37', '#e8c87a', '#b8860b']

let ctx = null
let particles = []
let rafId = null
let width = 0
let height = 0
let dpr = 1
let resizeHandler = null

const seedParticles = () => {
  particles = []
  for (let i = 0; i < COUNT; i++) {
    const r = 2.5 + Math.random() * 5.5
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r,
      baseR: r,
      rotation: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.0006 + Math.random() * 0.0014,
    })
  }
}

const drawStar = (x, y, outerR, innerR, rotation) => {
  const spikes = 20
  const step = Math.PI / spikes
  let rot = rotation - Math.PI / 2

  ctx.beginPath()
  ctx.moveTo(x + Math.cos(rot) * outerR, y + Math.sin(rot) * outerR)
  for (let i = 0; i < spikes; i++) {
    rot += step
    ctx.lineTo(x + Math.cos(rot) * innerR, y + Math.sin(rot) * innerR)
    rot += step
    ctx.lineTo(x + Math.cos(rot) * outerR, y + Math.sin(rot) * outerR)
  }
  ctx.closePath()
  ctx.fill()
}

const resize = () => {
  if (!canvasEl.value || !ctx) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  width = window.innerWidth
  height = window.innerHeight
  canvasEl.value.width = Math.floor(width * dpr)
  canvasEl.value.height = Math.floor(height * dpr)
  canvasEl.value.style.width = width + 'px'
  canvasEl.value.style.height = height + 'px'
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
}

const draw = (t) => {
  ctx.clearRect(0, 0, width, height)
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy

    if (p.x < -10) p.x = width + 10
    else if (p.x > width + 10) p.x = -10
    if (p.y < -10) p.y = height + 10
    else if (p.y > height + 10) p.y = -10

    const r = Math.max(0.9, p.baseR + Math.sin(t * p.pulseSpeed + p.phase) * (p.baseR * 0.35))
    const innerR = r * 0.18

    ctx.globalAlpha = p.opacity
    ctx.fillStyle = p.color
    drawStar(p.x, p.y, r, innerR, p.rotation)
  }
  ctx.globalAlpha = 1
  rafId = requestAnimationFrame(draw)
}

onMounted(() => {
  ctx = canvasEl.value.getContext('2d')
  resize()
  seedParticles()
  rafId = requestAnimationFrame(draw)

  resizeHandler = () => {
    resize()
    seedParticles()
  }
  window.addEventListener('resize', resizeHandler)
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <canvas ref="canvasEl" class="particle-canvas" aria-hidden="true" />
</template>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: transparent;
  animation: pc-fade 0.8s ease-out both;
}

@keyframes pc-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
