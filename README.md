[![INTAI](/public/intai-header.jpg)](https://github.com/darkroomengineering/satus)

<!-- Badges -->
[![npm version](https://img.shields.io/npm/v/@heulaulab/intai?style=flat-square)](https://www.npmjs.com/package/@heulaulab/intai)
[![npm downloads](https://img.shields.io/npm/dm/@heulaulab/intai?style=flat-square)](https://www.npmjs.com/package/@heulaulab/intai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square)](https://www.typescriptlang.org/)

AI-powered prospect research CLI for operators — analyze businesses, detect inefficiencies, and craft personalized outreach.

---

## Quick Start

```bash
# Install
npm install -g @heulaulab/intai

# Configure
intai config set api-key <your-api-key>

# Analyze
intai analyze https://example-gym.com

# Outreach
intai outreach https://example-gym.com
```

---

## Features

**Analyze** — Scan websites for operational signals and identify automation opportunities

- Manual scheduling detection
- Communication gaps (phone/email-only contact)
- Spreadsheet dependency
- Admin bottlenecks
- Customer friction points

**Outreach** — Generate personalized cold outreach based on real findings

- Tailored subject lines
- Pain-point focused messaging
- Personalization notes for authenticity

---

## Installation

### Prerequisites

- Node.js >= 18.0.0

### npm

```bash
npm install -g @heulaulab/intai
```

### pnpm

```bash
pnpm add -g @heulaulab/intai
```

### yarn

```bash
yarn global add @heulaulab/intai
```

### bun

```bash
bun add -g @heulaulab/intai
```

### Run without installing

```bash
npx @heulaulab/intai analyze <url>
bunx @heulaulab/intai analyze <url>
pnpm exec @heulaulab/intai analyze <url>
```

---

## Setup

### Configure API Key

```bash
# Set via CLI (stored in ~/.intai/config.json)
intai config set api-key sk-...

# Or use environment variable
export OPENAI_API_KEY=sk-...
```

Supports OpenAI and compatible APIs:

```bash
intai config set base-url https://api.openai.com/v1
intai config set model gpt-4o
```

---

## Usage

### Analyze

```bash
intai analyze <url>
intai analyze <url> --json
intai analyze <url> -j
```

### Outreach

```bash
intai outreach <url>
intai outreach <url> --json
intai outreach <url> -j
```

### Configuration

```bash
intai config set api-key <key>
intai config set base-url <url>
intai config set model <model>
intai config get
intai config get api-key
intai config unset api-key
```

---

## Commands

| Command | Description |
|---------|-------------|
| `intai analyze <url>` | Analyze a business website |
| `intai outreach <url>` | Generate outreach message |
| `intai config set <key> <value>` | Set configuration |
| `intai config get [key]` | Get configuration |
| `intai config unset <key>` | Remove configuration |
| `intai --help` | Show help |
| `intai --version` | Show version |

---

## Detection Capabilities

### Operational Signals

- WhatsApp/phone/email-only contact (no booking system)
- Manual scheduling (class schedules, appointments as images)
- Spreadsheet dependency (managing data in spreadsheets)
- Inventory complexity (large catalogs without management)
- Repetitive admin tasks (RSVP via email, waitlists)
- No self-service portals

### Output Categories

- **Problems Detected** — With severity levels (critical/moderate/minor)
- **Suggested Tools** — With priority and rationale
- **Tech Stack** — Detected technologies
- **Summary** — Overall assessment

---

## Development

```bash
# Clone
git clone https://github.com/heulaulab-dev/intai.git
cd intai

# Install
npm install

# Build
npm run build

# Link for local testing
npm link
intai <command>

# Watch mode
npm run dev
```

---

## Architecture

```
intai/
├── src/
│   ├── index.ts           # Entry point, CLI setup
│   ├── commands/          # CLI commands
│   │   ├── analyze.ts
│   │   ├── outreach.ts
│   │   └── config.ts
│   ├── analyzers/        # Business logic
│   │   ├── analysis.ts
│   │   └── outreach.ts
│   ├── services/         # External integrations
│   │   ├── ai.ts
│   │   └── scraper.ts
│   ├── prompts/          # AI prompts
│   │   ├── analysis.ts
│   │   └── outreach.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── utils/            # Utilities
│       ├── env.ts
│       ├── url.ts
│       └── spinner.ts
├── dist/                 # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.6
- **CLI**: Commander.js
- **Scraping**: Cheerio (lightweight, no browser needed)
- **AI**: OpenAI SDK
- **Output**: Chalk, Boxen, Ora

---

## Scraping

By default, intai uses a lightweight scraper based on Cheerio that works without installing a browser. This is fast and has no system dependencies.

**Optional: Enhanced scraping with Playwright**

If you need better JavaScript-rendered content, install Playwright:

```bash
npm run install:browser
# or
npx playwright install chromium
```
        
---

## License

MIT — Built by [heulaulab](https://heulaulab.tazkiyaworks.fun)