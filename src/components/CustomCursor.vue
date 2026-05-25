<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'

const dotEl = ref(null)
const ringEl = ref(null)

let mouseX = -100
let mouseY = -100
let ringX = -100
let ringY = -100

let isHovering = false
let isVisible = false

let ringScale = 1
let ringOpacity = 0
let dotScale = 1
let dotOpacity = 0

let rafId = null

const lerp = (a, b, n) => (1 - n) * a + n * b

const writeDot = () => {
  if (!dotEl.value) return
  dotEl.value.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0) scale(${dotScale})`
  dotEl.value.style.opacity = dotOpacity
}

const onMove = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  if (!isVisible) {
    isVisible = true
    ringX = mouseX
    ringY = mouseY
  }
  writeDot()
}

const onLeave = () => {
  isVisible = false
}

const onEnter = () => {
  isVisible = true
}

const onOver = (e) => {
  if (e.target?.closest?.('a, button, [data-hover]')) {
    isHovering = true
  }
}

const onOut = (e) => {
  if (e.target?.closest?.('a, button, [data-hover]')) {
    isHovering = false
  }
}

const tick = () => {
  ringX = lerp(ringX, mouseX, 0.12)
  ringY = lerp(ringY, mouseY, 0.12)

  const targetRingScale = isHovering ? 2 : 1
  const targetRingOpacity = isVisible ? (isHovering ? 0.4 : 1) : 0
  const targetDotScale = isHovering ? 0 : 1
  const targetDotOpacity = isVisible ? 1 : 0

  ringScale = lerp(ringScale, targetRingScale, 0.18)
  ringOpacity = lerp(ringOpacity, targetRingOpacity, 0.18)
  dotScale = lerp(dotScale, targetDotScale, 0.25)
  dotOpacity = lerp(dotOpacity, targetDotOpacity, 0.25)

  if (ringEl.value) {
    ringEl.value.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0) scale(${ringScale})`
    ringEl.value.style.opacity = ringOpacity
  }
  writeDot()

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseleave', onLeave)
  window.addEventListener('mouseenter', onEnter)
  document.addEventListener('mouseover', onOver, true)
  document.addEventListener('mouseout', onOut, true)
  rafId = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseleave', onLeave)
  window.removeEventListener('mouseenter', onEnter)
  document.removeEventListener('mouseover', onOver, true)
  document.removeEventListener('mouseout', onOut, true)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div ref="ringEl" class="cursor-ring" aria-hidden="true" />
  <div ref="dotEl" class="cursor-dot" aria-hidden="true" />
</template>

<style scoped>
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, opacity;
  mix-blend-mode: difference;
  opacity: 0;
}

.cursor-ring {
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1px solid #ffffff;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  will-change: transform, opacity;
  mix-blend-mode: difference;
  opacity: 0;
}

@media (hover: none) and (pointer: coarse) {
  .cursor-dot,
  .cursor-ring {
    display: none;
  }
}
</style>
