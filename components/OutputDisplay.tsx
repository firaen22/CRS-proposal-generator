import React, { useEffect, useRef, useState } from 'react';
import { ProposalData } from '../types';

// Declare html2pdf on window for TypeScript
declare global {
  interface Window {
    html2pdf: any;
  }
}

interface OutputDisplayProps {
  data: ProposalData;
  onBack: () => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ data, onBack }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle PDF Generation (Client-Side Rendering)
  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    
    // Sanitize client name for filename usage
    const cleanName = data.client.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
    const filename = `${cleanName}_Offshore_Asset_Allocation.pdf`;

    // html2pdf Options
    const opt = {
      margin:       0, // We control margin via CSS padding in the container
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, letterRendering: true }, // Scale 2 for better text clarity
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Execute generation
      if (window.html2pdf) {
        await window.html2pdf().set(opt).from(reportRef.current).save();
      } else {
        alert("PDF generator library not loaded correctly. Please refresh.");
      }
    } catch (e) {
      console.error("PDF Generation failed:", e);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const formatMoney = (val: number) => val.toLocaleString();

  const getReturnRate = (val: number) => {
    if (data.premium.total === 0) return "0%";
    // Calculating Total Return % (Value / Premium)
    return ((val / data.premium.total) * 100).toFixed(0) + "%";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getRebateString = () => {
    const parts = [];
    if (data.promo.lumpSum.enabled) parts.push(`一笔过 ${data.promo.lumpSum.percent}%`);
    if (data.promo.fiveYear.enabled) parts.push(`5年缴 ${data.promo.fiveYear.percent}%`);
    return parts.length > 0 ? parts.join(", ") : "N/A";
  };

  const getPrepayString = () => {
    if (!data.promo.prepay.enabled) return "N/A";
    return `${data.promo.prepay.rate}%`;
  };

  const getPrepayDeadlineString = () => {
    if (!data.promo.prepay.enabled || !data.promo.prepay.deadline) return null;
    return `(至 ${formatDate(data.promo.prepay.deadline)})`;
  };

  // Infographic updated for Tax Compliance & Asset Safety
  const Infographic = () => (
    <div className="flex justify-center my-8 break-inside-avoid">
      <svg width="400" height="300" viewBox="-200 -150 400 300">
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="#B8860B" />
          </marker>
        </defs>
        
        {/* Connection Lines */}
        <line x1="0" y1="0" x2="0" y2="-100" stroke="#B8860B" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="0" y1="0" x2="-86.6" y2="50" stroke="#B8860B" strokeWidth="2" markerEnd="url(#arrow)" />
        <line x1="0" y1="0" x2="86.6" y2="50" stroke="#B8860B" strokeWidth="2" markerEnd="url(#arrow)" />

        {/* Center Node */}
        <circle cx="0" cy="0" r="55" fill="#FFF8DC" stroke="#B8860B" strokeWidth="2" />
        <text x="0" y="-5" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333" fontFamily="Noto Serif SC, serif">税务</text>
        <text x="0" y="15" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#333" fontFamily="Noto Serif SC, serif">合规</text>

        {/* Top Node */}
        <circle cx="0" cy="-100" r="42" fill="#212C3C" />
        <text x="0" y="-105" textAnchor="middle" fontSize="12" fill="white" fontFamily="Noto Sans SC, sans-serif">资产</text>
        <text x="0" y="-85" textAnchor="middle" fontSize="12" fill="white" fontFamily="Noto Sans SC, sans-serif">隔离</text>

        {/* Left Node */}
        <circle cx="-86.6" cy="50" r="42" fill="#212C3C" />
        <text x="-86.6" y="45" textAnchor="middle" fontSize="12" fill="white" fontFamily="Noto Sans SC, sans-serif">身份</text>
        <text x="-86.6" y="65" textAnchor="middle" fontSize="12" fill="white" fontFamily="Noto Sans SC, sans-serif">规划</text>

        {/* Right Node */}
        <circle cx="86.6" cy="50" r="42" fill="#212C3C" />
        <text x="86.6" y="45" textAnchor="middle" fontSize="12" fill="white" fontFamily="Noto Sans SC, sans-serif">流动</text>
        <text x="86.6" y="65" textAnchor="middle" fontSize="12" fill="white" fontFamily="Noto Sans SC, sans-serif">储备</text>
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-200 print:bg-white print:block print:h-auto print-parent-reset">
      
      {/* 1. Enhanced Toolbar (Visible on screen, hidden in print) */}
      <div className="bg-white px-6 py-4 border-b border-slate-300 flex justify-between items-center shadow-sm no-print sticky top-0 z-30">
        <div className="flex items-center space-x-2">
           <button 
             type="button"
             onClick={onBack} 
             className="text-slate-500 hover:text-slate-800 transition-colors" 
             title="Back to Edit"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           </button>
           <h2 className="text-xl font-bold text-slate-800 serif-font">Report Preview</h2>
        </div>
        
        <div className="flex space-x-3">
          <button 
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Edit Parameters
          </button>
          
          {/* Direct Download PDF Button (Client Side Generation) */}
          <button 
            type="button"
            onClick={handleDownloadPDF}
            disabled={isGenerating}
            className={`text-sm font-medium text-white px-6 py-2 rounded-lg shadow-md transition-all flex items-center transform 
              ${isGenerating ? 'bg-slate-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 hover:shadow-lg hover:-translate-y-0.5'}`}
          >
            {isGenerating ? (
              <>
                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* 
          2. Visual Report Container - A4 Simulation 
          We use a ref to capture this specific element for PDF generation.
          The 'print-container' styling ensures it looks like A4 on screen.
          When generating PDF, we don't want the outer background, just this white box.
      */}
      <div className="flex-1 overflow-auto p-8 flex justify-center print:p-0 print:overflow-visible print:block print:h-auto print-parent-reset">
        
        <div 
          ref={reportRef}
          className="print-container bg-white shadow-2xl mx-auto text-slate-900 relative flex flex-col p-[20mm] print:p-0 print:shadow-none" 
          style={{ width: '210mm', minHeight: '297mm' }}
        >
          
          {/* ================= PAGE 1 START ================= */}

          {/* Header */}
          <div className="border-b-2 border-amber-600 pb-4 mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold serif-font text-slate-900">离岸资产配置建议书</h1>
              <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest">Offshore Asset Allocation</p>
            </div>
            <div className="text-right">
              <div className="text-amber-600 font-bold text-lg">PB</div>
              <div className="text-xs text-slate-400">Risk & Compliance</div>
            </div>
          </div>

          {/* Client Overview */}
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-xl font-bold text-slate-800 serif-font mb-4 border-l-4 border-amber-500 pl-3">
              合规概览: {data.client.name}
            </h2>
            <p className="text-justify leading-relaxed text-slate-700 mb-4">
              <span className="font-bold">尊贵的 {data.client.name} 阁下</span>，鉴于内地“金税四期”大数据监管的全面启动，以及 CRS（共同汇报标准）对海外资产的穿透式交换，传统的资产持有方式已面临挑战。
              本建议书旨在利用“{data.planName}”搭建合规的资产隔离架构，协助您应对潜在的税务追征风险，并实现资产的合法跨境传承。
            </p>
            
            <div className="flex justify-between bg-slate-50 p-4 rounded border border-slate-100">
               <ul className="list-disc list-inside text-slate-700 space-y-1 text-sm">
                <li>总保费: USD {formatMoney(data.premium.total)}</li>
                <li>缴费方式: {data.premium.paymentType}</li>
              </ul>
              <div className="text-right text-sm text-slate-500">
                <div>风险对冲: <span className="font-semibold text-green-700">已配置</span></div>
                <div>资产属地: <span className="font-semibold text-amber-700">中国香港 (离岸)</span></div>
              </div>
            </div>
          </section>

          {/* Compliance Risk Alert Box */}
          <section className="mb-8 break-inside-avoid">
             <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                  <h3 className="text-sm font-bold text-red-800">当前关键风险提示 (Key Risk Alerts)</h3>
                </div>
                <ul className="text-xs text-red-700 space-y-1 ml-7 list-disc">
                   <li><span className="font-bold">金税四期 & CRS:</span> 账户信息自动比对，隐匿资产面临定性风险及 0.5-5 倍罚款。</li>
                   <li><span className="font-bold">滞纳金风险:</span> 长期未缴税款将产生<span className="font-bold underline">每年 18%</span> 的滞纳金，侵蚀资产本金。</li>
                   <li><span className="font-bold">身份规划:</span> 建议尽早配置香港身份 (优才/高才/投资移民)，转换税务居民身份以优化税务空间。</li>
                </ul>
             </div>
          </section>

          {/* Infographic - Expanded vertical space for Page 1 balance */}
          <div className="flex-1 flex flex-col justify-center">
             <Infographic />
          </div>

          {/* ================= PAGE BREAK ================= */}
          {/* Use standard html2pdf pagebreak class */}
          <div className="html2pdf__page-break"></div>
          
          {/* Visual spacer for screen mode to show separation */}
          <div className="w-full border-t-2 border-dashed border-slate-300 my-12 print:hidden relative" data-html2canvas-ignore="true">
            <span className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 bg-slate-200 px-2 text-xs text-slate-500">Page Break Preview</span>
          </div>

          {/* ================= PAGE 2 START ================= */}
          
          {/* Page 2 Header (Improve visual continuity on page 2) */}
          <div className="flex justify-between items-end border-b border-slate-200 pb-2 mb-8 pt-4">
              <div className="text-sm text-slate-500">Proposal for: <span className="font-bold text-slate-900">{data.client.name}</span></div>
              <div className="text-xs text-slate-400">Financial Projection (Page 2)</div>
          </div>

          {/* Scenario A Table */}
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-xl font-bold text-slate-800 serif-font mb-4 border-l-4 border-amber-500 pl-3">
              情境 A: 资产隔离与增值 (Asset Isolation)
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              利用保险架构的法律属性，实现资产与个人债务风险的有效隔离。身故赔偿金在一般情况下不纳入内地遗产税（如有）征收范围。
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="py-3 px-4 text-left">保单年度</th>
                  <th className="py-3 px-4 text-right">退保价值 (流动性)</th>
                  <th className="py-3 px-4 text-right">身故赔偿 (资产传承)</th>
                  <th className="py-3 px-4 text-right">总回报率 (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold">第 10 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioA.year10.surrender)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioA.year10.death)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioA.year10.surrender)}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold">第 20 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioA.year20.surrender)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioA.year20.death)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioA.year20.surrender)}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold">第 30 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioA.year30.surrender)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioA.year30.death)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioA.year30.surrender)}</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Scenario B Table */}
          <section className="mb-8 break-inside-avoid">
            <h2 className="text-xl font-bold text-slate-800 serif-font mb-4 border-l-4 border-amber-500 pl-3">
              情境 B: 税务流动性准备 (Tax Liquidity Reserve)
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              针对潜在的税务补缴需求或突发资金周转，本计划提供每年 <span className="font-bold text-slate-900">USD {formatMoney(data.scenarioB.annualWithdrawal)}</span> 的稳定现金流，避免因资金冻结而产生的滞纳金风险。
            </p>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="py-3 px-4 text-left">保单年度</th>
                  <th className="py-3 px-4 text-right">累计流动性提取</th>
                  <th className="py-3 px-4 text-right">剩余储备价值</th>
                  <th className="py-3 px-4 text-right">总回报率 (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold">第 10 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year10.cumulative)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year10.remaining)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioB.year10.cumulative + data.scenarioB.year10.remaining)}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold">第 20 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year20.cumulative)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year20.remaining)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioB.year20.cumulative + data.scenarioB.year20.remaining)}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold">第 30 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year30.cumulative)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year30.remaining)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioB.year30.cumulative + data.scenarioB.year30.remaining)}</td>
                </tr>
                <tr className="border-b border-slate-200 hover:bg-slate-50 bg-slate-50/50">
                  <td className="py-3 px-4 font-semibold">第 40 年</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year40.cumulative)}</td>
                  <td className="py-3 px-4 text-right">{formatMoney(data.scenarioB.year40.remaining)}</td>
                  <td className="py-3 px-4 text-right font-medium text-amber-700">{getReturnRate(data.scenarioB.year40.cumulative + data.scenarioB.year40.remaining)}</td>
                </tr>
              </tbody>
            </table>
          </section>

           {/* Promotions */}
           <section className="mb-auto break-inside-avoid">
            <h2 className="text-xl font-bold text-slate-800 serif-font mb-4 border-l-4 border-amber-500 pl-3">
              限时推广
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 border-t-2 border-slate-300">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">保费回赠</div>
                 <div className="text-slate-800 font-medium">{getRebateString()}</div>
              </div>
              <div className="bg-slate-50 p-4 border-t-2 border-slate-300">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">预缴利率 (锁定美息)</div>
                 <div className="text-slate-800 font-medium">{getPrepayString()} <span className="text-xs text-red-500 block sm:inline mt-1 sm:mt-0">{getPrepayDeadlineString()}</span></div>
              </div>
            </div>
          </section>

          {/* Footer / Disclaimer */}
          <div className="mt-8 pt-4 border-t border-slate-300 text-[10px] text-slate-500 text-justify break-inside-avoid">
            <span className="font-bold">合规免责声明:</span> 本文件仅供参考，不构成税务法律意见。税务后果取决于客户具体情况及当时法律，建议咨询专业税务顾问。关于香港身份规划、CRS申报及金税四期应对策略，请参阅银行提供的详细合规指引。投资涉及风险，过往表现不代表将来结果。
          </div>

        </div>
      </div>
    </div>
  );
};