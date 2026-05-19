# Contributing to @heulaulab/intai

Thanks for your interest in contributing!

## Development Setup

```bash
git clone https://github.com/heulaulab-dev/intai.git
cdintai
npm install
npm run build
npm link  # Link globally for testing
```

## Project Structure

```
src/
├── commands/    # CLI command handlers
├── analyzers/   # Business logic
├── services/    # External integrations (AI, scraping)
├── prompts/     # AI prompts
├── types/       # TypeScript types
└── utils/        # Utilities
```

## Making Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Build and test (`npm run build && intai analyze https://example.com`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Code Style

- Use TypeScript with strict mode
- Follow existing patterns in the codebase
- Add types for all function parameters and return values
- No `any` types

## Testing

```bash
# Test the CLI
intai analyze https://example.com
intai outreach https://example.com
intai config get
```

## Questions?

Open an issue at https://github.com/heulaulab-dev/intai/issues