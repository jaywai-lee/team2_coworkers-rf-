import { useEffect, useState } from 'react';
import { debounce } from '../utils/debounce';

export function useResponsive() {
  const getSize = () => {
    if (typeof window === 'undefined') return 'mobile';

    if (window.matchMedia('(min-width: 1024px)').matches) return 'desktop';
    if (window.matchMedia('(min-width: 768px)').matches) return 'tablet';
    return 'mobile';
  };

  const [screen, setScreen] = useState(getSize);

  useEffect(() => {
    const handler = debounce(() => {
      const newSize = getSize();
      setScreen((prev) => (prev !== newSize ? newSize : prev));
    }, 100);

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
      handler.cancel();
    };
  }, []);

  return screen;
}
