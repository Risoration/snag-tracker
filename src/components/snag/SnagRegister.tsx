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
      className='hb-card flex flex-col gap-8 scroll-mt-28'
    >
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex flex-col gap-2'>
          <span className='hb-tag hb-tag--title'>Live register</span>
          <h2 className='text-2xl font-semibold text-[color:var(--hb-text)] dark:text-white'>
            Snag register
          </h2>
          <p className='text-sm leading-relaxed text-[color:var(--hb-text-muted)] dark:text-white/70'>
            Filter by development, trade, and priority. Sort by due date, export
            to CSV, or edit entries inline.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          <button type='button' onClick={onToggleSort} className='hb-pill'>
            Due date {sortAscending ? '↑' : '↓'}
          </button>
          <button
            type='button'
            onClick={onExport}
            className='hb-btn hb-btn--primary'
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
          <span className='text-sm font-medium text-[color:var(--hb-text-muted)] dark:text-white/70'>
            Search notes
          </span>
          <input
            type='search'
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder='Search title, notes, plot...'
            className='hb-input'
          />
        </label>
      </div>

      {filteredSnags.length ? (
        <div className='overflow-hidden rounded-3xl border border-[color:var(--hb-border)] bg-[color:var(--hb-surface-soft)] shadow-lg shadow-black/20 dark:border-white/10 dark:bg-white/5 dark:shadow-black/50'>
          <div className='max-h-[520px] overflow-x-auto'>
            <table className='min-w-full text-left text-sm text-[color:var(--hb-text)] dark:text-white/85'>
              <thead className='bg-[color:var(--hb-surface)] text-xs uppercase tracking-wide text-[color:var(--hb-text-muted)] dark:bg-white/5 dark:text-white/60'>
                <tr>
                  <th className='px-5 py-3 font-semibold'>Summary</th>
                  <th className='px-5 py-3 font-semibold'>Trade</th>
                  <th className='px-5 py-3 font-semibold'>Priority</th>
                  <th className='px-5 py-3 font-semibold'>Due date</th>
                  <th className='px-5 py-3 font-semibold'>Plot</th>
                  <th className='px-5 py-3 font-semibold'>Development</th>
                  <th className='px-5 py-3 font-semibold'>Notes</th>
                  <th className='px-5 py-3 text-right font-semibold'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-[color:var(--hb-border)] bg-[color:var(--hb-surface-soft)] text-[color:var(--hb-text)] dark:divide-white/5 dark:bg-white/5 dark:text-white/85'>
                {filteredSnags.map((snag) => (
                  <tr
                    key={snag.id}
                    className='align-top transition hover:bg-[color:var(--hb-surface)] dark:hover:bg-white/8'
                  >
                    <td className='px-5 py-5'>
                      <div className='flex flex-col gap-1'>
                        <span className='font-semibold text-[color:var(--hb-text)] dark:text-white'>
                          {snag.title}
                        </span>
                        <span className='text-sm text-[color:var(--hb-text-muted)] dark:text-white/70'>
                          {snag.summary}
                        </span>
                      </div>
                    </td>
                    <td className='px-5 py-5'>
                      <Chip tone='neutral'>{snag.trade}</Chip>
                    </td>
                    <td className='px-5 py-5'>
                      <Chip tone={priorityTone(snag.priority)}>
                        {snag.priority}
                      </Chip>
                    </td>
                    <td className='px-5 py-5 text-[color:var(--hb-text)] dark:text-white'>
                      <span className='font-medium'>
                        {humanDate(snag.dueDate)}
                      </span>
                      <span className='block text-xs text-[color:var(--hb-text-muted)] dark:text-white/40'>
                        Target
                      </span>
                    </td>
                    <td className='px-5 py-5 text-[color:var(--hb-text)]/80 dark:text-white/80'>
                      {snag.plot || '—'}
                    </td>
                    <td className='px-5 py-5 text-[color:var(--hb-text)]/80 dark:text-white/80'>
                      {snag.development || '—'}
                    </td>
                    <td className='px-5 py-5 text-[color:var(--hb-text-muted)] dark:text-white/70'>
                      <span className='line-clamp-3'>{snag.notes}</span>
                    </td>
                    <td className='px-5 py-5'>
                      <div className='flex justify-end gap-2'>
                        <button
                          type='button'
                          onClick={() => onEdit(snag)}
                          className='hb-pill'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => onDelete(snag.id)}
                          className='hb-btn hb-btn--ghost border-[color:var(--hb-border)] text-[color:var(--hb-text)] hover:border-[color:var(--hb-accent)] hover:text-[color:var(--hb-accent)] dark:border-white/20 dark:text-white'
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
        <div className='rounded-2xl border border-dashed border-[color:var(--hb-border)] bg-[color:var(--hb-surface-soft)] p-10 text-center text-sm text-[color:var(--hb-text-muted)] dark:border-white/15 dark:bg-white/5 dark:text-white/70'>
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
      <span className='text-sm font-medium text-[color:var(--hb-text-muted)] dark:text-white/70'>
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className='hb-input dark:bg-white/10 dark:text-white'
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
      neutral: 'hb-chip hb-chip--neutral',
      positive: 'hb-chip hb-chip--positive',
      warning: 'hb-chip hb-chip--warning',
      danger: 'hb-chip hb-chip--danger',
    };
  return <span className={palette[tone]}>{children}</span>;
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
