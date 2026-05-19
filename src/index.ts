#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { createAnalyzeCommand } from './commands/analyze.js';
import { createOutreachCommand } from './commands/outreach.js';
import { createConfigCommand } from './commands/config.js';

const program = new Command();

// Modern minimal logo inspired by projectdiscovery.io style
const logo = `
${chalk.cyanBright('▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀')}
${chalk.cyanBright('▓')}                              ${chalk.cyanBright('▓')}
${chalk.cyanBright('▓')}  ${chalk.white.bold('int')}
${chalk.cyanBright('▓')}  ${chalk.cyan('▒▒▒▒')}
${chalk.cyanBright('▓')}  ${chalk.white.bold('ai')}
${chalk.cyanBright('▓')}  ${chalk.cyan('AI')} ${chalk.gray('Prospect Research')}
${chalk.cyanBright('▓')}                              ${chalk.cyanBright('▓')}
${chalk.cyanBright('▚▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄')}`;

// Tagline
const tagline = `
${chalk.gray('━'.repeat(47))}
  ${chalk.white('AI-powered prospect research ')}${chalk.cyan('for operators')}
  ${chalk.gray('Analyze • Detect • Outreach')}
${chalk.gray('━'.repeat(47))}`;

program
  .name('intai')
  .description(
    boxen(
      logo + tagline,
      {
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'classic',
        backgroundColor: 'black'
      }
    )
  )
  .version('0.1.0')
  .helpOption('-h, --help', 'Show help');

program.addCommand(createAnalyzeCommand());
program.addCommand(createOutreachCommand());
program.addCommand(createConfigCommand());

program.hook('postAction', async () => {
  process.exit(0);
});

program.parse();