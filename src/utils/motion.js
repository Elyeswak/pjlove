import confetti from 'canvas-confetti'

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const heart = confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
})

const base = {
  shapes: [heart],
  colors: ['#7a0f1c', '#a3182b', '#ffffff', '#f3d6da', '#1a1a1a'],
  disableForReducedMotion: true,
  zIndex: 200,
}

export function heartBurst(big = false) {
  confetti({ ...base, particleCount: big ? 140 : 70, spread: big ? 160 : 100, scalar: big ? 2.4 : 1.8, origin: { y: 0.65 } })
  if (!big) return
  const end = Date.now() + 1800
  ;(function frame() {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 55, scalar: 2, origin: { x: 0, y: 0.8 } })
    confetti({ ...base, particleCount: 4, angle: 120, spread: 55, scalar: 2, origin: { x: 1, y: 0.8 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

/** The upcoming Sunday (today if it is Sunday), e.g. "November 15". */
export function nextSunday() {
  const d = new Date()
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7))
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}
