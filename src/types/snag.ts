import type { AnalysisResult } from '../lib/analysis';

export type FormState = {
  title: string;
  notes: string;
  plot: string;
  development: string;
  photoUrl: string;
};

export type SnagRecord = FormState &
  AnalysisResult & {
    id: string;
    createdAt: string;
    updatedAt: string;
  };

export type AnalysisPreview = {
  id: string | null;
  form: FormState;
  result: AnalysisResult;
  analysedAt: string;
};

export type PriorityFilter = 'All' | 'High' | 'Medium' | 'Low';
