import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { analyzeBusiness } from '../analyzers/analysis.js';
import { parseUrl, isValidUrl } from '../utils/url.js';
import { closeBrowser } from '../services/scraper.js';
import type { AnalysisReport } from '../types/index.js';

export function createAnalyzeCommand(): Command {
  const command = new Command('analyze');
  command
    .description('Analyze a business website for operational inefficiencies')
    .argument('<url>', 'Website URL to analyze')
    .option('-j, --json', 'Output as JSON')
    .action(async (url: string, options: { json?: boolean }) => {
      const spinner = ora({
        text: chalk.cyan('Initializing analysis...'),
        spinner: 'dots',
      }).start();

      try {
        if (!isValidUrl(url)) {
          spinner.fail(chalk.red('Invalid URL'));
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        spinner.text = chalk.cyan('Scraping website...');

        const report = await analyzeBusiness(normalizedUrl);
        spinner.succeed(chalk.green('Analysis complete!'));

        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          printReport(report);
        }
      } catch (error) {
        spinner.fail(chalk.red('Analysis failed'));
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

function printReport(report: AnalysisReport): void {
  console.log();
  console.log(chalk.cyan('━'.repeat(45)));
  console.log(chalk.bold.cyan('  📊 ANALYSIS REPORT'));
  console.log(chalk.cyan('━'.repeat(45)));
  console.log();

  // Business name
  console.log(
    boxen(
      `${chalk.bold.white(' ' + (report.businessName || 'Unknown Business'))}\n` +
      chalk.gray(` ${report.websiteUrl}`),
      { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
    )
  );
  console.log();

  // Operational Signals
  if (report.operationalSignals.length > 0) {
    console.log(chalk.bold('  ⚡ OPERATIONAL SIGNALS'));
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    report.operationalSignals.forEach((signal, i) => {
      const icon = signal.confidence === 'high' ? chalk.green('✓') : signal.confidence === 'medium' ? chalk.yellow('~') : chalk.gray('○');
      console.log();
      console.log(`    ${icon} ${chalk.white(signal.indicator)}`);
      console.log(`       ${chalk.gray(signal.evidence)}`);
      if (i < report.operationalSignals.length - 1) console.log();
    });
  }

  console.log();

  // Potential Problems
  if (report.potentialProblems.length > 0) {
    console.log(chalk.bold('  🎯 PROBLEMS DETECTED'));
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    report.potentialProblems.forEach((problem) => {
      const color = problem.severity === 'critical' ? chalk.red : problem.severity === 'moderate' ? chalk.yellow : chalk.gray;
      const severity = `[${problem.severity.toUpperCase()}]`;
      console.log();
      console.log(`    ${chalk.red('●')} ${color(problem.problem)} ${chalk.gray(severity)}`);
      console.log(`       ${chalk.gray(problem.description)}`);
    });
  }

  console.log();

  // Suggested Tools
  if (report.suggestedTools.length > 0) {
    console.log(chalk.bold('  🛠  SUGGESTED TOOLS'));
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    report.suggestedTools.forEach((tool) => {
      const color = tool.priority === 'high' ? chalk.green : tool.priority === 'medium' ? chalk.yellow : chalk.gray;
      console.log();
      console.log(`    ${color('→')} ${chalk.white(tool.tool)} ${chalk.gray(`[${tool.priority}]`)}`);
      console.log(`       ${chalk.gray(tool.rationale)}`);
    });
  }

  console.log();
  console.log(chalk.cyan('━'.repeat(45)));
  console.log();

  // Summary
  console.log(chalk.bold('  💡 SUMMARY'));
  console.log(chalk.gray('  ' + '─'.repeat(40)));
  console.log();
  console.log(`  ${chalk.white(report.summary)}`);

  // Tech stack
  if (report.detectedTechStack && report.detectedTechStack.length > 0) {
    console.log();
    console.log(chalk.bold('  🔧 TECH STACK'));
    console.log(chalk.gray('  ' + '─'.repeat(40)));
    console.log();
    console.log(`  ${chalk.gray(report.detectedTechStack.join(chalk.gray(' • ')))}`);
  }

  console.log();
  console.log(chalk.cyan('━'.repeat(45)));
  console.log();
}