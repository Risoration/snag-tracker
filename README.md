## How to Run

1. Ensure you have Node.js 18+ installed.
2. Install dependencies with `pnpm install` (or `npm install` / `yarn` if you prefer).
3. Start the dev server:
   - `pnpm run dev`
   - The app will be available at `http://localhost:3000`.
4. The UI runs entirely in the browser—no extra services needed.

## How It Works

- **Keyword mapping & date logic**  
  Free-text notes are analysed with a keyword map to infer trade, priority, and due date (adds working days based on priority).
- **Confidence scoring**  
  The analyser tallies keyword matches and exposes a simple “confidence” percentage to surface how strong the classification is.
- **Local storage persistence**  
  Snags are saved to `localStorage`, so the register survives refreshes.
- **Sorting & filtering**  
  Users can filter by development, trade, priority, and search across all fields; sorting toggles by due date.

## Coding Approach

- **Frameworks / languages**: Next.js (React, TypeScript), Tailwind CSS for styling.
- **Libraries**: Built-in React hooks, browser `localStorage`;
- **Why this method**:
  - React/Next.js enables responsive UI updates and simple client-side persistence.
  - TypeScript provides helpful typing across the analyser and register.
  - A plain keyword map keeps the logic transparent and easy to extend.

## Improvements / Next Steps

- Smarter AI, using models to classify priority of different snags with greater confidence.
- Integrate real data sources (SharePoint list, Dataverse, or bespoke API).
- Surface collaboration: push updates into Microsoft 365/Teams channels or SharePoint pages.
