import gsap from 'gsap';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function revealElement(element: Element, reducedMotion = prefersReducedMotion()): gsap.core.Tween {
  return gsap.fromTo(element, { autoAlpha: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 24 }, { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : 0.7, ease: 'power2.out' });
}
