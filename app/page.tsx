'use client';

import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { analyseSnag, type AnalysisResult } from '@/lib/analysis';
import { NavBar } from '@/components/snag/Navbar';
import { SnagForm } from '@/components/snag/SnagForm';
import { AnalysisPanel } from '@/components/snag/AnalysisPanel';
import { SnagRegister } from '@/components/snag/SnagRegister';
import { SnagTopBar } from '@/components/snag/SnagTopBar';
import type {
  AnalysisPreview,
  FormState,
  PriorityFilter,
  SnagRecord,
} from '@/types/snag';

// Persistent storage key for the snag register.
const STORAGE_KEY = 'snag-tracker-snags';

// Form template.
const initialState: FormState = {
  title: '',
  notes: '',
  plot: '',
  development: '',
  photoUrl: '',
};

// Sample records to make the register immediately useful.
const SAMPLE_SNAGS: FormState[] = [
  {
    title: 'En-suite basin trap leaking',
    notes:
      'En-suite basin trap leaking, slow drip onto vanity. Plot 14. Customer due to move Friday.',
    plot: 'Plot 14',
    development: 'Willow Grove',
    photoUrl: '',
  },
  {
    title: 'Kitchen island door misaligned',
    notes:
      'Kitchen island unit door misaligned by roughly 5mm. Hinges need adjusting. Plot 21.',
    plot: 'Plot 21',
    development: 'Maple Chase',
    photoUrl: '',
  },
  {
    title: 'External tap not live',
    notes: 'External tap not live. Suspect isolation valve left off. P3.',
    plot: 'Plot 3',
    development: 'Willow Grove',
    photoUrl: '',
  },
  {
    title: 'Landing pendant alignment',
    notes: 'Landing pendant not centred. Cosmetic only. Plot 37.',
    plot: 'Plot 37',
    development: 'Orchard Rise',
    photoUrl: '',
  },
];

