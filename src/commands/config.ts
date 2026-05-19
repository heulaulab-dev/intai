import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { homedir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

interface Config {
  apiKey?: string;
}

const CONFIG_DIR = join(homedir(), '.intai');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

function loadConfig(): Config {
  try {
    if (existsSync(CONFIG_FILE)) {
      return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    }
  } catch {
    // Return empty config on error
  }
  return {};
}

function saveConfig(config: Config): void {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

export function createConfigCommand(): Command {
  const command = new Command('config');

  command
    .description('Manage intai configuration')
    .addCommand(
      new Command('set')
        .description('Set configuration value')
        .argument('<key>', 'Configuration key (e.g., api-key)')
        .argument('<value>', 'Configuration value')
        .action((key: string, value: string) => {
          const config = loadConfig();

          if (key === 'api-key' || key === 'api_key') {
            config.apiKey = value;
          } else {
            console.error();
            console.error(chalk.red('✗ ') + chalk.red(`Unknown configuration key: ${key}`));
            process.exit(1);
          }

          saveConfig(config);
          console.log();
          console.log(
            boxen(
              `${chalk.green('✓')} ${chalk.bold(key)} has been set\n${chalk.gray('Stored in ~/.intai/config.json')}`,
              { padding: 1, borderColor: 'green', borderStyle: 'round' }
            )
          );
        })
    )
    .addCommand(
      new Command('get')
        .description('Get configuration value')
        .argument('[key]', 'Configuration key to retrieve')
        .action((key?: string) => {
          const config = loadConfig();

          console.log();
          console.log(chalk.cyan('━'.repeat(45)));
          console.log(chalk.bold.cyan('  ⚙  CONFIGURATION'));
          console.log(chalk.cyan('━'.repeat(45)));
          console.log();

          if (!key) {
            // Show all config
            if (config.apiKey) {
              console.log(`  ${chalk.gray('api-key:')} ${chalk.green('••••••••')}${chalk.gray(' ✓')}`);
            } else {
              console.log(`  ${chalk.gray('api-key:')} ${chalk.yellow('not set')}`);
            }
            console.log();
          } else {
            if (key === 'api-key' || key === 'api_key') {
              if (config.apiKey) {
                console.log(`  ${chalk.gray('api-key:')}`);
                console.log(`  ${chalk.green(config.apiKey)}`);
              } else {
                console.error();
                console.error(chalk.yellow('⚠ api-key is not set'));
                process.exit(1);
              }
            } else {
              console.error();
              console.error(chalk.red('✗ ') + chalk.red(`Unknown configuration key: ${key}`));
              process.exit(1);
            }
          }
          console.log();
        })
    )
    .addCommand(
      new Command('unset')
        .description('Remove configuration value')
        .argument('<key>', 'Configuration key to remove')
        .action((key: string) => {
          const config = loadConfig();

          if (key === 'api-key' || key === 'api_key') {
            if (config.apiKey) {
              delete config.apiKey;
              saveConfig(config);
              console.log();
              console.log(chalk.green('✓ api-key has been removed'));
            } else {
              console.error();
              console.error(chalk.yellow('⚠ api-key was not set'));
              process.exit(1);
            }
          } else {
            console.error();
            console.error(chalk.red('✗ ') + chalk.red(`Unknown configuration key: ${key}`));
            process.exit(1);
          }
        })
    );

  return command;
}

export function getStoredApiKey(): string | undefined {
  return loadConfig().apiKey;
}