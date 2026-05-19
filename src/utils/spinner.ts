import chalk from 'chalk';
import ora, { type Ora } from 'ora';

// Projectdiscovery-inspired color palette
const colors = {
  secondary: chalk.cyan,
  accent: chalk.green,
  danger: chalk.red,
};

let spinner: Ora | null = null;

export function startSpinner(text: string): void {
  spinner = ora({
    text: colors.secondary(text),
    spinner: 'dots',
    color: 'cyan',
  }).start();
}

export function succeedSpinner(text: string): void {
  if (spinner) {
    spinner.succeed(colors.accent(text));
    spinner = null;
  }
}

export function failSpinner(text: string): void {
  if (spinner) {
    spinner.fail(colors.danger(text));
    spinner = null;
  }
}

export function stopSpinner(): void {
  if (spinner) {
    spinner.stop();
    spinner = null;
  }
}