export default function Home() {
  // Form input state.
  const [form, setForm] = useState<FormState>(initialState);
  // Snag register state (hydrated from localStorage).
  const [snags, setSnags] = useState<SnagRecord[]>([]);
  // Most recent analysed snag (drives the analysis panel).
  const [preview, setPreview] = useState<AnalysisPreview | null>(null);
  // Inline validation error for the form.
  const [error, setError] = useState<string | null>(null);
  // Track which snag is being edited (null when creating new).
  const [editingId, setEditingId] = useState<string | null>(null);
  // Filters and sorting controls.
  const [selectedDevelopment, setSelectedDevelopment] = useState<string>('All');
  const [selectedTrade, setSelectedTrade] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] =
    useState<PriorityFilter>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  // Prevents hydration mismatch while waiting for localStorage.
  const [hydrated, setHydrated] = useState<boolean>(false);
  // Controls whether the form or the register is visible.
  const [activeView, setActiveView] = useState<'form' | 'register'>('form');

  //load snags from local storage
  useEffect(() => {
    //if the component is hydrated or the window is not defined, do nothing
    if (hydrated || typeof window === 'undefined') {
      return;
    }

    //if there are stored snags, parse them and set the state
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as SnagRecord[];
        setSnags(parsed);
      } catch (error) {
        console.error('Error loading snags from local storage:', error);
      }
    }
    //if there are no stored snags, set the state to the default sample data
    else {
      setSnags(seedSnags());
    }
    setHydrated(true);
  }, [hydrated]);

  // Smoothly scroll to subsections from the navbar.
  const scrollToSection = (sectionId: string) => {
    const target =
      typeof document !== 'undefined'
        ? document.getElementById(sectionId)
        : null;
    if (target) {
      const NAV_HEIGHT = 96; // keep space for sticky navbar
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: 'smooth',
      });
    }
  };

  // Update the form field while clearing any validation errors.
  const handleFieldChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: FormState = {
      title: form.title.trim(),
      notes: form.notes.trim(),
      plot: form.plot.trim(),
      development: form.development.trim(),
      photoUrl: form.photoUrl.trim(),
    };

    if (!formData.title) {
      setError('Please add a title before analysing.');
      return;
    }

    if (!formData.notes) {
      setError('Please add snag notes before analysing.');
      return;
    }

    const analysis = analyseSnag(formData.notes);
    const timestamp = new Date().toISOString();
    let nextRecord: SnagRecord | null = null;

    if (editingId) {
      setSnags((prev) =>
        prev.map((snag) => {
          if (snag.id !== editingId) {
            return snag;
          }
          nextRecord = createSnagRecord(formData, analysis, snag);
          return nextRecord;
        })
      );
    } else {
      nextRecord = createSnagRecord(formData, analysis);
      setSnags((prev) => [nextRecord as SnagRecord, ...prev]);
    }

    // Defensive fallback if TypeScript fails to narrow `nextRecord`.
    if (!nextRecord) {
      nextRecord = createSnagRecord(formData, analysis);
    }

    setPreview({
      id: nextRecord.id,
      form: formData,
      result: analysis,
      analysedAt: timestamp,
    });

    setForm(initialState);
    setEditingId(null);
    setError(null);
  };

  const handleReset = () => {
    setForm(initialState);
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (record: SnagRecord) => {
    // Populate the form with the existing record.
    const nextForm: FormState = {
      title: record.title,
      notes: record.notes,
      plot: record.plot,
      development: record.development,
      photoUrl: record.photoUrl,
    };

    setForm(nextForm);
    setEditingId(record.id);
    setPreview({
      id: record.id,
      form: nextForm,
      result: {
        summary: record.summary,
        trade: record.trade,
        priority: record.priority,
        dueDate: record.dueDate,
        defectType: record.defectType,
        confidence: record.confidence,
      },
      analysedAt: record.updatedAt,
    });
    setError(null);
    setActiveView('form');
    // Ensure the form is in view once it renders.
    if (typeof window !== 'undefined') {
      window.setTimeout(() => scrollToSection('snag-form'), 0);
    }
  };

  const handleDelete = (id: string) => {
    if (
      typeof window !== 'undefined' &&
      !window.confirm('Delete this snag entry?')
    ) {
      return;
    }

    setSnags((prev) => prev.filter((snag) => snag.id !== id));
    if (preview?.id === id) {
      setPreview(null);
    }
    // Reset the form if the entry being edited was removed.
    if (editingId === id) {
      setForm(initialState);
      setEditingId(null);
    }
  };

  const toggleSort = () => {
    setSortAscending((prev) => !prev);
  };

  const developmentOptions = useMemo(() => {
    const values = new Set<string>();
    snags.forEach((snag) => {
      if (snag.development) {
        values.add(snag.development);
      }
    });
    // Sort to keep the dropdown predictable.
    return ['All', ...Array.from(values).sort()];
  }, [snags]);

  const tradeOptions = useMemo(() => {
    const values = new Set<string>();
    snags.forEach((snag) => values.add(snag.trade));
    // Sorting means trades appear alphabetically in the filter.
    return ['All', ...Array.from(values).sort()];
  }, [snags]);

  const filteredSnags = useMemo(() => {
    const byFilters = snags.filter((snag) => {
      const matchesDevelopment =
        selectedDevelopment === 'All' ||
        snag.development === selectedDevelopment;
      const matchesTrade =
        selectedTrade === 'All' || snag.trade === selectedTrade;
      const matchesPriority =
        selectedPriority === 'All' || snag.priority === selectedPriority;
      const matchesSearch = createSearchMatch(snag, searchTerm);
      return (
        matchesDevelopment && matchesTrade && matchesPriority && matchesSearch
      );
    });

    return [...byFilters].sort((a, b) => {
      // Primary sort: due date.
      const aTime = new Date(a.dueDate).getTime();
      const bTime = new Date(b.dueDate).getTime();
      if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
        return sortAscending ? aTime - bTime : bTime - aTime;
      }

      // Stable secondary sort using the creation timestamp.
      if (aTime === bTime) {
        const aCreated = new Date(a.createdAt).getTime();
        const bCreated = new Date(b.createdAt).getTime();
        return sortAscending ? aCreated - bCreated : bCreated - aCreated;
      }

      return sortAscending ? aTime - bTime : bTime - aTime;
    });
  }, [
    snags,
    selectedDevelopment,
    selectedTrade,
    selectedPriority,
    searchTerm,
    sortAscending,
  ]);

  const handleExportCsv = () => {
    if (!filteredSnags.length) {
      // Nothing to export, silently ignore.
      return;
    }

    // Compose the CSV with Excel-friendly quoting and newline conventions.
    const headers = [
      'Title',
      'Summary',
      'Trade',
      'Priority',
      'Due Date',
      'Plot',
      'Development',
      'Notes',
      'Defect Keyword',
    ];

    const rows = filteredSnags.map((snag) => [
      snag.title,
      snag.summary,
      snag.trade,
      snag.priority,
      snag.dueDate,
      snag.plot,
      snag.development,
      snag.notes,
      snag.defectType,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    // Timestamp the export file so multiple downloads do not clash.
    link.setAttribute(
      'download',
      `snag-tracker-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isEditing = Boolean(editingId);

  return (
    <>
      <NavBar />
      <main className='min-h-screen bg-[color:var(--hb-bg)] text-[color:var(--hb-text)] transition-colors'>
        <div className='mx-auto flex w-full flex-col gap-12 px-6 pb-20 pt-12'>
          <SnagTopBar activeView={activeView} onSelect={setActiveView} />

          <div className='flex w-full flex-1 flex-col gap-12 lg:flex-row lg:items-start'>
            {activeView === 'form' ? (
              <section
                id='snag-form'
                className='grid gap-10 scroll-mt-28 lg:grid-cols-[2fr,1.1fr]'
              >
                <SnagForm
                  form={form}
                  error={error}
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                  onSubmit={handleSubmit}
                  onReset={handleReset}
                />
                <AnalysisPanel preview={preview} />
              </section>
            ) : (
              <SnagRegister
                filteredSnags={filteredSnags}
                developmentOptions={developmentOptions}
                tradeOptions={tradeOptions}
                selectedDevelopment={selectedDevelopment}
                selectedTrade={selectedTrade}
                selectedPriority={selectedPriority}
                searchTerm={searchTerm}
                sortAscending={sortAscending}
                onDevelopmentChange={setSelectedDevelopment}
                onTradeChange={setSelectedTrade}
                onPriorityChange={setSelectedPriority}
                onSearchChange={setSearchTerm}
                onToggleSort={toggleSort}
                onExport={handleExportCsv}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

// Helpers -----------------------------------------------------------------

function createSnagRecord(
  form: FormState,
  analysis: AnalysisResult,
  base?: SnagRecord
): SnagRecord {
  // Reuse the existing id/createdAt when editing so table rows remain stable.
  const timestamp = new Date().toISOString();
  return {
    id: base?.id ?? generateId(),
    title: form.title,
    notes: form.notes,
    plot: form.plot,
    development: form.development,
    photoUrl: form.photoUrl,
    summary: analysis.summary,
    trade: analysis.trade,
    priority: analysis.priority,
    dueDate: analysis.dueDate,
    defectType: analysis.defectType,
    confidence: analysis.confidence,
    createdAt: base?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

function seedSnags() {
  // Convert sample notes into fully analysed records so the register looks real.
  return SAMPLE_SNAGS.map((seed) =>
    createSnagRecord(seed, analyseSnag(seed.notes))
  );
}

function generateId() {
  // Prefer the crypto API when available; otherwise fall back to timestamp+random.
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `snag-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createSearchMatch(snag: SnagRecord, term: string) {
  if (!term.trim()) {
    return true;
  }
  // Basic substring search across a few useful fields.
  const query = term.trim().toLowerCase();
  const haystack = [
    snag.title,
    snag.summary,
    snag.notes,
    snag.plot,
    snag.development,
    snag.trade,
    snag.priority,
    snag.defectType,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}
