export interface TemporaryExpense {
  id: string;
  name: string;
  monthlyAmount: number;
  endYear: number;
}

export interface ChildExpense {
  id: string;
  name: string;
  monthlyEducationCost: number;
  endYear: number;
}

export interface SimulationInputs {
  currentAge: number;
  currentYear: number;
  monthlyIncome: number;
  hasBono14: boolean;
  hasAguinaldo: boolean;
  performanceBonusMonths: number; // 0 if none
  savingsRate: number; // Percentage 0-100
  currentSavings: number;
  inflationRate: number; // Percentage
  investmentReturnRate: number; // Percentage
  salaryIncreaseRate: number; // Percentage
  
  // New Termination Fields
  terminationAge: number;
  severanceAmount: number;
  
  // Expenses
  temporaryExpenses: TemporaryExpense[];
  children: ChildExpense[];
}

export interface YearlyResult {
  year: number;
  age: number;
  annualIncome: number;
  annualSpending: number;
  annualSavingsContribution: number;
  totalAccumulatedSavings: number;
  passiveIncomeAnnual: number;
  passiveIncomeMonthly: number;
  costOfLivingMonthly: number;
  isRetired: boolean;
  isWorking: boolean; // To track active employment phase
}

export interface SimulationResult {
  data: YearlyResult[];
  retirementAge: number | null; // Financial independence age (calculated)
  retirementYear: number | null;
}
