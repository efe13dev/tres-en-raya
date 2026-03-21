import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tres-en-raya-theme';

function getInitialTheme () {
  if (typeof window === 'undefined') {
    return 'dark';
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function useTheme () {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);

    const themeColor = document.querySelector("meta[name='theme-color']");
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'light' ? '#f4f7ff' : '#0b1020');
    }
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  };
}
