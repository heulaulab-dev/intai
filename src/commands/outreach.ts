import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
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
      const spinner = ora({
        text: chalk.cyan('Initializing outreach generator...'),
        spinner: 'dots',
      }).start();

      try {
        if (!isValidUrl(url)) {
          spinner.fail(chalk.red('Invalid URL'));
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        spinner.text = chalk.cyan('Analyzing business & crafting message...');

        const message = await generateOutreach(normalizedUrl);
        spinner.succeed(chalk.green('Message crafted!'));

        if (options.json) {
          console.log(JSON.stringify(message, null, 2));
        } else {
          printOutreach(message);
        }
      } catch (error) {
        spinner.fail(chalk.red('Generation failed'));
        console.error();
        console.error(
          boxen(
            `${chalk.red('✗ Error')}\n\n${error instanceof Error ? error.message : 'Unknown error'}`,
            {
              padding: 1,
              borderColor: 'red',
              borderStyle: 'round',
            }
          )
        );
        process.exit(1);
      } finally {
        await closeBrowser();
      }
    });

  return command;
}

function printOutreach(message: OutreachMessage): void {
  console.log();
  console.log(chalk.cyan('━'.repeat(45)));
  console.log(chalk.bold.cyan('  ✉  OUTREACH MESSAGE'));
  console.log(chalk.cyan('━'.repeat(45)));
  console.log();

  // To
  console.log(chalk.bold('  📍 TO'));
  console.log(chalk.gray('  ' + '─'.repeat(40)));
  console.log(`  ${chalk.white(message.businessName)}`);
  console.log();

  // Subject
  console.log(chalk.bold('  📌 SUBJECT'));
  console.log(chalk.gray('  ' + '─'.repeat(40)));
  console.log(
    boxen(
      ` ${chalk.green(message.subject)} `,
      { padding: { top: 0, bottom: 0, left: 2, right: 2 }, borderColor: 'green', borderStyle: 'round' }
    )
  );
  console.log();

  // Body
  console.log(chalk.bold('  📝 MESSAGE'));
  console.log(chalk.gray('  ' + '─'.repeat(40)));
  const lines = message.body.split('\n');
  lines.forEach((line) => {
    console.log(`  ${chalk.white(line)}`);
  });
  console.log();

  // Pain Points
  if (message.keyPainPoints.length > 0) {
    console.log(chalk.bold('  🎯 PAIN POINTS'));
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    message.keyPainPoints.forEach((point) => {
      console.log(`    ${chalk.red('•')} ${chalk.gray(point)}`);
    });
    console.log();
  }

  // Personalization
  if (message.personalizationNotes.length > 0) {
    console.log(chalk.bold('  ✨ PERSONALIZATION'));
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    message.personalizationNotes.forEach((note) => {
      console.log(`    ${chalk.cyan('›')} ${chalk.gray(note)}`);
    });
    console.log();
  }

  console.log(chalk.cyan('━'.repeat(45)));
  console.log();

  console.log(
    boxen(
      `${chalk.cyan('✋')} ${chalk.white('Copy the message above and send it to ')}${chalk.yellow(message.businessName)}`,
      { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
    )
  );
  console.log();
}