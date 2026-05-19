# @heulaulab/intai

<!-- Badges -->
[![npm version](https://img.shields.io/npm/v/@heulaulab/intai?style=flat-square)](https://www.npmjs.com/package/@heulaulab/intai)
[![npm downloads](https://img.shields.io/npm/dm/@heulaulab/intai?style=flat-square)](https://www.npmjs.com/package/@heulaulab/intai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square)](https://www.typescriptlang.org/)

AI-assisted prospect research CLI for small agencies, freelancers, and operators.

**Purpose**: Analyze businesses, detect operational inefficiencies, identify manual workflows, and generate personalized outreach angles.

**Not for**: Mass spam outreach, generic marketing.

---

## Quick Start

```bash
# Install (one-liner)
npm install -g @heulaulab/intai

# Configure API key
intai config set api-key <your-openai-key>

# Analyze a website
intai analyze https://example-gym.com

# Generate outreach
intai outreach https://example-gym.com
```

## Installation

### Prerequisites

- Node.js >= 18.0.0

### Install via npm

```bash
npm install -g @heulaulab/intai
```

### Install via other package managers

```bash
# pnpm
pnpm add -g @heulaulab/intai

# yarn
yarn global add @heulaulab/intai

# bun
bun add -g @heulaulab/intai
```

### Run without installing

```bash
# npx
npx @heulaulab/intai analyze <url>

# bunx
bunx @heulaulab/intai analyze <url>

# pnpm
pnpm exec @heulaulab/intai analyze <url>
```

---

## Setup

### Configure API Key

```bash
# Set your OpenAI API key (stored in ~/.intai/config.json)
intai config set api-key sk-...

# Or use environment variable
export OPENAI_API_KEY=sk-...
```

Get your OpenAI API key at [platform.openai.com](https://platform.openai.com/)

---

## Usage

### Analyze a website

```bash
intai analyze <url>
```

Analyzes a business website and identifies operational inefficiencies.

```bash
# Basic usage
intai analyze https://example-gym.com

# Output as JSON
intai analyze https://example-gym.com --json
intai analyze https://example-gym.com -j
```

### Generate outreach

```bash
intai outreach <url>
```

Analyzes a business and generates a personalized outreach message.

```bash
# Basic usage
intai outreach https://example-gym.com

# Output as JSON
intai outreach https://example-gym.com --json
intai outreach https://example-gym.com -j
```

---

## Commands

| Command | Description |
|---------|-------------|
| `intai analyze <url>` | Analyze a business website for operational inefficiencies |
| `intai outreach <url>` | Generate a personalized outreach message |
| `intai config set api-key <key>` | Set your OpenAI API key |
| `intai config get` | View current configuration |
| `intai --help` | Show help |
| `intai --version` | Show version |

### Options

| Flag | Description |
|------|-------------|
| `-j, --json` | Output as JSON instead of formatted terminal output |

---

## What intai detects

### Operational Signals

- **WhatsApp/phone/email-only contact** — No booking system
- **Manual scheduling** — Class schedules, appointment lists as images/text
- **Spreadsheet dependency** — Explicit mentions of managing data in spreadsheets
- **Inventory complexity** — Large menus/product catalogs without management
- **Repetitive admin tasks** — RSVP via email, waitlists, manual confirmations
- **No self-service portals** — Members/customers must contact for updates

### Detected Problems

- Admin bottlenecks
- Communication fragmentation
- Scheduling chaos
- Data scatter (spreadsheets, texts, emails)
- Customer friction

### Suggested Tools

- Booking dashboards
- Membership portals
- Inventory management systems
- Scheduling tools
- Admin dashboards
- Customer management systems

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

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes* | Your OpenAI API key |

*Or use `intai config set api-key`

---

## Development

```bash
# Clone and setup
git clone https://github.com/heulaulab-dev/intai.git
cd intai
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

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.6
- **CLI**: Commander.js
- **Scraping**: Playwright
- **AI**: OpenAI SDK
- **Output**: Chalk, Boxen, Ora

---

## License

MIT

**Repository**: https://github.com/heulaulab-dev/intai