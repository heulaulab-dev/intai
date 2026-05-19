import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { analyzeBusiness, setProgressCallback, type AnalyzeProgress, type ProgressStage } from '../analyzers/analysis.js';
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

const stageConfig: Record<ProgressStage, { icon: string; color: typeof colors.text; label: string }> = {
  'init': { icon: '⚡', color: colors.secondary, label: 'INIT' },
  'env-check': { icon: '🔍', color: colors.secondary, label: 'ENV' },
  'url-parse': { icon: '🎯', color: colors.primary, label: 'URL' },
  'scraper-init': { icon: '🕷️', color: colors.secondary, label: 'SCRAPER' },
  'scraping': { icon: '⬇️', color: colors.secondary, label: 'FETCH' },
  'scraped': { icon: '✅', color: colors.accent, label: 'DONE' },
  'content-check': { icon: '🔧', color: colors.secondary, label: 'PROCESS' },
  'ai-prepare': { icon: '📦', color: colors.warning, label: 'PREP' },
  'ai-send': { icon: '📤', color: colors.warning, label: 'SEND' },
  'ai-waiting': { icon: '🧠', color: colors.warning, label: 'THINK' },
  'ai-response': { icon: '📥', color: colors.accent, label: 'RECV' },
  'ai-parsing': { icon: '⚙️', color: colors.secondary, label: 'PARSE' },
  'complete': { icon: '✨', color: colors.accent, label: 'DONE' },
  'error': { icon: '❌', color: colors.danger, label: 'ERROR' },
};

function formatProgress(progress: AnalyzeProgress): string {
  const config = stageConfig[progress.stage] || { icon: '•', color: colors.text, label: '---' };

  const mainLine = `${config.icon} ${config.color.bold(config.label)} ${config.color(progress.message)}`;

  if (progress.details) {
    return `${mainLine}\n  ${colors.dim(progress.details)}`;
  }

  return mainLine;
}

export function createAnalyzeCommand(): Command {
  const command = new Command('analyze');
  command
    .description('Analyze a business website for operational inefficiencies')
    .argument('<url>', 'Website URL to analyze')
    .option('-j, --json', 'Output as JSON')
    .action(async (url: string, options: { json?: boolean }) => {
      console.log();
      console.log(colors.dim('  Starting analysis...'));
      console.log();

      setProgressCallback((progress: AnalyzeProgress) => {
        const lines = formatProgress(progress).split('\n');
        lines.forEach(line => {
          console.log(`  ${line}`);
        });
      });

      try {
        if (!isValidUrl(url)) {
          console.log();
          console.log(
            boxen(
              `${colors.danger('✗ Invalid URL')}\n\n${colors.muted('Please provide a valid URL like https://example.com')}`,
              { padding: 1, borderColor: 'red', borderStyle: 'classic', backgroundColor: 'black' }
            )
          );
          process.exit(1);
        }

        const normalizedUrl = parseUrl(url);
        console.log(colors.dim(`  └─ ${normalizedUrl}`));
        console.log();

        const report = await analyzeBusiness(normalizedUrl);

        console.log();
        if (options.json) {
          console.log(JSON.stringify(report, null, 2));
        } else {
          printReport(report);
        }
      } catch (error) {
        console.log();
        console.error(
          boxen(
            `${colors.danger('✗ Analysis Failed')}\n\n${error instanceof Error ? error.message : 'Unknown error'}`,
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
        setProgressCallback(null);
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