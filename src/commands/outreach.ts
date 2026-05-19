import { Command } from 'commander';
import chalk from 'chalk';
import { generateOutreach } from '../analyzers/outreach.js';
import { parseUrl, isValidUrl } from '../utils/url.js';
import { closeBrowser } from '../services/scraper.js';
import type { OutreachMessage } from '../types/index.js';

export function createOutreachCommand(): Command {
  const command = new Command('outreach');
  command
    .description('Generate a personalized outreach message for a business')
    .argument('<url>', 'Website URL of the business')
    .option('-j, --json', 'Output as JSON')
    .action(async (url: string, options: { json?: boolean }) => {
      try {
        if (!isValidUrl(url)) {
          console.error(chalk.red('Error: Invalid URL provided'));
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        const message = await generateOutreach(normalizedUrl);

        if (options.json) {
          console.log(JSON.stringify(message, null, 2));
        } else {
          printOutreach(message);
        }
      } catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error');
        process.exit(1);
      } finally {
        await closeBrowser();
      }
    });

  return command;
}

function printOutreach(message: OutreachMessage): void {
  console.log(chalk.bold.cyan('\n[OUTREACH MESSAGE]\n'));

  console.log(chalk.bold('To:'));
  console.log(`  ${chalk.white(message.businessName)}\n`);

  console.log(chalk.bold('Subject:'));
  console.log(`  ${chalk.green(message.subject)}\n`);

  console.log(chalk.bold('Body:'));
  const lines = message.body.split('\n');
  lines.forEach((line) => {
    console.log(`  ${chalk.white(line)}`);
  });
  console.log();

  console.log(chalk.bold('Personalization Notes:'));
  message.personalizationNotes.forEach((note) => {
    console.log(`  ${chalk.gray('•')} ${chalk.gray(note)}`);
  });
  console.log();
}