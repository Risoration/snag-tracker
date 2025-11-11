'use client';

interface SnagSidebarProps {
  activeView: 'form' | 'register';
  onSelect: (view: 'form' | 'register') => void;
}

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

export function SnagSidebar({ activeView, onSelect }: SnagSidebarProps) {
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
    <div className='flex w-full flex-col gap-5'>
      <div className='flex gap-2 rounded-[26px] bg-[color:var(--hb-surface)] p-3 shadow-sm md:hidden'>
        {VIEW_OPTIONS.map((option) => renderToggle(option, true))}
      </div>

      <aside className='sticky top-28 hidden w-full md:flex'>
        <div className='hb-card hb-card--soft flex w-full flex-col gap-6 md:flex-row md:items-start md:justify-between'>
          <header className='flex max-w-2xl flex-col gap-2'>
            <span className='text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--hb-accent)]'>
              Workspace
            </span>
            <h2 className='text-2xl font-semibold text-[color:var(--hb-text)]'>
              Direct your snagging flow
            </h2>
            <p className='text-sm leading-relaxed text-[color:var(--hb-text-muted)]'>
              Capture build defects, classify the responsible trade, and turn
              site notes into structured actions your handover team can trust.
            </p>
          </header>

          <div className='flex w-full max-w-sm flex-col gap-3 md:w-auto'>
            {VIEW_OPTIONS.map((option) => (
              <div
                key={option.id}
                className={[
                  'flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--hb-border)] bg-[color:var(--hb-surface)] px-4 py-4 transition-all',
                  activeView === option.id
                    ? 'border-[color:var(--hb-accent)] shadow-md'
                    : '',
                ].join(' ')}
              >
                <div>
                  <span className='text-sm font-semibold uppercase tracking-wide text-[color:var(--hb-text)]'>
                    {option.label}
                  </span>
                  <p className='mt-1 text-xs text-[color:var(--hb-text-muted)]'>
                    {option.description}
                  </p>
                </div>
                {renderToggle(option)}
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
