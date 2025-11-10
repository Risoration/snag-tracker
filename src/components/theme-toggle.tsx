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
      className='inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
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
