import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { analyzeBusiness } from '../analyzers/analysis.js';
import { parseUrl, isValidUrl } from '../utils/url.js';
import { closeBrowser } from '../services/scraper.js';
import type { AnalysisReport } from '../types/index.js';

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

export function createAnalyzeCommand(): Command {
  const command = new Command('analyze');
  command
    .description('Analyze a business website for operational inefficiencies')
    .argument('<url>', 'Website URL to analyze')
    .option('-j, --json', 'Output as JSON')
    .action(async (url: string, options: { json?: boolean }) => {
      const spinner = ora({
        text: colors.secondary('Initializing analysis...'),
        spinner: 'dots',
      }).start();

      try {
        if (!isValidUrl(url)) {
          spinner.fail(colors.danger('Invalid URL'));
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        spinner.text = colors.secondary('Scraping website...');

        const report = await analyzeBusiness(normalizedUrl);
        spinner.succeed(colors.accent('Analysis complete!'));

        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          printReport(report);
        }
      } catch (error) {
        spinner.fail(colors.danger('Analysis failed'));
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

function printReport(report: AnalysisReport): void {
  const divider = colors.muted('━'.repeat(50));

  console.log();
  console.log(divider);
  console.log();
  console.log(`  ${colors.primary('▸')} ${colors.text.bold('ANALYSIS REPORT')}`);
  console.log(`  ${colors.dim(report.websiteUrl)}`);
  console.log();
  console.log(divider);
  console.log();

  // Business name card
  console.log(
    boxen(
      `${colors.text.bold(' ' + (report.businessName || 'Unknown Business'))}\n` +
      colors.muted(` ${report.websiteUrl}`),
      {
        padding: 1,
        borderColor: 'cyan',
        borderStyle: 'classic',
        backgroundColor: 'black'
      }
    )
  );
  console.log();

  // Operational Signals
  if (report.operationalSignals.length > 0) {
    console.log(`  ${colors.primary('▸')} ${colors.text.bold('OPERATIONAL SIGNALS')}`);
    console.log(colors.muted('  ' + '─'.repeat(45)));
    report.operationalSignals.forEach((signal) => {
      const icon = signal.confidence === 'high'
        ? colors.accent('●')
        : signal.confidence === 'medium'
          ? colors.warning('●')
          : colors.muted('○');
      console.log();
      console.log(`    ${icon} ${colors.text(signal.indicator)}`);
      console.log(`    ${colors.dim(signal.evidence)}`);
    });
  }

  console.log();

  // Potential Problems
  if (report.potentialProblems.length > 0) {
    console.log(`  ${colors.danger('▸')} ${colors.text.bold('PROBLEMS DETECTED')}`);
    console.log(colors.muted('  ' + '─'.repeat(45)));
    report.potentialProblems.forEach((problem) => {
      const color = problem.severity === 'critical'
        ? colors.danger
        : problem.severity === 'moderate'
          ? colors.warning
          : colors.muted;
      const severity = `[${problem.severity.toUpperCase()}]`;
      console.log();
      console.log(`    ${colors.danger('■')} ${color(problem.problem)} ${colors.dim(severity)}`);
      console.log(`    ${colors.dim(problem.description)}`);
    });
  }

  console.log();

  // Suggested Tools
  if (report.suggestedTools.length > 0) {
    console.log(`  ${colors.accent('▸')} ${colors.text.bold('SUGGESTED TOOLS')}`);
    console.log(colors.muted('  ' + '─'.repeat(45)));
    report.suggestedTools.forEach((tool) => {
      const color = tool.priority === 'high'
        ? colors.accent
        : tool.priority === 'medium'
          ? colors.warning
          : colors.muted;
      console.log();
      console.log(`    ${color('▸')} ${colors.text(tool.tool)} ${colors.dim(`[${tool.priority}]`)}`);
      console.log(`    ${colors.dim(tool.rationale)}`);
    });
  }

  console.log();
  console.log(divider);
  console.log();

  // Summary
  console.log(`  ${colors.warning('▸')} ${colors.text.bold('SUMMARY')}`);
  console.log(colors.muted('  ' + '─'.repeat(45)));
  console.log();
  console.log(`  ${colors.text(report.summary)}`);

  // Tech stack
  if (report.detectedTechStack && report.detectedTechStack.length > 0) {
    console.log();
    console.log(`  ${colors.secondary('▸')} ${colors.text.bold('TECH STACK')}`);
    console.log(colors.muted('  ' + '─'.repeat(45)));
    console.log();
    console.log(`  ${report.detectedTechStack.map(t => colors.dim(t)).join(colors.muted(' · '))}`);
  }

  console.log();
  console.log(divider);
  console.log();
}