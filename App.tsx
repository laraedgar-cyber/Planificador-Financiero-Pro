import React, { useState, useMemo } from 'react';
import { SimulationInputs } from './types';
import { calculateSimulation } from './utils/calculations';
import { InputSection } from './components/InputSection';
import { ResultsSection } from './components/ResultsSection';

const App: React.FC = () => {
  // Default values based on the prompt's context (Guatemala/LATAM typical)
  const [inputs, setInputs] = useState<SimulationInputs>({
    currentAge: 35,
    currentYear: new Date().getFullYear(),
    monthlyIncome: 14000,
    hasBono14: true,
    hasAguinaldo: true,
    performanceBonusMonths: 0,
    savingsRate: 10,
    currentSavings: 35000,
    inflationRate: 4.0,
    investmentReturnRate: 6.0,
    salaryIncreaseRate: 3.0,
    
    // New Defaults
    terminationAge: 60,
    severanceAmount: 150000,
    children: [
        { id: 'c1', name: 'Hijo 1', monthlyEducationCost: 2500, endYear: 2035 }
    ],

    temporaryExpenses: [
      { id: '1', name: 'Pago de Casa', monthlyAmount: 4500, endYear: 2040 }
    ]
  });

  const simulationResult = useMemo(() => calculateSimulation(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
      <header className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-blue-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-lg">P</div>
             <h1 className="text-xl font-bold tracking-tight">Planificador Pro</h1>
          </div>
          <div className="text-xs text-slate-400 hidden md:block">
            Proyección a largo plazo
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Sidebar - Inputs */}
          <div className="lg:col-span-4 h-full pb-20 lg:pb-0">
            <InputSection inputs={inputs} setInputs={setInputs} />
          </div>

          {/* Right Area - Visualization */}
          <div className="lg:col-span-8 h-full pb-10">
            <ResultsSection result={simulationResult} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
