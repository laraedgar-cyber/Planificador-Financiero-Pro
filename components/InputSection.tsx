import React from 'react';
import { SimulationInputs, TemporaryExpense, ChildExpense } from '../types';
import { Plus, Trash2, User, UserX, GraduationCap } from 'lucide-react';

interface Props {
  inputs: SimulationInputs;
  setInputs: React.Dispatch<React.SetStateAction<SimulationInputs>>;
}

export const InputSection: React.FC<Props> = ({ inputs, setInputs }) => {
  const handleChange = (field: keyof SimulationInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // --- Temporary Expenses Logic ---
  const addExpense = () => {
    const newExpense: TemporaryExpense = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Deuda/Gasto',
      monthlyAmount: 0,
      endYear: inputs.currentYear + 5,
    };
    setInputs(prev => ({
      ...prev,
      temporaryExpenses: [...prev.temporaryExpenses, newExpense]
    }));
  };

  const removeExpense = (id: string) => {
    setInputs(prev => ({
      ...prev,
      temporaryExpenses: prev.temporaryExpenses.filter(e => e.id !== id)
    }));
  };

  const updateExpense = (id: string, field: keyof TemporaryExpense, value: any) => {
    setInputs(prev => ({
      ...prev,
      temporaryExpenses: prev.temporaryExpenses.map(e => 
        e.id === id ? { ...e, [field]: value } : e
      )
    }));
  };

  // --- Children Logic ---
  const addChild = () => {
    if (inputs.children.length >= 5) return;
    const newChild: ChildExpense = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Hijo ${inputs.children.length + 1}`,
      monthlyEducationCost: 0,
      endYear: inputs.currentYear + 15,
    };
    setInputs(prev => ({
      ...prev,
      children: [...prev.children, newChild]
    }));
  };

  const removeChild = (id: string) => {
    setInputs(prev => ({
      ...prev,
      children: prev.children.filter(c => c.id !== id)
    }));
  };

  const updateChild = (id: string, field: keyof ChildExpense, value: any) => {
    setInputs(prev => ({
      ...prev,
      children: prev.children.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
      
      {/* 1. Datos Personales */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <User size={20} className="text-blue-600" /> 1. Datos Personales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Edad Actual</label>
            <input
              type="number"
              value={inputs.currentAge}
              onChange={(e) => handleChange('currentAge', Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Año de Inicio</label>
            <input
              type="number"
              value={inputs.currentYear}
              onChange={(e) => handleChange('currentYear', Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Ingreso Mensual (Neto)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400">Q</span>
              <input
                type="number"
                value={inputs.monthlyIncome}
                onChange={(e) => handleChange('monthlyIncome', Number(e.target.value))}
                className="w-full pl-8 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inputs.hasBono14}
              onChange={(e) => handleChange('hasBono14', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-slate-700">Bono 14</label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inputs.hasAguinaldo}
              onChange={(e) => handleChange('hasAguinaldo', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-slate-700">Aguinaldo</label>
          </div>

          <div className="md:col-span-2 space-y-1">
             <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                Bono Desempeño (Cant. Sueldos)
             </label>
             <input
                type="number"
                step="0.5"
                value={inputs.performanceBonusMonths}
                onChange={(e) => handleChange('performanceBonusMonths', Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 2. Variables Financieras */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">2. Variables Financieras</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Ahorro Actual (Capital)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400">Q</span>
              <input
                type="number"
                value={inputs.currentSavings}
                onChange={(e) => handleChange('currentSavings', Number(e.target.value))}
                className="w-full pl-8 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">% Ahorro Mensual</label>
            <div className="relative">
                <input
                  type="number"
                  value={inputs.savingsRate}
                  onChange={(e) => handleChange('savingsRate', Number(e.target.value))}
                  className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-slate-400">%</span>
            </div>
             <p className="text-[10px] text-slate-400">
              Solo s/sueldo mensual. Bonos 100% ahorro.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Retorno Inversión</label>
            <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.investmentReturnRate}
                  onChange={(e) => handleChange('investmentReturnRate', Number(e.target.value))}
                  className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-slate-400">%</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Inflación</label>
            <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.inflationRate}
                  onChange={(e) => handleChange('inflationRate', Number(e.target.value))}
                  className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-slate-400">%</span>
            </div>
          </div>

           <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-slate-500 uppercase">Incremento Salarial Anual</label>
            <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.salaryIncreaseRate}
                  onChange={(e) => handleChange('salaryIncreaseRate', Number(e.target.value))}
                  className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span className="absolute right-3 top-2 text-slate-400">%</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. Desvinculación / Retiro */}
      <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
        <h2 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
            <UserX size={20} /> 3. Desvinculación
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs font-semibold text-orange-700 uppercase">Edad de Retiro/Desvinculación</label>
                <input
                  type="number"
                  value={inputs.terminationAge}
                  onChange={(e) => handleChange('terminationAge', Number(e.target.value))}
                  className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
             </div>
             <div className="space-y-1">
                <label className="text-xs font-semibold text-orange-700 uppercase">Liquidación Estimada (Q)</label>
                <input
                  type="number"
                  value={inputs.severanceAmount}
                  onChange={(e) => handleChange('severanceAmount', Number(e.target.value))}
                  className="w-full p-2 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
             </div>
        </div>
        <p className="text-[11px] text-orange-600 mt-2 leading-tight">
            * A partir de esta edad, tus ingresos laborales y bonos serán 0. Vivirás de tus intereses y capital acumulado.
        </p>
      </div>

      <hr className="border-slate-100" />

      {/* 4. Educación Hijos */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <GraduationCap size={20} className="text-blue-600"/> 4. Educación Hijos
          </h2>
          <button 
            onClick={addChild}
            disabled={inputs.children.length >= 5}
            className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold hover:bg-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
          >
            <Plus size={14} /> Agregar ({inputs.children.length}/5)
          </button>
        </div>
        
        <div className="space-y-3">
          {inputs.children.map((child) => (
            <div key={child.id} className="bg-blue-50 p-3 rounded-lg border border-blue-100 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 md:col-span-5">
                <label className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Nombre</label>
                <input
                  type="text"
                  value={child.name}
                  onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                  className="w-full p-1.5 text-sm border border-blue-200 rounded focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <label className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Costo Mensual</label>
                <input
                  type="number"
                  value={child.monthlyEducationCost}
                  onChange={(e) => updateChild(child.id, 'monthlyEducationCost', Number(e.target.value))}
                  className="w-full p-1.5 text-sm border border-blue-200 rounded focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <label className="text-[10px] font-bold text-blue-400 uppercase block mb-1">Año Fin Pagos</label>
                <input
                  type="number"
                  value={child.endYear}
                  onChange={(e) => updateChild(child.id, 'endYear', Number(e.target.value))}
                  className="w-full p-1.5 text-sm border border-blue-200 rounded focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-center pb-2">
                <button 
                  onClick={() => removeChild(child.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {inputs.children.length === 0 && (
             <p className="text-sm text-slate-400 italic">No has agregado hijos aún.</p>
          )}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 5. Otros Gastos/Deudas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">5. Otros Gastos / Deudas</h2>
          <button 
            onClick={addExpense}
            className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold hover:bg-slate-200 transition-colors flex items-center gap-1"
          >
            <Plus size={14} /> Agregar
          </button>
        </div>
        
        <div className="space-y-3">
          {inputs.temporaryExpenses.map((expense) => (
            <div key={expense.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-12 gap-2 items-end">
              <div className="col-span-12 md:col-span-5">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Concepto</label>
                <input
                  type="text"
                  value={expense.name}
                  onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                  className="w-full p-1.5 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Mensual (Q)</label>
                <input
                  type="number"
                  value={expense.monthlyAmount}
                  onChange={(e) => updateExpense(expense.id, 'monthlyAmount', Number(e.target.value))}
                  className="w-full p-1.5 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-5 md:col-span-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Año Fin</label>
                <input
                  type="number"
                  value={expense.endYear}
                  onChange={(e) => updateExpense(expense.id, 'endYear', Number(e.target.value))}
                  className="w-full p-1.5 text-sm border border-slate-300 rounded focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2 md:col-span-1 flex justify-center pb-2">
                <button 
                  onClick={() => removeExpense(expense.id)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {inputs.temporaryExpenses.length === 0 && (
             <div className="text-center py-4 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                No hay otros flujos definidos.
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
