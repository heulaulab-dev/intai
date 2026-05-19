# intai Debug Session Summary

## What is intai?

**intai** is an AI-powered CLI tool for prospect research. It analyzes business websites to identify operational inefficiencies and generates personalized cold outreach messages.

### Core Features
- **Analyze**: Scan websites for manual processes, communication gaps, admin bottlenecks
- **Outreach**: Generate targeted cold emails based on real findings
- **Config**: Manage API keys and settings via CLI

### Tech Stack
- TypeScript + Node.js
- Commander.js (CLI)
- Cheerio (web scraping)
- OpenAI SDK (AI integration)
- Chalk/Boxen/Ora (terminal UI)

---

## What We Did

### Problem Reported
```
✖ Analysis failed
404 404 page not found
```
Even `https://fithub.id` returned 404, but the website was clearly accessible.

---

### Debugging Process

#### 1. Verified Website Accessibility
```bash
curl -sI "https://fithub.id"  # HTTP/2 200 ✓
node fetch("https://fithub.id")  # Status: 200 OK ✓
```
**Result**: Website is accessible, scraper works fine.

#### 2. Traced the 404 Source
Tested the scraper directly:
```javascript
const result = await scrapeWebsite('https://fithub.id')
// Returns: { title: "Gym & Fitness...", content: "Diskon..." }
// ✅ Scraping works
```
**Result**: The 404 was NOT from the target website.

#### 3. Found the Real Issue - API Configuration

Compared working Claude Code config vs intai config:

| Component | Claude Code | intai |
|-----------|-------------|-------|
| baseURL | `https://api.minimax.io/anthropic` | `https://api.minimax.io/anthropic` |
| apiKey | `sk-cp-...` | `sk-cp-...` |
| SDK | Custom | OpenAI SDK |

**Problem**: OpenAI SDK appends paths differently.

OpenAI SDK with `baseURL: "https://api.minimax.io/anthropic"` produces:
```
https://api.minimax.io/anthropic/chat/completions  ← 404
```

But Claude Code uses a custom HTTP client that works correctly.

#### 4. Tested MiniMax API Endpoints

Found two working endpoints:
```bash
# Anthropic-compatible (Claude Code uses this)
POST https://api.minimax.io/anthropic/v1/messages

# OpenAI-compatible (works with OpenAI SDK)
POST https://api.minimax.io/v1/chat/completions
```

#### 5. Fixed Config

Changed `~/.intai/config.json`:
```diff
{
- "baseURL": "https://api.minimax.io/anthropic",
+ "baseURL": "https://api.minimax.io/v1",
- "model": "claude-sonnet-4-6"
+ "model": "MiniMax-M2.7"
}
```

#### 6. Fixed AI Response Parsing

MiniMax returns content with thinking blocks that broke JSON parsing:

```javascript
// Before (ai.ts)
const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

// After
let cleaned = text
  .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')  // Remove thinking blocks
  .replace(/<think>[\s\S]*?<\/think>/gi, '')         // Remove think blocks
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/\s*```$/i, '')
  .trim();
```

#### 7. Fixed Version Display

The `--version` flag showed `0.1.0` instead of actual version.

**Cause**: Hardcoded in `src/index.ts:43`
```typescript
// Before
.version('0.1.0')

// After - read from package.json
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));
.version(packageJson.version)
```

---

### Changes Committed

| Commit | Description |
|--------|-------------|
| `3193ac9` | Fix thinking block parsing in AI responses |
| `3d16144` | Dynamic version from package.json |

---

## Lessons Learned

1. **SDK path handling**: OpenAI SDK appends `/chat/completions` to baseURL. If your provider doesn't use that pattern, use the base URL that works with OpenAI SDK conventions.

2. **MiniMax API compatibility**: MiniMax supports both OpenAI-compatible (`/v1/chat/completions`) and Anthropic-compatible (`/anthropic/v1/messages`) endpoints. Choose based on which SDK you're using.

3. **Model names vary**: Claude Code uses `claude-sonnet-4-6` but MiniMax's actual model names are `MiniMax-M2.7`, `MiniMax-M2.1`, etc. Don't assume model names transfer across providers.

4. **Thinking blocks**: Some AI providers (Claude, MiniMax) include `<thinking>` blocks in responses. Must strip these before JSON parsing.

5. **Dynamic version**: Never hardcode version strings. Read from `package.json` at runtime.

---

## Useful Commands

```bash
# Update CLI
bun update -g @heulaulab/intai

# Check version
intai --version

# Analyze a site
intai analyze https://example.com

# Debug config
cat ~/.intai/config.json

# Edit config directly
nano ~/.intai/config.json
```