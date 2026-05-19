#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { createAnalyzeCommand } from './commands/analyze.js';
import { createOutreachCommand } from './commands/outreach.js';
import { createConfigCommand } from './commands/config.js';

const program = new Command();

const logo = `
${chalk.cyan('╔════╗')} ${chalk.cyan('╔════╗')} ${chalk.cyan('╔╗')}
${chalk.cyan('║╔╗╔╗')} ${chalk.cyan('║╔╗╔╗')} ${chalk.cyan('║║')}
${chalk.cyan('╚╝║║╚╝')} ${chalk.cyan('╚╝║║╚╝')} ${chalk.cyan('║║')}
${chalk.cyan('   ║║')} ${chalk.cyan('   ║║')} ${chalk.cyan('║║')}
${chalk.cyan('   ╚╝')} ${chalk.cyan('   ╚╝')} ${chalk.cyan('╚╝')}
${chalk.bold('  AI Prospect Research CLI')}
`;

program
  .name('intai')
  .description(
    boxen(
      logo + '\n' +
      chalk.gray('-'.repeat(35)) + '\n\n' +
      chalk.white('AI-assisted prospect research for operators.\n') +
      chalk.gray('Analyze businesses, detect inefficiencies,\n') +
      chalk.gray('craft personalized outreach.'),
      { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
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