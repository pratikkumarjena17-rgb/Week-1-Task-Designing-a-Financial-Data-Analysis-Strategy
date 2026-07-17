export interface FinancialMetric {
  name: string;
  category: "Profitability" | "Liquidity" | "Efficiency" | "Growth" | "Valuation" | "SaaS";
  formula: string;
  justification: string;
  typicalRange: string;
  pythonCalculations: string; // pseudo-code fragment
}

export interface SectorTemplate {
  id: string;
  name: string;
  description: string;
  defaultGoal: string;
  introduction: string;
  defaultMetrics: FinancialMetric[];
  methodology: string;
  risks: string;
  contingencies: string;
  conclusion: string;
}

export interface StrategyReport {
  title: string;
  executiveSummary: string;
  introduction: string;
  selectedSector: string;
  targetGoal: string;
  metrics: FinancialMetric[];
  methodologySteps: string;
  risks: string;
  contingencies: string;
  conclusion: string;
  pythonCode: string;
}

export interface SimulationScenario {
  name: string;
  revenueGrowth: number; // e.g. 0.15 for 15%
  expenseRatio: number;  // e.g. 0.70 for 70% of revenue
  startingCapital: number;
}
