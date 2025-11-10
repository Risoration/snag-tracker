'use client';

import type { AnalysisPreview, PriorityFilter } from '@/types/snag';

interface AnalysisPanelProps {
  preview: AnalysisPreview | null;
}

export function AnalysisPanel({ preview }: AnalysisPanelProps) {
  const previewForm = preview?.form;
  const previewResult = preview?.result;

  return (
    // Results card mirrors the form analysis output.
    <aside className='flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-inner shadow-slate-900/5 transition-colors dark:border-slate-800 dark:bg-slate-900/40 dark:shadow-black/30'>
      <div>
        <h2 className='text-lg font-semibold text-slate-900 transition-colors dark:text-slate-100'>
          Analysis
        </h2>
        <p className='text-sm text-slate-500 transition-colors dark:text-slate-400'>
          {previewResult
            ? 'Latest interpretation from the rules engine.'
            : 'Results appear after you analyse a snag.'}
        </p>
      </div>

      {previewResult ? (
        <div className='flex flex-col gap-5'>
          <div className='grid grid-cols-2 gap-3'>
            {/* Key headline metrics */}
            <InfoTile
              label='Priority'
              value={previewResult.priority}
              tone={priorityTone(previewResult.priority)}
            />
            <InfoTile label='Trade' value={previewResult.trade} />
            <InfoTile label='Due date' value={previewResult.dueDate} />
            <InfoTile label='Defect keyword' value={previewResult.defectType} />
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white/80 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-500 transition-colors dark:text-slate-400'>
              30-word summary
            </h3>
            <p className='mt-2 text-sm text-slate-600 transition-colors dark:text-slate-200'>
              {previewResult.summary || 'No summary available.'}
            </p>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 transition-colors dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-300'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-500 transition-colors dark:text-slate-400'>
              Snag context
            </h3>
            <ul className='mt-3 space-y-1 text-slate-600 transition-colors dark:text-slate-200'>
              {previewForm?.title ? (
                <li>
                  <span className='text-slate-500 transition-colors dark:text-slate-400'>
                    Title:
                  </span>{' '}
                  {previewForm.title}
                </li>
              ) : null}
              {previewForm?.plot ? (
                <li>
                  <span className='text-slate-500 transition-colors dark:text-slate-400'>
                    Plot:
                  </span>{' '}
                  {previewForm.plot}
                </li>
              ) : null}
              {previewForm?.development ? (
                <li>
                  <span className='text-slate-500 transition-colors dark:text-slate-400'>
                    Development:
                  </span>{' '}
                  {previewForm.development}
                </li>
              ) : null}
              {preview?.analysedAt ? (
                <li>
                  <span className='text-slate-500 transition-colors dark:text-slate-400'>
                    Analysed:
                  </span>{' '}
                  {new Date(preview.analysedAt).toLocaleString()}
                </li>
              ) : null}
            </ul>
          </div>

          {previewForm?.photoUrl ? (
            <div className='rounded-2xl border border-slate-200 bg-white/80 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-slate-500 transition-colors dark:text-slate-400'>
                Photo preview
              </h3>
              <div className='mt-3 overflow-hidden rounded-xl border border-slate-200 transition-colors dark:border-slate-800'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewForm.photoUrl}
                  alt={previewForm.title || 'Snag photo'}
                  className='h-48 w-full object-cover'
                  onError={(event) => {
                    event.currentTarget.src =
                      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=60';
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className='rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400'>
          Fill in the snag details and hit Analyse to generate structured
          insights.
        </div>
      )}
    </aside>
  );
}

function InfoTile({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'positive' | 'warning' | 'danger';
}) {
  const toneClasses: Record<
    'default' | 'positive' | 'warning' | 'danger',
    string
  > = {
    default:
      'border-slate-200 bg-white text-slate-900 transition-colors dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100',
    positive:
      'border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200',
    warning:
      'border-amber-200 bg-amber-50 text-amber-700 transition-colors dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200',
    danger:
      'border-rose-200 bg-rose-50 text-rose-700 transition-colors dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-200',
  };

  const labelClasses: Record<
    'default' | 'positive' | 'warning' | 'danger',
    string
  > = {
    default: 'text-slate-500 transition-colors dark:text-slate-400',
    positive: 'text-emerald-600 transition-colors dark:text-emerald-300',
    warning: 'text-amber-600 transition-colors dark:text-amber-300',
    danger: 'text-rose-600 transition-colors dark:text-rose-300',
  };

  const valueClasses: Record<
    'default' | 'positive' | 'warning' | 'danger',
    string
  > = {
    default: 'text-slate-900 transition-colors dark:text-slate-100',
    positive: 'text-emerald-700 transition-colors dark:text-emerald-100',
    warning: 'text-amber-700 transition-colors dark:text-amber-100',
    danger: 'text-rose-700 transition-colors dark:text-rose-100',
  };

  return (
    <div
      className={[
        'flex flex-col gap-1 rounded-2xl border p-4',
        toneClasses[tone],
      ].join(' ')}
    >
      <span
        className={[
          'text-xs font-semibold uppercase tracking-wide',
          labelClasses[tone],
        ].join(' ')}
      >
        {label}
      </span>
      <span className={['text-lg font-semibold', valueClasses[tone]].join(' ')}>
        {value}
      </span>
    </div>
  );
}

function priorityTone(priority: PriorityFilter) {
  switch (priority) {
    case 'High':
      return 'danger';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'positive';
    default:
      return 'default';
  }
}
