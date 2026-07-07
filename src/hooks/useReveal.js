import { useEffect, useRef } from 'react';

/**
 * Returns a ref. When the element enters the viewport it gets the
 * `revealed` class added (the base `reveal` class is also applied on mount).
 *
 * Pairs with the `.reveal` / `.revealed` CSS in App.css.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('reveal', 'revealed');
      return;
    }

    el.classList.add('reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
