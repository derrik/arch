import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem('arch-theme');
  return stored === 'dark' || stored === 'light' ? stored : null;
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme() ?? getSystemTheme();
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      // OS theme changed — clear any manual override and follow OS
      localStorage.removeItem('arch-theme');
      setThemeState(getSystemTheme());
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('arch-theme', next);
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
