# @heulaulab/intai

AI-assisted prospect research CLI for small agencies, freelancers, and operators.

**Repository**: https://github.com/heulaulab-dev/intai

**Purpose**: Analyze businesses, detect operational inefficiencies, identify manual workflows, and generate personalized outreach angles.

**Not for**: Mass spam outreach, generic marketing.

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or pnpm

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd intai

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
```

### Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an API key
3. Add it to your `.env` file as `OPENAI_API_KEY=sk-...`

### Build

```bash
npm run build
```

### Run

```bash
# npx
npx @heulaulab/intai analyze <url>

# bunx
bunx @heulaulab/intai analyze <url>

# pnpm
pnpm exec @heulaulab/intai analyze <url>

# yarn
yarn dlx @heulaulab/intai analyze <url>

# Link globally
npm link
intai analyze <url>
```

After linking globally, use `intai` directly:

### Configure API Key

```bash
# Using npx
npx @heulaulab/intai config set api-key sk-...

# Or after global link
intai config set api-key sk-...
```

---

## Usage

### Analyze a website

```bash
# Using npx
npx @heulaulab/intai analyze <url>

# Or after global link
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

**Example output:**

```
[INTAI REPORT]

Business:
FitLife Gym

Operational Signals:
  ✓✓ WhatsApp booking
    Evidence: "Book via WhatsApp: +1-555-0123"
  ✓ Manual class scheduling
    Evidence: "Check our schedule page for upcoming classes"
  ~ No member portal
    Evidence: "Contact us to update your membership details"

Potential Problems:
  • Admin bottleneck (critical)
    Booking requests flood owner/manager phone
  • Communication fragmentation (moderate)
    WhatsApp, phone, email - no unified system

Suggested Internal Tools:
  → Booking dashboard (high)
    Automate appointment requests, reduce manual coordination
  → Membership portal (high)
    Self-service profile management for members

Summary:
FitLife relies heavily on manual WhatsApp coordination for bookings with no self-service option.
This creates an admin bottleneck during peak hours and limits business scalability.
```

### Generate outreach

```bash
# Using npx
npx @heulaulab/intai outreach <url>

# Or after global link
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

**Example output:**

```
[OUTREACH MESSAGE]

To:
FitLife Gym

Subject:
Quick way to offload your booking coordination?

Body:
I noticed you handle bookings via WhatsApp - smart for simplicity, but I bet it eats into your day.

I work with gyms like yours on operational tooling - specifically booking dashboards that handle the coordination automatically so you're not juggling messages during class hours.

Happy to share an example of how a similar business cut their admin time in half.

Worth a quick chat?

Personalization Notes:
  • WhatsApp booking system
  • Manual class scheduling
  • No member portal mentioned on site
```

---

## Commands

| Command | Description |
|---------|-------------|
| `@heulaulab/intai analyze <url>` | Analyze a business website for operational inefficiencies |
| `@heulaulab/intai outreach <url>` | Generate a personalized outreach message |
| `@heulaulab/intai config set api-key <key>` | Set your OpenAI API key |
| `@heulaulab/intai config get` | View current configuration |
| `@heulaulab/intai config unset api-key` | Remove stored API key |
| `@heulaulab/intai --help` | Show help |
| `@heulaulab/intai --version` | Show version |

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
│   ├── commands/         # CLI commands
│   │   ├── analyze.ts
│   │   └── outreach.ts
│   ├── analyzers/        # Business logic
│   │   ├── analysis.ts
│   │   └── outreach.ts
│   ├── services/        # External integrations
│   │   ├── ai.ts
│   │   └── scraper.ts
│   ├── prompts/         # AI prompts
│   │   ├── analysis.ts
│   │   └── outreach.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── utils/           # Utilities
│       ├── env.ts
│       └── url.ts
├── dist/                # Compiled output
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |

---

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run dev

# Link for local testing
npm link
```

---

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **CLI**: Commander.js
- **Scraping**: Playwright
- **AI**: OpenAI SDK
- **Output**: Chalk, Ora

---

## License

MIT