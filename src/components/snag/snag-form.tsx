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
      className='flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg shadow-slate-900/5 transition-colors dark:border-slate-800 dark:bg-slate-900/60 dark:shadow-black/30'
    >
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col'>
          <h2 className='text-lg font-semibold text-slate-900 transition-colors dark:text-slate-100'>
            {isEditing ? 'Edit snag' : 'New snag'}
          </h2>
          <p className='text-sm text-slate-500 transition-colors dark:text-slate-400'>
            Title and notes are required. We will classify the rest.
          </p>
        </div>
        <div className='flex items-center gap-3'>
          {isEditing ? (
            <button
              type='button'
              className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
              onClick={onReset}
            >
              Cancel edit
            </button>
          ) : null}
          <button
            type='button'
            className='rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300'
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
        rows={6}
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
        <p className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-200'>
          {error}
        </p>
      ) : null}

      <button
        type='submit'
        className='mt-2 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-base font-semibold text-emerald-950 shadow-sm transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300'
      >
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
      <span className='text-sm font-medium text-slate-600 dark:text-slate-300'>
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className='rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
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
      <span className='text-sm font-medium text-slate-600 dark:text-slate-300'>
        {label}
      </span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        rows={rows}
        className='rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
        required={required}
      />
    </label>
  );
}
