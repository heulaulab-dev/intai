#!/usr/bin/env node

import { Command } from 'commander';
import { createAnalyzeCommand } from './commands/analyze.js';
import { createOutreachCommand } from './commands/outreach.js';
import { createConfigCommand } from './commands/config.js';

const program = new Command();

program
  .name('intai')
  .description('AI-assisted prospect research CLI for small agencies and freelancers')
  .version('0.1.0');

program.addCommand(createAnalyzeCommand());
program.addCommand(createOutreachCommand());
program.addCommand(createConfigCommand());

program.hook('postAction', async () => {
  process.exit(0);
});

program.parse();