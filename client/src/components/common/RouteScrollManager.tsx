import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollToPageTop = (behavior: ScrollBehavior = 'auto') => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: prefersReducedMotion() ? 'auto' : behavior,
  });
};

export const RouteScrollManager = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual';

    if (location.hash) {
      const elementId = decodeURIComponent(location.hash.slice(1));

      window.requestAnimationFrame(() => {
        document.getElementById(elementId)?.scrollIntoView({
          behavior: prefersReducedMotion() ? 'auto' : 'smooth',
          block: 'start',
        });
      });

      return;
    }

    window.requestAnimationFrame(() => scrollToPageTop('auto'));
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const handleInternalLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element
          ? target.closest<HTMLAnchorElement>('a[href]')
          : null;

      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) {
        return;
      }

      const destination = new URL(anchor.href, window.location.href);

      if (destination.origin !== window.location.origin || destination.hash) {
        return;
      }

      // This also handles links to the route that is already open,
      // such as clicking "Home" while the visitor is at the footer.
      window.requestAnimationFrame(() => scrollToPageTop('smooth'));
    };

    document.addEventListener('click', handleInternalLinkClick, true);

    return () => {
      document.removeEventListener('click', handleInternalLinkClick, true);
    };
  }, []);

  return null;
};