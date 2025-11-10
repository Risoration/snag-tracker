export type Priority = 'High' | 'Medium' | 'Low';

interface AnalysisResult {
  summary: string;
  trade: string;
  priority: Priority;
  dueDate: string;
  defectType: string;
}

const TRADE_KEYWORDS = {
  Plumbing: ['leak', 'tap', 'pipe', 'trap', 'water', 'boiler'],
  Electrical: ['socket', 'light', 'switch', 'pendant', 'fuse'],
  Joinery: ['door', 'hinge', 'cupboard', 'frame', 'unit'],
  Decoration: ['paint', 'mark', 'chip', 'scuff', 'cosmetic'],
  Groundworks: ['drain', 'gutter', 'path', 'garden'],
  Roofing: ['roof', 'tile', 'flashing'],
} as const;

const PRIORITY_KEYWORDS: Record<Priority, string[]> = {
  High: ['leak', 'water', 'live', 'gas', 'urgent', 'move', 'handover'],
  Medium: [],
  Low: ['cosmetic', 'paint', 'scuff', 'alignment', 'centred', 'centered'],
};

const WORKING_DAY_LOOKUP: Record<Priority, number> = {
  High: 3,
  Medium: 7,
  Low: 14,
};

// Low-level helpers --------------------------------------------------------

function normaliseText(text: string) {
  return text.toLowerCase();
}

function summarise(notes: string) {
  const words = notes.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return '';
  }
  const summaryWords = words.slice(0, 30);
  const summary = summaryWords.join(' ');
  if (words.length > 30) {
    return `${summary}...`;
  }
  return summary;
}

function detectTrade(notes: string) {
  const normalized = normaliseText(notes);
  let trade: string = 'Other';
  let matchedKeyword = '';

  // First matching keyword wins. More advanced logic could tally counts instead.
  for (const [tradeName, keywords] of Object.entries(TRADE_KEYWORDS)) {
    const foundKeyword = keywords.find((keyword) =>
      containsWholeWord(normalized, keyword)
    );
    if (foundKeyword) {
      trade = tradeName;
      matchedKeyword = foundKeyword;
      break;
    }
  }

  return { trade, matchedKeyword };
}

function detectPriority(notes: string): Priority {
  const normalized = normaliseText(notes);
  if (
    PRIORITY_KEYWORDS.High.some((word) => containsWholeWord(normalized, word))
  ) {
    return 'High';
  }
  if (
    PRIORITY_KEYWORDS.Low.some((word) => containsWholeWord(normalized, word))
  ) {
    return 'Low';
  }
  return 'Medium';
}

function containsWholeWord(haystack: string, needle: string) {
  const pattern = new RegExp(`\\b${escapeRegExp(needle)}\\b`, 'i');
  return pattern.test(haystack);
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function addWorkingDays(date: Date, workingDays: number) {
  const result = new Date(date);
  while (workingDays > 0) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) {
      workingDays -= 1;
    }
  }
  return result;
}

function formatAsISODate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function extractDefectKeyword(
  notes: string,
  tradeKeyword: string,
  priority: Priority
) {
  if (tradeKeyword) {
    return tradeKeyword;
  }

  // If we did not match a trade keyword, fall back to priority cues or first word.
  const normalized = normaliseText(notes);
  const priorityKeywords =
    priority === 'High'
      ? PRIORITY_KEYWORDS.High
      : priority === 'Low'
      ? PRIORITY_KEYWORDS.Low
      : [];

  const priorityMatch = priorityKeywords.find((keyword) =>
    containsWholeWord(normalized, keyword)
  );
  if (priorityMatch) {
    return priorityMatch;
  }

  const wordMatch = normalized.match(/[a-z]+/);
  return wordMatch ? wordMatch[0] : 'general';
}

export function analyseSnag(
  notes: string,
  today: Date = new Date()
): AnalysisResult {
  const safeNotes = notes.trim();
  const summary = summarise(safeNotes);
  const { trade, matchedKeyword } = detectTrade(safeNotes);
  const priority = detectPriority(safeNotes);
  const dueDate = formatAsISODate(
    addWorkingDays(today, WORKING_DAY_LOOKUP[priority])
  );
  const defectType = extractDefectKeyword(safeNotes, matchedKeyword, priority);

  return {
    summary,
    trade,
    priority,
    dueDate,
    defectType,
  };
}

export type { AnalysisResult };
