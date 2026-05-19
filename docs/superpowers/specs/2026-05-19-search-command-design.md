# intai search Command Design

**Date**: 2026-05-19
**Feature**: Auto-discover and analyze businesses by city + niche

## Overview

Add a new `search` command that discovers businesses from Google Maps based on city and niche, optionally analyzes all of them, and exports results.

## Command Interface

```bash
intai search <city> <niche> [options]
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `city` | Yes | City to search in |
| `niche` | Yes | Business type (e.g., gym, restaurant, salon) |

### Options

| Flag | Short | Default | Description |
|------|-------|---------|-------------|
| `--limit` | `-l` | `10` | Max businesses to discover |
| `--analyze` | `-a` | `false` | Run AI analysis on all results |
| `--score-threshold` | `-t` | `0` | Min score (0-100) for export |
| `--export-json` | | `false` | Export as JSON file |
| `--export-csv` | | `false` | Export as CSV file |
| `--json` | `-j` | `false` | Output raw JSON to stdout |

## User Flow

```
1. User runs: intai search jakarta gym --limit 20 --analyze --export-csv
2. Discover businesses from Google Maps
3. Display progress (X/Y businesses analyzed)
4. Show summary report (ranked by opportunity score)
5. Export filtered results to CSV/JSON
```

## Components

### 1. Discovery Service (`services/discovery.ts`)

Scrapes Google Maps for business listings.

**Input**: city, niche, limit
**Output**: Array of `{ name, url, address, phone, rating }`

**Implementation**:
- Use Playwright to scrape Google Maps search results
- Parse business cards from search results
- Extract: name, website URL, address, phone, rating
- Handle pagination if limit > 20

### 2. Scorer Service (`services/scorer.ts`)

Scores each business based on analysis report.

**Input**: AnalysisReport
**Output**: number (0-100)

**Scoring logic**:
- High: 3+ operational signals + critical problem = 80-100
- Medium: 2 signals + moderate problem = 50-79
- Low: <2 signals = 0-49

### 3. Exporter Service (`services/exporter.ts`)

Exports results to CSV/JSON files.

**Functions**:
- `exportToCSV(results: SearchResult[], path: string): void`
- `exportToJSON(results: SearchResult[], path: string): void`

**CSV columns**: rank, name, url, address, phone, rating, score, signals, problems, suggested_tools

**JSON structure**:
```typescript
interface ExportData {
  search: { city: string; niche: string; limit: number; analyzed_at: string };
  results: SearchResult[];
  summary: { total: number; analyzed: number; avg_score: number };
}
```

### 4. Search Command (`commands/search.ts`)

Orchestrates the entire flow.

**Steps**:
1. Initialize spinner
2. Discover businesses (Google Maps)
3. If `--analyze`:
   - For each business, scrape website → analyze → score
   - Show live progress
4. Rank results by score
5. Display summary (top 10)
6. If `--export-csv` or `--export-json`: export filtered results
7. Done

### 5. Type Updates (`types/index.ts`)

```typescript
interface DiscoveredBusiness {
  name: string;
  url?: string;
  address?: string;
  phone?: string;
  rating?: number;
}

interface SearchResult extends DiscoveredBusiness {
  score?: number;
  analysis?: AnalysisReport;
  signals?: string[];
  problems?: string[];
  suggestedTools?: string[];
}
```

## File Structure

```
src/
├── commands/
│   └── search.ts        # NEW - search command
├── services/
│   ├── discovery.ts    # NEW - Google Maps scraper
│   ├── scorer.ts        # NEW - opportunity scoring
│   ├── exporter.ts     # NEW - CSV/JSON export
│   └── ...
├── types/
│   └── index.ts         # UPDATED - add new types
└── ...
```

## Output Examples

### Live Progress (--analyze flag)
```
Discovering gyms in jakarta...
✓ Found 20 businesses

Analyzing websites...
[████████░░░░░░░░░░░░] 8/20 - www.fitlife-gym.com
```

### Summary Report
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOP OPPORTUNITIES IN JAKARTA (GYM)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

#1 FitLife Gym
   📍 Jl. Sudirman No.123
   📊 Score: 92/100
   ⚡ WhatsApp booking, Manual scheduling
   🎯 Admin bottleneck

#2 Muscle Factory
   📍 Jl. Gatot Subroto
   📊 Score: 88/100
   ⚡ No online booking, Spreadsheet inventory
   🎯 Scheduling chaos

...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  20 businesses | Avg score: 72 | Exported to intai-results.csv
```

## Export File Naming

`intai-results-{city}-{niche}-{date}.{csv|json}`

Example: `intai-results-jakarta-gym-2026-05-19.csv`

## Dependencies

No new npm packages needed - uses existing Playwright for scraping.

## Error Handling

- Google Maps blocked → Show error with manual URL option
- No websites found → Skip business in analysis, note in report
- Analysis fails → Log error, continue with next, show count of failures
- Export fails → Show error, don't block summary display

## Performance Considerations

- Limit concurrent analyses to 3 (avoid rate limiting)
- Add 1s delay between Google Maps requests
- Cache discovered businesses for retry scenarios