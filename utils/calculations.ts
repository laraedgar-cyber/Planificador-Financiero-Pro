import { SimulationInputs, SimulationResult, YearlyResult } from '../types';

export const calculateSimulation = (inputs: SimulationInputs): SimulationResult => {
  const {
    currentAge,
    currentYear,
    monthlyIncome,
    hasBono14,
    hasAguinaldo,
    performanceBonusMonths,
    savingsRate,
    currentSavings,
    inflationRate,
    investmentReturnRate,
    salaryIncreaseRate,
    terminationAge,
    severanceAmount,
    temporaryExpenses,
    children,
  } = inputs;

  const data: YearlyResult[] = [];
  let accumulatedSavings = currentSavings;
  let fiAge: number | null = null; // Financial Independence Age
  let fiYear: number | null = null;

  // 1. Establish Baseline for Cost of Living
  // We calculate spending based on regular monthly income only.
  // Assumption: User lives off their regular salary (minus savings).
  const initialRegularAnnualIncome = monthlyIncome * 12;
  const initialRegularSavings = initialRegularAnnualIncome * (savingsRate / 100);
  
  // Total Spendable Base = Regular Income - Regular Savings
  const initialTotalAnnualSpend = initialRegularAnnualIncome - initialRegularSavings;

  // Calculate annualized specific expenses to isolate "Core Lifestyle"
  const totalTemporaryAnnual = temporaryExpenses.reduce((sum, exp) => sum + (exp.monthlyAmount * 12), 0);
  const totalChildrenAnnual = children.reduce((sum, child) => sum + (child.monthlyEducationCost * 12), 0);
  
  // Core Lifestyle is the remainder after paying specific debts/education. 
  // This part is subject to inflation.
  let coreLifestyleAnnual = Math.max(0, initialTotalAnnualSpend - totalTemporaryAnnual - totalChildrenAnnual);

  const projectionYears = 45; // Extended projection to see long term retirement

  for (let i = 0; i <= projectionYears; i++) {
    const year = currentYear + i;
    const age = currentAge + i;

    // Determine if user is still working based on termination age input
    const isWorking = age < terminationAge;
    const isTerminationYear = age === terminationAge;

    // --- INCOME CALCULATIONS ---
    let annualIncome = 0;
    let annualRegularIncome = 0;
    let annualBonusIncome = 0;

    if (isWorking) {
        // Apply salary increase
        const currentMonthlyIncome = monthlyIncome * Math.pow(1 + salaryIncreaseRate / 100, i);
        const bonusMonths = (hasBono14 ? 1 : 0) + (hasAguinaldo ? 1 : 0) + performanceBonusMonths;
        
        annualRegularIncome = currentMonthlyIncome * 12;
        annualBonusIncome = currentMonthlyIncome * bonusMonths;
        annualIncome = annualRegularIncome + annualBonusIncome;
    } else {
        // Post-termination: No Salary.
        annualIncome = 0;
    }

    // --- EXPENSE CALCULATIONS ---
    // Core lifestyle grows with inflation
    const inflatedCoreLifestyle = coreLifestyleAnnual * Math.pow(1 + inflationRate / 100, i);
    
    // Add active temporary expenses (Debts)
    let activeTemporaryExpenses = 0;
    temporaryExpenses.forEach(exp => {
      if (year <= exp.endYear) {
        // Apply inflation to expenses? Usually debts are fixed nominal, but let's keep them fixed as per standard loans.
        activeTemporaryExpenses += exp.monthlyAmount * 12;
      }
    });

    // Add active Children expenses
    let activeChildrenExpenses = 0;
    children.forEach(child => {
      if (year <= child.endYear) {
        // Education costs usually inflate. Applying inflation to school costs.
        activeChildrenExpenses += (child.monthlyEducationCost * 12) * Math.pow(1 + inflationRate / 100, i);
      }
    });

    const totalAnnualSpending = inflatedCoreLifestyle + activeTemporaryExpenses + activeChildrenExpenses;
    const monthlyCostOfLiving = totalAnnualSpending / 12;

    // --- SAVINGS & CAPITAL FLOW ---
    let annualSavingsContribution = 0;

    if (isWorking) {
        // Regular Savings + 100% Bonuses
        const regularSavingsContribution = annualRegularIncome * (savingsRate / 100);
        const bonusSavingsContribution = annualBonusIncome;
        annualSavingsContribution = regularSavingsContribution + bonusSavingsContribution;
    }
    
    // Severance Injection
    if (isTerminationYear) {
        accumulatedSavings += severanceAmount;
    }

    // --- INVESTMENT RETURN ---
    // Interest is earned on the capital at the start of the year
    // If working, we add interest on half the contribution (averaging).
    // If retired, we calculate interest, then subtract spending (drawdown).
    
    const passiveIncomeAnnual = accumulatedSavings * (investmentReturnRate / 100);
    const passiveIncomeMonthly = passiveIncomeAnnual / 12;

    if (isWorking) {
        // Accumulation Phase
        const interestOnNewSavings = (annualSavingsContribution / 2) * (investmentReturnRate / 100);
        accumulatedSavings += annualSavingsContribution + passiveIncomeAnnual + interestOnNewSavings;
    } else {
        // Decumulation / Survival Phase
        // Capital = Previous Capital + Interest - Spending
        // If Interest > Spending, Capital grows. If Interest < Spending, Capital shrinks.
        accumulatedSavings = accumulatedSavings + passiveIncomeAnnual - totalAnnualSpending;
    }

    // --- FINANCIAL INDEPENDENCE CHECK ---
    // Point where passive income covers expenses
    let isFi = false;
    if (passiveIncomeMonthly >= monthlyCostOfLiving && fiAge === null) {
      fiAge = age;
      fiYear = year;
      isFi = true;
    } else if (fiAge !== null) {
        isFi = true;
    }

    data.push({
      year,
      age,
      annualIncome,
      annualSpending: totalAnnualSpending,
      annualSavingsContribution: isWorking ? annualSavingsContribution : 0,
      totalAccumulatedSavings: accumulatedSavings,
      passiveIncomeAnnual,
      passiveIncomeMonthly,
      costOfLivingMonthly: monthlyCostOfLiving,
      isRetired: isFi,
      isWorking
    });
  }

  return {
    data,
    retirementAge: fiAge,
    retirementYear: fiYear
  };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    maximumFractionDigits: 0,
  }).format(amount);
};
