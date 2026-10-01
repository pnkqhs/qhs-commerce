'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
/** Progressive enhancement: HTML is visible without JS; only off-screen sections are animated. */
export function StorefrontMotion() {
  const path = usePathname();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (media.matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove('reveal-pending');
            entry.target.classList.add('reveal-in');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px 20px 0px' },
    );
    nodes.forEach((node) => {
      if (node.getBoundingClientRect().top > window.innerHeight) {
        node.classList.add('reveal-pending');
        observer.observe(node);
      }
    });
    const reduce = () => {
      if (media.matches) {
        nodes.forEach((n) => n.classList.remove('reveal-pending'));
        observer.disconnect();
      }
    };
    media.addEventListener('change', reduce);
    const onScroll = () =>
      document.querySelector('header')?.classList.toggle('is-scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      nodes.forEach((n) => n.classList.remove('reveal-pending'));
      window.removeEventListener('scroll', onScroll);
      media.removeEventListener('change', reduce);
    };
  }, [path]);
  return null;
}
