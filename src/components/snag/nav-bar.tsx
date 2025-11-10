'use client';

import { ThemeToggle } from '@/components/theme-toggle';

interface NavBarProps {
  onNavigate: (sectionId: string) => void;
}

export function NavBar({ onNavigate }: NavBarProps) {
  return (
    // Sticky header keeps global actions (nav + theme toggle) within reach.
    <nav className='sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-950/80'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4'>
        <div className='flex flex-col leading-none'>
          <span className='text-[10px] font-semibold uppercase tracking-[0.35em] text-emerald-500'>
            Homes by Honey
          </span>
          <span className='text-lg font-semibold text-slate-900 dark:text-slate-100'>
            Snag Tracker
          </span>
        </div>

        <div className='flex items-center gap-3'>
          {/* Jump to the form section */}
          <NavigationButton
            label='Snag form'
            onClick={() => onNavigate('snag-form')}
          />
          {/* Jump to the register section */}
          <NavigationButton
            label='Snag register'
            onClick={() => onNavigate('snag-table')}
          />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

function NavigationButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
    >
      {label}
    </button>
  );
}
