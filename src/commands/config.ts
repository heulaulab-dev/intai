import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { homedir } from 'os';
import { join } from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';

interface Config {
  apiKey?: string;
  baseURL?: string;
  model?: string;
}

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
          } else if (key === 'base-url' || key === 'base_url') {
            config.baseURL = value;
          } else if (key === 'model') {
            config.model = value;
          } else {
            console.error();
            console.error(colors.danger('✗ ') + colors.danger(`Unknown configuration key: ${key}`));
            process.exit(1);
          }

          saveConfig(config);
          console.log();
          console.log(
            boxen(
              `${colors.accent('✓')} ${colors.text.bold(key)} has been set\n${colors.dim('Stored in ~/.intai/config.json')}`,
              { padding: 1, borderColor: 'green', borderStyle: 'classic', backgroundColor: 'black' }
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
          const divider = colors.muted('━'.repeat(50));

          console.log();
          console.log(divider);
          console.log();
          console.log(`  ${colors.secondary('▸')} ${colors.text.bold('CONFIGURATION')}`);
          console.log();
          console.log(divider);
          console.log();

          if (!key) {
            // Show all config
            if (config.apiKey) {
              console.log(`  ${colors.dim('api-key:')} ${colors.accent('••••••••')}${colors.dim(' ✓')}`);
            } else {
              console.log(`  ${colors.dim('api-key:')} ${colors.warning('not set')}`);
            }
            if (config.baseURL) {
              console.log(`  ${colors.dim('base-url:')} ${colors.accent(config.baseURL)}`);
            } else {
              console.log(`  ${colors.dim('base-url:')} ${colors.warning('not set')}`);
            }
            if (config.model) {
              console.log(`  ${colors.dim('model:')} ${colors.accent(config.model)}`);
            } else {
              console.log(`  ${colors.dim('model:')} ${colors.warning('not set (default: gpt-4o)')}`);
            }
            console.log();
          } else {
            if (key === 'api-key' || key === 'api_key') {
              if (config.apiKey) {
                console.log(`  ${colors.dim('api-key:')}`);
                console.log(`  ${colors.accent(config.apiKey)}`);
              } else {
                console.error();
                console.error(colors.warning('⚠ api-key is not set'));
                process.exit(1);
              }
            } else if (key === 'base-url' || key === 'base_url') {
              if (config.baseURL) {
                console.log(`  ${colors.dim('base-url:')}`);
                console.log(`  ${colors.accent(config.baseURL)}`);
              } else {
                console.error();
                console.error(colors.warning('⚠ base-url is not set'));
                process.exit(1);
              }
            } else if (key === 'model') {
              if (config.model) {
                console.log(`  ${colors.dim('model:')}`);
                console.log(`  ${colors.accent(config.model)}`);
              } else {
                console.error();
                console.error(colors.warning('⚠ model is not set (default: gpt-4o)'));
                process.exit(1);
              }
            } else {
              console.error();
              console.error(colors.danger('✗ ') + colors.danger(`Unknown configuration key: ${key}`));
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
              console.log(colors.accent('✓ api-key has been removed'));
            } else {
              console.error();
              console.error(colors.warning('⚠ api-key was not set'));
              process.exit(1);
            }
          } else if (key === 'base-url' || key === 'base_url') {
            if (config.baseURL) {
              delete config.baseURL;
              saveConfig(config);
              console.log();
              console.log(colors.accent('✓ base-url has been removed'));
            } else {
              console.error();
              console.error(colors.warning('⚠ base-url was not set'));
              process.exit(1);
            }
          } else if (key === 'model') {
            if (config.model) {
              delete config.model;
              saveConfig(config);
              console.log();
              console.log(colors.accent('✓ model has been removed'));
            } else {
              console.error();
              console.error(colors.warning('⚠ model was not set'));
              process.exit(1);
            }
          } else {
            console.error();
            console.error(colors.danger('✗ ') + colors.danger(`Unknown configuration key: ${key}`));
            process.exit(1);
          }
        })
    );

  return command;
}

export function getStoredApiKey(): string | undefined {
  return loadConfig().apiKey;
}