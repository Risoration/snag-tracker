'use client';

import type { AnalysisPreview, PriorityFilter } from '@/types/snag';

interface AnalysisPanelProps {
  preview: AnalysisPreview | null;
}

export function AnalysisPanel({ preview }: AnalysisPanelProps) {
  const previewForm = preview?.form;
  const previewResult = preview?.result;

  return (
    <aside className='hb-card hb-card--soft flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <span className='text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--hb-accent)]'>
          Insight
        </span>
        <h2 className='text-xl font-semibold text-[color:var(--hb-text)]'>
          Analysis
        </h2>
        <p className='text-sm leading-relaxed text-[color:var(--hb-text-muted)]'>
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
            <InfoTile
              label='Confidence'
              value={formatConfidence(previewResult.confidence)}
              tone={confidenceTone(previewResult.confidence)}
            />
            <InfoTile label='Due date' value={previewResult.dueDate} />
            <InfoTile label='Defect keyword' value={previewResult.defectType} />
          </div>

          <div className='rounded-2xl border border-[color:var(--hb-border)] bg-[color:var(--hb-surface)] p-4'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-[color:var(--hb-text-muted)]'>
              30-word summary
            </h3>
            <p className='mt-2 text-sm leading-relaxed text-[color:var(--hb-text)]'>
              {previewResult.summary || 'No summary available.'}
            </p>
          </div>

          <div className='rounded-2xl border border-[color:var(--hb-border)] bg-[color:var(--hb-surface)] p-4 text-sm text-[color:var(--hb-text)]'>
            <h3 className='text-sm font-semibold uppercase tracking-wide text-[color:var(--hb-text-muted)]'>
              Snag context
            </h3>
            <ul className='mt-3 space-y-1 text-[color:var(--hb-text-muted)]'>
              {previewForm?.title ? (
                <li>
                  <span className='font-medium text-[color:var(--hb-text)]'>
                    Title:
                  </span>{' '}
                  {previewForm.title}
                </li>
              ) : null}
              {previewForm?.plot ? (
                <li>
                  <span className='font-medium text-[color:var(--hb-text)]'>
                    Plot:
                  </span>{' '}
                  {previewForm.plot}
                </li>
              ) : null}
              {previewForm?.development ? (
                <li>
                  <span className='font-medium text-[color:var(--hb-text)]'>
                    Development:
                  </span>{' '}
                  {previewForm.development}
                </li>
              ) : null}
              {preview?.analysedAt ? (
                <li>
                  <span className='font-medium text-[color:var(--hb-text)]'>
                    Analysed:
                  </span>{' '}
                  {new Date(preview.analysedAt).toLocaleString()}
                </li>
              ) : null}
            </ul>
          </div>

          {previewForm?.photoUrl ? (
            <div className='rounded-2xl border border-[color:var(--hb-border)] bg-[color:var(--hb-surface)] p-4'>
              <h3 className='text-sm font-semibold uppercase tracking-wide text-[color:var(--hb-text-muted)]'>
                Photo preview
              </h3>
              <div className='mt-3 overflow-hidden rounded-xl border border-[color:var(--hb-border)]'>
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
        <div className='rounded-2xl border border-dashed border-[color:var(--hb-border)] bg-[color:var(--hb-surface)]/70 p-6 text-sm text-[color:var(--hb-text-muted)]'>
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
      'border-[color:var(--hb-border)] bg-[color:var(--hb-surface)] text-[color:var(--hb-text)]',
    positive:
      'bg-[rgba(65,180,147,0.12)] border-[rgba(65,180,147,0.35)] text-[#2e6f5a]',
    warning:
      'bg-[rgba(253,200,107,0.15)] border-[rgba(253,200,107,0.42)] text-[#8c5a00]',
    danger:
      'bg-[rgba(255,124,110,0.15)] border-[rgba(255,124,110,0.42)] text-[#8c2c25]',
  };

  const labelClasses: Record<
    'default' | 'positive' | 'warning' | 'danger',
    string
  > = {
    default: 'text-[color:var(--hb-text-muted)]',
    positive: 'text-[#35745d]',
    warning: 'text-[#9a6203]',
    danger: 'text-[#a93a31]',
  };

  const valueClasses: Record<
    'default' | 'positive' | 'warning' | 'danger',
    string
  > = {
    default: 'text-[color:var(--hb-text)]',
    positive: 'text-[#1f5443]',
    warning: 'text-[#7a4300]',
    danger: 'text-[#87231f]',
  };

  return (
    <div
      className={[
        'flex flex-col gap-1 rounded-2xl border p-4 shadow-sm',
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

function formatConfidence(value?: number) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return `${Math.round(value)}%`;
}

function confidenceTone(value?: number) {
  if (typeof value !== 'number') {
    return 'default';
  }
  if (value >= 70) {
    return 'positive';
  }
  if (value >= 45) {
    return 'warning';
  }
  return 'danger';
}
