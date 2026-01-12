import React from 'react';
import { SimulationResult, YearlyResult } from '../types';
import { formatCurrency } from '../utils/calculations';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, ReferenceDot, ReferenceLine
} from 'recharts';
import { TrendingUp, DollarSign, Calendar, AlertCircle, TrendingDown } from 'lucide-react';

interface Props {
  result: SimulationResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg z-50">
        <p className="font-bold text-slate-700 mb-2">Año {label} (Edad {data.age})</p>
        <div className="space-y-1">
             {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs" style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
        </div>
        {!data.isWorking && (
            <div className="mt-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-orange-500 block">Etapa: Retiro/Desvinculado</span>
                {data.totalAccumulatedSavings < 0 && (
                    <span className="text-xs font-bold text-red-500 block">⚠️ Capital Agotado</span>
                )}
            </div>
        )}
      </div>
    );
  }
  return null;
};

export const ResultsSection: React.FC<Props> = ({ result }) => {
  const { data, retirementAge, retirementYear } = result;

  // Find the crossover data point for the dot
  const crossoverPoint = data.find(d => d.passiveIncomeMonthly >= d.costOfLivingMonthly);
  
  // Find first point of bankruptcy if any
  const bankruptcyPoint = data.find(d => d.totalAccumulatedSavings < 0);
  
  // Find termination year to draw a line
  const terminationPoint = data.find(d => !d.isWorking);

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-5 rounded-xl border ${retirementAge ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Libertad Financiera (Intereses &gt; Gastos)</p>
              <h3 className={`text-3xl font-bold ${retirementAge ? 'text-green-700' : 'text-slate-700'}`}>
                {retirementAge ? `${retirementAge} Años` : 'N/A'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {retirementYear ? `En el año ${retirementYear}` : 'No proyectada en este periodo'}
              </p>
            </div>
            <div className={`p-2 rounded-full ${retirementAge ? 'bg-green-200 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
               <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
           <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Ahorro Final (45 años)</p>
              <h3 className={`text-2xl font-bold ${data[data.length-1]?.totalAccumulatedSavings < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {formatCurrency(data[data.length-1]?.totalAccumulatedSavings || 0)}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Capital proyectado al final</p>
            </div>
            <div className="p-2 rounded-full bg-blue-50 text-blue-600">
               <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
           <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Estado Capital</p>
              {bankruptcyPoint ? (
                  <div>
                    <h3 className="text-xl font-bold text-red-600">Se agota a los {bankruptcyPoint.age} años</h3>
                    <p className="text-xs text-red-400 mt-1">¡Cuidado! El dinero no alcanza.</p>
                  </div>
              ) : (
                  <div>
                    <h3 className="text-xl font-bold text-green-600">Sostenible</h3>
                    <p className="text-xs text-green-400 mt-1">El capital nunca se agota.</p>
                  </div>
              )}
            </div>
            <div className={`p-2 rounded-full ${bankruptcyPoint ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
               {bankruptcyPoint ? <AlertCircle size={24} /> : <DollarSign size={24} />}
            </div>
          </div>
        </div>
      </div>

      {/* Main Intersection Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-2">Interés Generado vs. Costo de Vida</h3>
        <p className="text-sm text-slate-500 mb-6">
          Punto de libertad: Intereses (Morado) supera Gastos (Naranja). La línea gris marca tu retiro laboral.
        </p>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis 
                tickFormatter={(val) => `Q${(val/1000).toFixed(0)}k`} 
                stroke="#94a3b8" 
                tick={{fontSize: 12}}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36}/>
              
              {terminationPoint && (
                <ReferenceLine x={terminationPoint.year} stroke="#94a3b8" strokeDasharray="3 3" label={{ position: 'top',  value: 'Retiro', fill: '#94a3b8', fontSize: 10 }} />
              )}

              <Line 
                type="monotone" 
                dataKey="passiveIncomeMonthly" 
                name="Interés Mensual" 
                stroke="#7c3aed" 
                strokeWidth={3}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="costOfLivingMonthly" 
                name="Costo de Vida Mensual" 
                stroke="#f97316" 
                strokeWidth={3}
                dot={false}
              />
              {crossoverPoint && (
                <ReferenceDot 
                  x={crossoverPoint.year} 
                  y={crossoverPoint.passiveIncomeMonthly} 
                  r={6} 
                  fill="#10b981" 
                  stroke="#fff"
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Wealth Accumulation Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Evolución del Capital</h3>
        <p className="text-xs text-slate-500 mb-4">Si la curva cae por debajo de 0, significa que tus ahorros se agotaron.</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="year" stroke="#94a3b8" tick={{fontSize: 12}} />
              <YAxis 
                tickFormatter={(val) => `Q${(val/1000000).toFixed(1)}M`} 
                stroke="#94a3b8" 
                tick={{fontSize: 12}}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip content={<CustomTooltip />} />
              {terminationPoint && (
                <ReferenceLine x={terminationPoint.year} stroke="#94a3b8" strokeDasharray="3 3" />
              )}
              <Area 
                type="monotone" 
                dataKey="totalAccumulatedSavings" 
                name="Capital Acumulado" 
                stroke="#2563eb" 
                fillOpacity={1} 
                fill="url(#colorSavings)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Detailed Table (Preview) */}
       <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
         <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h3 className="font-bold text-slate-700">Detalle: Próximos 15 años</h3>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Año (Edad)</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Gasto Mes</th>
                  <th className="px-4 py-3 text-right">Interés Mes</th>
                  <th className="px-4 py-3 text-right">Capital</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 15).map((row) => (
                  <tr key={row.year} className={`border-b border-slate-100 hover:bg-slate-50 ${row.totalAccumulatedSavings < 0 ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-3 font-medium">{row.year} ({row.age})</td>
                    <td className="px-4 py-3">
                       {row.isWorking ? (
                           <span className="text-blue-600 font-semibold text-xs">Trabajando</span>
                       ) : (
                           <span className="text-orange-600 font-semibold text-xs">Retirado</span>
                       )}
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(row.costOfLivingMonthly)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-purple-600">{formatCurrency(row.passiveIncomeMonthly)}</td>
                    <td className={`px-4 py-3 text-right font-mono ${row.totalAccumulatedSavings < 0 ? 'text-red-600 font-bold' : 'text-blue-600'}`}>
                        {formatCurrency(row.totalAccumulatedSavings)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
       </div>

    </div>
  );
};
