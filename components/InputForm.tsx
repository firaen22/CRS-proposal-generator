import React from 'react';
import { ProposalData, ScenarioValue, ScenarioBValue } from '../types';

interface InputFormProps {
  data: ProposalData;
  onChange: (data: ProposalData) => void;
  onSubmit: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit }) => {
  
  const handleChange = (section: keyof ProposalData, field: string, value: any, subField?: string) => {
    const newData = { ...data };
    if (subField) {
      // Handle nested objects like scenarioA.year10.surrender or promo.lumpSum.enabled
      (newData[section] as any)[field][subField] = value;
    } else if (typeof (newData[section] as any)[field] === 'object') {
       // Should not happen with current logic normally
    } else {
      (newData[section] as any)[field] = value;
    }
    onChange(newData);
  };

  const handleScenarioAChange = (year: 'year10' | 'year20' | 'year30', type: keyof ScenarioValue, value: number) => {
    const newData = { ...data };
    newData.scenarioA[year][type] = value;
    onChange(newData);
  };

  const handleScenarioBChange = (year: 'year10' | 'year20' | 'year30' | 'year40', type: keyof ScenarioBValue, value: number) => {
    const newData = { ...data };
    newData.scenarioB[year][type] = value;
    onChange(newData);
  };

  return (
    <div className="bg-white shadow-xl rounded-lg p-8 border-t-4 border-amber-600">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 serif-font">Proposal Parameters</h2>
        <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">Private Banking Division</span>
      </div>

      <div className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <section>
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Client & Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Client Name</label>
              <input 
                type="text" 
                value={data.client.name} 
                onChange={(e) => handleChange('client', 'name', e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Age</label>
              <input 
                type="number" 
                value={data.client.age} 
                onChange={(e) => handleChange('client', 'age', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Plan Name</label>
              <input 
                type="text" 
                value={data.planName} 
                onChange={(e) => handleChange('planName', '', e.target.value)} 
                onInput={(e) => onChange({...data, planName: e.currentTarget.value})}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Total Premium ($)</label>
              <input 
                type="number" 
                value={data.premium.total} 
                onChange={(e) => handleChange('premium', 'total', parseInt(e.target.value) || 0)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Payment Type</label>
              <select 
                value={data.premium.paymentType} 
                onChange={(e) => handleChange('premium', 'paymentType', e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
              >
                <option value="整付">整付 (Lump Sum)</option>
                <option value="5年">5年 (5 Years)</option>
                <option value="10年">10年 (10 Years)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Scenario A */}
        <section>
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Scenario A: Capital Accumulation</h3>
          <div className="grid grid-cols-1 gap-4">
            {['year10', 'year20', 'year30'].map((year) => (
              <div key={year} className="flex flex-col md:flex-row md:items-center gap-4 p-3 bg-slate-50 rounded-md">
                <span className="w-20 text-sm font-bold text-slate-500 uppercase">{year.replace('year', 'Yr ')}</span>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500">Surrender Value</label>
                  <input 
                    type="number" 
                    value={data.scenarioA[year as keyof typeof data.scenarioA].surrender}
                    onChange={(e) => handleScenarioAChange(year as any, 'surrender', parseInt(e.target.value) || 0)}
                    className="w-full rounded border-slate-200 text-sm bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500">Death Benefit</label>
                  <input 
                    type="number" 
                    value={data.scenarioA[year as keyof typeof data.scenarioA].death}
                    onChange={(e) => handleScenarioAChange(year as any, 'death', parseInt(e.target.value) || 0)}
                    className="w-full rounded border-slate-200 text-sm bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Scenario B */}
        <section>
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Scenario B: Passive Income</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700">Annual Withdrawal Amount ($)</label>
            <input 
              type="number" 
              value={data.scenarioB.annualWithdrawal} 
              onChange={(e) => handleChange('scenarioB', 'annualWithdrawal', parseInt(e.target.value) || 0)}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-amber-500 focus:ring-amber-500 sm:text-sm bg-white"
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            {['year10', 'year20', 'year30', 'year40'].map((year) => (
              <div key={year} className="flex flex-col md:flex-row md:items-center gap-4 p-3 bg-slate-50 rounded-md">
                <span className="w-20 text-sm font-bold text-slate-500 uppercase">{year.replace('year', 'Yr ')}</span>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500">Cumulative Withdrawn</label>
                  <input 
                    type="number" 
                    value={data.scenarioB[year as keyof typeof data.scenarioB].cumulative}
                    onChange={(e) => handleScenarioBChange(year as any, 'cumulative', parseInt(e.target.value) || 0)}
                    className="w-full rounded border-slate-200 text-sm bg-white"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500">Remaining Value</label>
                  <input 
                    type="number" 
                    value={data.scenarioB[year as keyof typeof data.scenarioB].remaining}
                    onChange={(e) => handleScenarioBChange(year as any, 'remaining', parseInt(e.target.value) || 0)}
                    className="w-full rounded border-slate-200 text-sm bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Promo */}
        <section>
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Promotions</h3>
          <div className="space-y-4">
            
            {/* Rebate Offer - Lump Sum */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-bold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={data.promo.lumpSum.enabled}
                    onChange={(e) => handleChange('promo', 'lumpSum', e.target.checked, 'enabled')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mr-2"
                  />
                  Rebate: 一筆過 (Lump Sum)
                </label>
                {data.promo.lumpSum.enabled && (
                  <div className="flex items-center w-32">
                    <input 
                      type="number" 
                      value={data.promo.lumpSum.percent}
                      onChange={(e) => handleChange('promo', 'lumpSum', parseFloat(e.target.value), 'percent')}
                      className="w-full rounded-l-md border-slate-300 text-sm text-right bg-white"
                    />
                    <span className="bg-slate-200 px-2 py-2 rounded-r-md border border-l-0 border-slate-300 text-xs text-slate-600">%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rebate Offer - 5 Year */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-bold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={data.promo.fiveYear.enabled}
                    onChange={(e) => handleChange('promo', 'fiveYear', e.target.checked, 'enabled')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mr-2"
                  />
                  Rebate: 5年繳 (5-Year Payment)
                </label>
                {data.promo.fiveYear.enabled && (
                  <div className="flex items-center w-32">
                    <input 
                      type="number" 
                      value={data.promo.fiveYear.percent}
                      onChange={(e) => handleChange('promo', 'fiveYear', parseFloat(e.target.value), 'percent')}
                      className="w-full rounded-l-md border-slate-300 text-sm text-right bg-white"
                    />
                    <span className="bg-slate-200 px-2 py-2 rounded-r-md border border-l-0 border-slate-300 text-xs text-slate-600">%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prepayment Interest */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center text-sm font-bold text-slate-700">
                  <input 
                    type="checkbox"
                    checked={data.promo.prepay.enabled}
                    onChange={(e) => handleChange('promo', 'prepay', e.target.checked, 'enabled')}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded mr-2"
                  />
                  Prepayment Interest (預繳利率)
                </label>
              </div>
              
              {data.promo.prepay.enabled && (
                <div className="grid grid-cols-2 gap-4 pl-6">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Interest Rate</label>
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        value={data.promo.prepay.rate}
                        onChange={(e) => handleChange('promo', 'prepay', parseFloat(e.target.value), 'rate')}
                        className="w-full rounded-l-md border-slate-300 text-sm text-right bg-white"
                        step="0.1"
                      />
                      <span className="bg-slate-200 px-2 py-2 rounded-r-md border border-l-0 border-slate-300 text-xs text-slate-600">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Offer Deadline</label>
                    <input 
                      type="date" 
                      value={data.promo.prepay.deadline}
                      onChange={(e) => handleChange('promo', 'prepay', e.target.value, 'deadline')}
                      className="w-full rounded-md border-slate-300 text-sm bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        <div className="pt-6">
          <button
            onClick={onSubmit}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all"
          >
            Generate Proposal (PDF Report)
          </button>
        </div>
      </div>
    </div>
  );
};