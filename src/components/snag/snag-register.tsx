'use client';

import type { SnagRecord, PriorityFilter } from '@/types/snag';
import type { Priority } from '@/lib/analysis';

interface SnagRegisterProps {
  filteredSnags: SnagRecord[];
  developmentOptions: string[];
  tradeOptions: string[];
  selectedDevelopment: string;
  selectedTrade: string;
  selectedPriority: PriorityFilter;
  searchTerm: string;
  sortAscending: boolean;
  onDevelopmentChange: (value: string) => void;
  onTradeChange: (value: string) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  onSearchChange: (value: string) => void;
  onToggleSort: () => void;
  onExport: () => void;
  onEdit: (snag: SnagRecord) => void;
  onDelete: (id: string) => void;
}

export function SnagRegister({
  filteredSnags,
  developmentOptions,
  tradeOptions,
  selectedDevelopment,
  selectedTrade,
  selectedPriority,
  searchTerm,
  sortAscending,
  onDevelopmentChange,
  onTradeChange,
  onPriorityChange,
  onSearchChange,
  onToggleSort,
  onExport,
  onEdit,
  onDelete,
}: SnagRegisterProps) {
  return (
    // Section housing the filter controls + data table.
    <section
      id='snag-table'
      className='flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-inner shadow-slate-900/5 transition-colors scroll-mt-28 dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-black/30'
    >
      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-lg font-semibold text-slate-900 transition-colors dark:text-slate-100'>
            Snag register
          </h2>
          <p className='text-sm text-slate-500 transition-colors dark:text-slate-400'>
            Filter by development, trade, and priority. Sort by due date, export
            to CSV, or edit entries inline.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button
            type='button'
            onClick={onToggleSort}
            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
          >
            Due date {sortAscending ? '↑' : '↓'}
          </button>
          <button
            type='button'
            onClick={onExport}
            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <FilterSelect
          label='Development'
          value={selectedDevelopment}
          onChange={onDevelopmentChange}
          options={developmentOptions}
        />
        <FilterSelect
          label='Trade'
          value={selectedTrade}
          onChange={onTradeChange}
          options={tradeOptions}
        />
        <FilterSelect
          label='Priority'
          value={selectedPriority}
          onChange={(value) => onPriorityChange(value as PriorityFilter)}
          options={['All', 'High', 'Medium', 'Low']}
        />
        <label className='flex flex-col gap-2'>
          <span className='text-sm font-medium text-slate-600 transition-colors dark:text-slate-300'>
            Search notes
          </span>
          <input
            type='search'
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search title, notes, plot...'
            className='rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
          />
        </label>
      </div>

      {filteredSnags.length ? (
        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-950/40'>
          <div className='max-h-[480px] overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead className='bg-slate-100 text-xs uppercase tracking-wide text-slate-500 transition-colors dark:bg-slate-900/70 dark:text-slate-400'>
                <tr>
                  <th className='px-4 py-3'>Summary</th>
                  <th className='px-4 py-3'>Trade</th>
                  <th className='px-4 py-3'>Priority</th>
                  <th className='px-4 py-3'>Due date</th>
                  <th className='px-4 py-3'>Plot</th>
                  <th className='px-4 py-3'>Development</th>
                  <th className='px-4 py-3'>Notes</th>
                  <th className='px-4 py-3 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100 bg-white text-slate-600 transition-colors dark:divide-slate-800 dark:bg-slate-950/40 dark:text-slate-200'>
                {filteredSnags.map((snag) => (
                  <tr key={snag.id} className='align-top'>
                    <td className='px-4 py-4'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold text-slate-900 transition-colors dark:text-slate-100'>
                          {snag.title}
                        </span>
                        <span className='text-sm text-slate-500 transition-colors dark:text-slate-400'>
                          {snag.summary}
                        </span>
                      </div>
                    </td>
                    <td className='px-4 py-4'>
                      <Chip tone='neutral'>{snag.trade}</Chip>
                    </td>
                    <td className='px-4 py-4'>
                      <Chip tone={priorityTone(snag.priority)}>
                        {snag.priority}
                      </Chip>
                    </td>
                    <td className='px-4 py-4 text-slate-700 transition-colors dark:text-slate-100'>
                      <span className='font-medium'>
                        {humanDate(snag.dueDate)}
                      </span>
                      <span className='block text-xs text-slate-400 transition-colors dark:text-slate-500'>
                        Target
                      </span>
                    </td>
                    <td className='px-4 py-4 text-slate-600 transition-colors dark:text-slate-200'>
                      {snag.plot || '—'}
                    </td>
                    <td className='px-4 py-4 text-slate-600 transition-colors dark:text-slate-200'>
                      {snag.development || '—'}
                    </td>
                    <td className='px-4 py-4 text-slate-500 transition-colors dark:text-slate-300'>
                      <span className='line-clamp-3'>{snag.notes}</span>
                    </td>
                    <td className='px-4 py-4'>
                      <div className='flex justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => onEdit(snag)}
                          className='rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => onDelete(snag.id)}
                          className='rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-rose-600 transition hover:border-rose-400 hover:text-rose-700 dark:border-rose-500/60 dark:text-rose-200 dark:hover:border-rose-500 dark:hover:text-rose-300'
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400'>
          No snags match the current filters. Try widening your search or add a
          new snag using the form above.
        </div>
      )}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='text-sm font-medium text-slate-600 transition-colors dark:text-slate-300'>
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Chip({
  children,
  tone = 'neutral',
}: {
  children: string;
  tone?: 'neutral' | 'positive' | 'warning' | 'danger';
}) {
  const palette: Record<'neutral' | 'positive' | 'warning' | 'danger', string> =
    {
      neutral:
        'border-slate-300 bg-slate-100 text-slate-600 transition-colors dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200',
      positive:
        'border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200',
      warning:
        'border-amber-200 bg-amber-50 text-amber-700 transition-colors dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200',
      danger:
        'border-rose-200 bg-rose-50 text-rose-700 transition-colors dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200',
    };
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        palette[tone],
      ].join(' ')}
    >
      {children}
    </span>
  );
}

function priorityTone(priority: Priority) {
  if (priority === 'High') {
    return 'danger';
  }
  if (priority === 'Medium') {
    return 'warning';
  }
  return 'positive';
}

function humanDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
