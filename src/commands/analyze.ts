import { Command } from 'commander';
import chalk from 'chalk';
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
      try {
        if (!isValidUrl(url)) {
          console.error(chalk.red('Error: Invalid URL provided'));
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        const report = await analyzeBusiness(normalizedUrl);

        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          printReport(report);
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

function printReport(report: AnalysisReport): void {
  console.log(chalk.bold.cyan('\n[INTAI REPORT]\n'));

  console.log(chalk.bold('Business:'));
  console.log(`  ${chalk.white(report.businessName || 'Unknown')}\n`);

  console.log(chalk.bold('Operational Signals:'));
  if (report.operationalSignals.length === 0) {
    console.log(`  ${chalk.gray('None detected')}`);
  } else {
    report.operationalSignals.forEach((signal) => {
      const confidenceIcon = signal.confidence === 'high' ? '✓✓' : signal.confidence === 'medium' ? '✓' : '~';
      console.log(`  ${chalk.green(confidenceIcon)} ${signal.indicator}`);
      console.log(`    ${chalk.gray(signal.evidence)}`);
    });
  }
  console.log();

  console.log(chalk.bold('Potential Problems:'));
  if (report.potentialProblems.length === 0) {
    console.log(`  ${chalk.gray('None identified')}`);
  } else {
    report.potentialProblems.forEach((problem) => {
      const severityColor = problem.severity === 'critical' ? chalk.red : problem.severity === 'moderate' ? chalk.yellow : chalk.gray;
      console.log(`  ${severityColor('•')} ${problem.problem} ${chalk.gray(`(${problem.severity})`)}`);
      console.log(`    ${chalk.gray(problem.description)}`);
    });
  }
  console.log();

  console.log(chalk.bold('Suggested Internal Tools:'));
  if (report.suggestedTools.length === 0) {
    console.log(`  ${chalk.gray('None suggested')}`);
  } else {
    report.suggestedTools.forEach((tool) => {
      const priorityColor = tool.priority === 'high' ? chalk.green : tool.priority === 'medium' ? chalk.yellow : chalk.gray;
      console.log(`  ${priorityColor('→')} ${tool.tool} ${chalk.gray(`(${tool.priority})`)}`);
      console.log(`    ${chalk.gray(tool.rationale)}`);
    });
  }
  console.log();

  console.log(chalk.bold('Summary:'));
  console.log(`  ${chalk.white(report.summary)}`);
  console.log();

  if (report.detectedTechStack && report.detectedTechStack.length > 0) {
    console.log(chalk.bold('Detected Tech Stack:'));
    console.log(`  ${chalk.gray(report.detectedTechStack.join(', '))}`);
    console.log();
  }
}