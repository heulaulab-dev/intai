export interface OperationalSignal {
  indicator: string;
  confidence: 'high' | 'medium' | 'low';
  evidence: string;
}

export interface PotentialProblem {
  problem: string;
  severity: 'critical' | 'moderate' | 'minor';
  description: string;
}

export interface SuggestedTool {
  tool: string;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisReport {
  businessName: string;
  websiteUrl: string;
  operationalSignals: OperationalSignal[];
  potentialProblems: PotentialProblem[];
  suggestedTools: SuggestedTool[];
  summary: string;
  detectedTechStack: string[];
}

export interface OutreachMessage {
  businessName: string;
  subject: string;
  body: string;
  keyPainPoints: string[];
  personalizationNotes: string[];
}

export interface ScraperResult {
  title: string;
  content: string;
  url: string;
  error?: string;
}