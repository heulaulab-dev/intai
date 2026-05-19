# Contributing to intai

Thanks for your interest in contributing!

## Development Setup

```bash
# Clone the repository
git clone https://github.com/heulaulab-dev/intai.git
cd intai

# Install dependencies
npm install

# Build the project
npm run build

# Link for local testing
npm link

# Test the CLI
intai analyze https://example.com
intai outreach https://example.com
intai config get
```

## Project Structure

```
src/
├── commands/    # CLI command handlers (analyze, outreach, config)
├── analyzers/   # Business logic for analysis and outreach
├── services/    # External integrations (AI, scraping)
├── prompts/     # AI prompts
├── types/       # TypeScript types
└── utils/       # Utilities (env, url, spinner)
```

## Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Build and test (`npm run build && intai analyze https://example.com`)
5. Commit your changes (`git commit -m 'feat: add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- Use TypeScript with strict mode
- Follow existing patterns in the codebase
- Add types for all function parameters and return values
- No `any` types
- Use the color palette defined in commands (not ad-hoc colors)

### Color Palette

```typescript
const colors = {
  primary: chalk.cyanBright,
  secondary: chalk.cyan,
  accent: chalk.green,
  warning: chalk.yellow,
  danger: chalk.red,
  text: chalk.white,
  muted: chalk.gray,
  dim: chalk.dim,
};
```

## UI Guidelines

- Use `classic` border style (not `round`)
- Use black background for boxes: `backgroundColor: 'black'`
- Use `▸` for section markers
- Use `■` for list bullets
- Keep dividers at 50 characters: `colors.muted('━'.repeat(50))`

## Testing

```bash
# Build first
npm run build

# Test analyze command
intai analyze https://example.com

# Test with JSON output
intai analyze https://example.com --json

# Test outreach command
intai outreach https://example.com

# Test config
intai config get
intai config set api-key test
intai config unset api-key
```

## Questions?

Open an issue at https://github.com/heulaulab-dev/intai/issues