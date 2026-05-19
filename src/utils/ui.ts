import chalk from 'chalk';

const logo = `
${chalk.cyan('    _        _              _   ')}
${chalk.cyan('   (_)___   / /_____ ______(_)  ')}
${chalk.cyan('  / / __ \\ / __/ __ `/ ___/ /   ')}
${chalk.cyan(' / / / / // /_/ /_/ / /  / /    ')}
${chalk.cyan('/_/_/ /_/ \\__/\\__,_/_/  /_/     ')}
${chalk.cyan('                                ')}
${chalk.gray('           by heulaulab')}
`;

export function printBanner(): void {
  console.log(chalk.bold(logo));
  console.log(chalk.gray('─'.repeat(40)));
  console.log();
}

export function printSuccess(message: string): void {
  console.log(chalk.green('✓ ') + message);
}

export function printError(message: string): void {
  console.error(chalk.red('✗ ') + message);
}

export function printWarning(message: string): void {
  console.warn(chalk.yellow('⚠ ') + message);
}

export function printInfo(message: string): void {
  console.log(chalk.blue('ℹ ') + message);
}

export function printSection(title: string): void {
  console.log();
  console.log(chalk.bold.cyan(`━━━ ${title} ━━━`));
}

export function printKeyValue(key: string, value: string, color = chalk.white): void {
  console.log(`  ${chalk.gray(key)}: ${color(value)}`);
}

export function printDivider(): void {
  console.log(chalk.gray('─'.repeat(40)));
}