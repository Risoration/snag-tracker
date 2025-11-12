'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export function NavBar({
  activeView,
  onSelect,
}: {
  activeView: 'form' | 'register';
  onSelect: (view: 'form' | 'register') => void;
}) {
  const VIEW_OPTIONS: Array<{
    id: 'form' | 'register';
    label: string;
    description: string;
  }> = [
    {
      id: 'form',
      label: 'Snag form',
      description: 'Capture a new snag and run an instant analysis.',
    },
    {
      id: 'register',
      label: 'Snag register',
      description: 'Review, filter, and export the full snag register.',
    },
  ];
  const renderToggle = (
    option: (typeof VIEW_OPTIONS)[number],
    isCompact = false
  ) => {
    const isActive = activeView === option.id;
    return (
      <button
        key={option.id}
        type='button'
        onClick={() => onSelect(option.id)}
        className={[
          'hb-pill',
          isActive ? 'hb-pill--active' : '',
          isCompact
            ? 'flex-1 text-[0.85rem]'
            : 'text-sm uppercase tracking-wide',
        ].join(' ')}
      >
        {option.label}
      </button>
    );
  };
  return (
    <nav className='flex flex-row justify-betweensticky top-0 z-50 border-b border-transparent bg-[color:var(--hb-bg)] transition'>
      <div className='mx-auto flex w-full flex-row items-center justify-start px-6 py-6'>
        <div className='flex flex-col gap-1 leading-none'>
          <span className='text-[11px] font-semibold uppercase tracking-[0.4em] text-[color:var(--hb-accent)]'>
            Homes by Honey
          </span>
          <span className='text-xl font-semibold text-[color:var(--hb-text)]'>
            Snag Tracker
          </span>
        </div>

        {VIEW_OPTIONS.map((option) => (
          <div
            key={option.id}
            className={[
              'flex items-center justify-center px-4 gap-4 rounded-2xl transition-all',
              activeView === option.id
                ? 'border-[color:var(--hb-accent)] shadow-md'
                : '',
            ].join(' ')}
            title={option.description}
          >
            {renderToggle(option)}
          </div>
        ))}
      </div>
      <div className='flex items-center gap-3'>
        <ThemeToggle />
      </div>
    </nav>
  );
}
