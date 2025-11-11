'use client';

import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();
  const label =
    theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  const icon = theme === 'dark' ? '🌙' : '☀️';

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className='inline-flex items-center gap-2 rounded-xl border bg-[color:var(--hb-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--hb-text)] transition'
      aria-label={label}
      title={label}
      disabled={!isReady}
    >
      <span aria-hidden className='text-base'>
        {icon}
      </span>
      <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
    </button>
  );
}
