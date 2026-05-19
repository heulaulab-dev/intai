import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { generateOutreach } from '../analyzers/outreach.js';
import { parseUrl, isValidUrl } from '../utils/url.js';
import { closeBrowser } from '../services/scraper.js';
import type { OutreachMessage } from '../types/index.js';

// Projectdiscovery-inspired color palette
const colors = {
  bg: chalk.bgBlack,
  primary: chalk.cyanBright,
  secondary: chalk.cyan,
  accent: chalk.green,
  warning: chalk.yellow,
  danger: chalk.red,
  text: chalk.white,
  muted: chalk.gray,
  dim: chalk.dim,
};

export function createOutreachCommand(): Command {
  const command = new Command('outreach');
  command
    .description('Generate a personalized outreach message for a business')
    .argument('<url>', 'Website URL of the business')
    .option('-j, --json', 'Output as JSON')
    .action(async (url: string, options: { json?: boolean }) => {
      const spinner = ora({
        text: colors.secondary('Initializing outreach generator...'),
        spinner: 'dots',
      }).start();

      try {
        if (!isValidUrl(url)) {
          spinner.fail(colors.danger('Invalid URL'));
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        spinner.text = colors.secondary('Analyzing business & crafting message...');

        const message = await generateOutreach(normalizedUrl);
        spinner.succeed(colors.accent('Message crafted!'));

        if (options.json) {
          console.log(JSON.stringify(message, null, 2));
        } else {
          printOutreach(message);
        }
      } catch (error) {
        spinner.fail(colors.danger('Generation failed'));
        console.error();
        console.error(
          boxen(
            `${colors.danger('✗ Error')}\n\n${error instanceof Error ? error.message : 'Unknown error'}`,
            {
              padding: 1,
              borderColor: 'red',
              borderStyle: 'classic',
              backgroundColor: 'black'
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
  const divider = colors.muted('━'.repeat(50));

  console.log();
  console.log(divider);
  console.log();
  console.log(`  ${colors.accent('▸')} ${colors.text.bold('OUTREACH MESSAGE')}`);
  console.log(`  ${colors.dim(message.businessName)}`);
  console.log();
  console.log(divider);
  console.log();

  // To section
  console.log(`  ${colors.secondary('▸')} ${colors.text.bold('TO')}`);
  console.log(colors.muted('  ' + '─'.repeat(45)));
  console.log(`  ${colors.text(message.businessName)}`);
  console.log();

  // Subject
  console.log(`  ${colors.primary('▸')} ${colors.text.bold('SUBJECT')}`);
  console.log(colors.muted('  ' + '─'.repeat(45)));
  console.log(
    boxen(
      ` ${colors.accent(message.subject)} `,
      {
        padding: { top: 0, bottom: 0, left: 2, right: 2 },
        borderColor: 'green',
        borderStyle: 'classic',
        backgroundColor: 'black'
      }
    )
  );
  console.log();

  // Body
  console.log(`  ${colors.warning('▸')} ${colors.text.bold('MESSAGE')}`);
  console.log(colors.muted('  ' + '─'.repeat(45)));
  const lines = message.body.split('\n');
  lines.forEach((line) => {
    console.log(`  ${colors.text(line)}`);
  });
  console.log();

  // Pain Points
  if (message.keyPainPoints.length > 0) {
    console.log(`  ${colors.danger('▸')} ${colors.text.bold('PAIN POINTS')}`);
    console.log(colors.muted('  ' + '─'.repeat(45)));
    message.keyPainPoints.forEach((point) => {
      console.log(`    ${colors.danger('■')} ${colors.dim(point)}`);
    });
    console.log();
  }

  // Personalization
  if (message.personalizationNotes.length > 0) {
    console.log(`  ${colors.secondary('▸')} ${colors.text.bold('PERSONALIZATION')}`);
    console.log(colors.muted('  ' + '─'.repeat(45)));
    message.personalizationNotes.forEach((note) => {
      console.log(`    ${colors.primary('▸')} ${colors.dim(note)}`);
    });
    console.log();
  }

  console.log(divider);
  console.log();

  console.log(
    boxen(
      `${colors.warning('▸')} ${colors.text('Copy the message above and send it to ')}${colors.accent(message.businessName)}`,
      {
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'classic',
        backgroundColor: 'black'
      }
    )
  );
  console.log();
}