'use client';

import type { FormEvent, ChangeEvent } from 'react';
import type { FormState } from '@/types/snag';

interface SnagFormProps {
  form: FormState;
  error: string | null;
  isEditing: boolean;
  onFieldChange: (field: keyof FormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

export function SnagForm({
  form,
  error,
  isEditing,
  onFieldChange,
  onSubmit,
  onReset,
}: SnagFormProps) {
  // Wrap field updates so the parent component only receives clean values.
  const handleChange =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onFieldChange(field, event.target.value);
    };

  return (
    <form
      onSubmit={onSubmit}
      className='hb-card hb-card--soft flex flex-col gap-8'
    >
      <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-semibold uppercase tracking-[0.32em] text-[color:var(--hb-accent)]'>
            {isEditing ? 'Update snag' : 'Create snag'}
          </span>
          <h2 className='text-2xl font-semibold text-[color:var(--hb-text)]'>
            {isEditing ? 'Edit snag' : 'New snag'}
          </h2>
          <p className='text-sm leading-relaxed text-[color:var(--hb-text-muted)]'>
            Title and notes are required. We’ll analyse the rest and prefill the
            snag register for you.
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-3'>
          {isEditing ? (
            <button
              type='button'
              className='hb-btn hb-btn--ghost'
              onClick={onReset}
            >
              Cancel edit
            </button>
          ) : null}
          <button
            type='button'
            className='hb-btn hb-btn--ghost'
            onClick={onReset}
          >
            Reset
          </button>
        </div>
      </div>

      <TextField
        label='Title'
        value={form.title}
        placeholder='Kitchen sink leak'
        onChange={handleChange('title')}
        required
      />

      <TextArea
        label='Notes'
        value={form.notes}
        placeholder='Describe the snag in detail...'
        rows={1}
        onChange={handleChange('notes')}
        required
      />

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <TextField
          label='Plot'
          value={form.plot}
          placeholder='Plot 23'
          onChange={handleChange('plot')}
        />
        <TextField
          label='Development'
          value={form.development}
          placeholder='Meadow View'
          onChange={handleChange('development')}
        />
      </div>

      <TextField
        label='Photo URL (optional)'
        value={form.photoUrl}
        placeholder='https://...'
        onChange={handleChange('photoUrl')}
        type='url'
      />

      {error ? (
        <p className='rounded-2xl border border-[#f7b3a7] bg-[#ffe9e4] px-4 py-3 text-sm font-medium text-[#b34a3d]'>
          {error}
        </p>
      ) : null}

      <button type='submit' className='hb-btn hb-btn--primary self-start'>
        {isEditing ? 'Save changes' : 'Analyse & save'}
      </button>
    </form>
  );
}

function TextField({
  label,
  value,
  placeholder,
  onChange,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='text-sm font-medium text-[color:var(--hb-text-muted)]'>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className='hb-input'
        required={required}
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  placeholder,
  rows,
  onChange,
  required,
}: {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}) {
  return (
    <label className='flex flex-col gap-2'>
      <span className='text-sm font-medium text-[color:var(--hb-text-muted)]'>
        {label}
      </span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
        className='hb-input'
        required={required}
      />
    </label>
  );
}
