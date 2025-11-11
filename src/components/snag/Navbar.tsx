'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export function NavBar() {
  return (
    <nav className='sticky top-0 z-50 border-b border-transparent bg-[color:var(--hb-bg)] transition'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6'>
        <div className='flex flex-col gap-1 leading-none'>
          <span className='text-[11px] font-semibold uppercase tracking-[0.4em] text-[color:var(--hb-accent)]'>
            Homes by Honey
          </span>
          <span className='text-xl font-semibold text-[color:var(--hb-text)]'>
            Snag Tracker
          </span>
        </div>

        <div className='flex items-center gap-3'>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
