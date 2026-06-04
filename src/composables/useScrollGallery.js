import { onMounted, onBeforeUnmount, ref } from 'vue'

const REVEAL_DURATION_MS = 900
const STAGGER_MS = 90

export function useScrollGallery(pageClass) {
  const scrollLayer = ref(null)
  const progressEl = ref(null)

  let scrollHandler = null
  let rafId = 0
  let revealObserver = null

  const onScroll = () => {
    if (!progressEl.value) return
    const sy = window.scrollY || window.pageYOffset || 0
    const max = (document.documentElement.scrollHeight - window.innerHeight) || 1
    const p = Math.max(0, Math.min(1, sy / max))
    progressEl.value.style.transform = `scaleX(${p})`
  }

  const setupReveals = (root) => {
    revealObserver?.disconnect()

    const items = root?.querySelectorAll('.gallery-reveal') ?? []
    items.forEach((el, index) => {
      el.style.setProperty('--reveal-duration', `${REVEAL_DURATION_MS}ms`)
      el.style.setProperty('--reveal-delay', `${(index % 8) * STAGGER_MS}ms`)
    })

    if (!items.length) return

    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-revealed')
          revealObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    )

    items.forEach((el) => revealObserver.observe(el))
  }

  onMounted(() => {
    const root = scrollLayer.value?.closest(`.${pageClass}`)

    scrollHandler = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        onScroll()
      })
    }
    window.addEventListener('scroll', scrollHandler, { passive: true })
    setupReveals(root)
    onScroll()
  })

  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId)
    revealObserver?.disconnect()
    if (scrollHandler) window.removeEventListener('scroll', scrollHandler)
  })

  return { scrollLayer, progressEl }
}
