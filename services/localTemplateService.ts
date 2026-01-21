import { ProposalData } from "../types";

export const generateLocalProposal = (data: ProposalData): string => {
  const rebateParts = [];
  if (data.promo.lumpSum.enabled) rebateParts.push(`一筆過 ${data.promo.lumpSum.percent}\\%`);
  if (data.promo.fiveYear.enabled) rebateParts.push(`5年繳 ${data.promo.fiveYear.percent}\\%`);
  const rebateString = rebateParts.length > 0 ? rebateParts.join(", ") : "N/A";

  const prepayString = data.promo.prepay.enabled 
    ? `${data.promo.prepay.rate}\\%`
    : "N/A";
  
  const prepayNote = data.promo.prepay.enabled ? `(注意: 優惠截止至 ${data.promo.prepay.deadline})` : "";

  const getReturnRate = (val: number) => {
    if (data.premium.total === 0) return "0\\%";
    return ((val / data.premium.total) * 100).toFixed(0) + "\\%";
  };

  return `\\documentclass[a4paper,12pt]{article}
\\usepackage{geometry}
\\geometry{top=2.5cm, bottom=2.5cm, left=2.5cm, right=2.5cm}
\\usepackage{fontspec}
\\usepackage{xeCJK}
\\usepackage{babel}
\\usepackage{tikz}
\\usepackage{array}
\\usepackage{booktabs}
\\usepackage{xcolor}
\\usepackage{colortbl}
\\usepackage{graphicx}
\\usepackage{float}

% Fonts Configuration
\\setmainfont{Noto Sans}
\\setCJKmainfont{Noto Sans CJK TC}

% Color Definitions
\\definecolor{pbGold}{RGB}{184, 134, 11}
\\definecolor{pbDark}{RGB}{33, 44, 60}
\\definecolor{pbLight}{RGB}{245, 245, 245}
\\definecolor{pbRed}{RGB}{185, 28, 28}

\\title{\\bfseries\\color{pbDark} 跨境財富保全建議書}
\\author{Private Banking Division}
\\date{\\today}

\\begin{document}

\\maketitle
\\thispagestyle{empty}

\\section*{合規概覽: ${data.client.name}}

\\textbf{尊貴的 ${data.client.name} 閣下}，鑒於內地「金稅四期」大數據監管的全面啟動，以及 CRS（共同匯報標準）對海外資產的穿透式交換，傳統的資產持有方式已面臨挑戰。本建議書旨在利用「${data.planName}」搭建合規的資產隔離架構，協助您應對潛在的稅務追徵風險，並實現資產的合法跨境傳承。

\\vspace{1em}
\\noindent
\\textbf{保費資訊:}
\\begin{itemize}
    \\item 總保費: USD ${data.premium.total.toLocaleString()}
    \\item 繳費方式: ${data.premium.paymentType}
\\end{itemize}

\\vspace{1em}
\\noindent
\\colorbox{pbRed!10}{\\parbox{\\dimexpr\\linewidth-2\\fboxsep}{
  \\textbf{\\textcolor{pbRed}{當前關鍵風險提示 (Risk Alerts):}}
  \\begin{itemize}
    \\item \\textbf{金稅四期 & CRS:} 帳戶資訊自動比對，隱匿資產面臨定性風險及 0.5-5 倍罰款。
    \\item \\textbf{滯納金風險:} 長期未繳稅款將產生 \\textbf{每年 18\\%} 的滯納金。
    \\item \\textbf{身份規劃:} 建議儘早配置香港身份，轉換稅務居民身份以優化稅務空間。
  \\end{itemize}
}}

\\vspace{2em}
\\begin{center}
\\begin{tikzpicture}
    % Circular Infographic - Updated for Tax Context
    \\node[circle, draw=pbGold, line width=2pt, minimum size=4cm, align=center, fill=pbGold!10] (core) at (0,0) {\\textbf{稅務}\\\\\\textbf{合規}};
    
    \\node[circle, fill=pbDark, text=white, minimum size=2.5cm, align=center] (isolation) at (90:3.5cm) {資產\\\\隔離};
    \\node[circle, fill=pbDark, text=white, minimum size=2.5cm, align=center] (identity) at (210:3.5cm) {身份\\\\規劃};
    \\node[circle, fill=pbDark, text=white, minimum size=2.5cm, align=center] (liquidity) at (330:3.5cm) {流動\\\\儲備};
    
    \\draw[->, >=latex, line width=1.5pt, pbGold] (core) -- (isolation);
    \\draw[->, >=latex, line width=1.5pt, pbGold] (core) -- (identity);
    \\draw[->, >=latex, line width=1.5pt, pbGold] (core) -- (liquidity);
\\end{tikzpicture}
\\end{center}

\\newpage

\\section*{情境 A: 資產隔離與增值 (Asset Isolation)}

利用保險架構的法律屬性，實現資產與個人債務風險的有效隔離。

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.5}
\\begin{tabular}{c|c|c|c}
\\hline
\\rowcolor{pbDark!10} \\textbf{保單年度} & \\textbf{退保價值 (流動性)} & \\textbf{身故賠償 (資產傳承)} & \\textbf{總回報率 (\\%)} \\\\
\\hline
第 10 年 & ${data.scenarioA.year10.surrender.toLocaleString()} & ${data.scenarioA.year10.death.toLocaleString()} & ${getReturnRate(data.scenarioA.year10.surrender)} \\\\
第 20 年 & ${data.scenarioA.year20.surrender.toLocaleString()} & ${data.scenarioA.year20.death.toLocaleString()} & ${getReturnRate(data.scenarioA.year20.surrender)} \\\\
第 30 年 & ${data.scenarioA.year30.surrender.toLocaleString()} & ${data.scenarioA.year30.death.toLocaleString()} & ${getReturnRate(data.scenarioA.year30.surrender)} \\\\
\\hline
\\end{tabular}
\\caption{資產隔離效益}
\\end{table}

\\section*{情境 B: 稅務流動性準備 (Tax Liquidity Reserve)}

針對潛在的稅務補繳需求或突發資金周轉，提供每年 \\textbf{USD ${data.scenarioB.annualWithdrawal.toLocaleString()}} 的穩定現金流，避免滯納金風險。

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.5}
\\begin{tabular}{c|c|c|c}
\\hline
\\rowcolor{pbDark!10} \\textbf{保單年度} & \\textbf{累計流動性提取} & \\textbf{剩餘儲備價值} & \\textbf{總回報率 (\\%)} \\\\
\\hline
第 10 年 & ${data.scenarioB.year10.cumulative.toLocaleString()} & ${data.scenarioB.year10.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year10.cumulative + data.scenarioB.year10.remaining)} \\\\
第 20 年 & ${data.scenarioB.year20.cumulative.toLocaleString()} & ${data.scenarioB.year20.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year20.cumulative + data.scenarioB.year20.remaining)} \\\\
第 30 年 & ${data.scenarioB.year30.cumulative.toLocaleString()} & ${data.scenarioB.year30.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year30.cumulative + data.scenarioB.year30.remaining)} \\\\
第 40 年 & ${data.scenarioB.year40.cumulative.toLocaleString()} & ${data.scenarioB.year40.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year40.cumulative + data.scenarioB.year40.remaining)} \\\\
\\hline
\\end{tabular}
\\caption{流動性儲備展示}
\\end{table}

\\section*{限時推廣}

\\begin{description}
    \\item[保費回贈:] ${rebateString}
    \\item[預繳利率 (鎖定美息):] ${prepayString} ${prepayNote}
\\end{description}

\\vfill
\\noindent
\\rule{\\linewidth}{0.5pt}
\\vspace{0.5em}
\\scriptsize
\\textbf{合規免責聲明:} 本文件僅供參考，不構成稅務法律意見。稅務後果取決於客戶具體情況及當時法律，建議諮詢專業稅務顧問。關於香港身份規劃、CRS申報及金稅四期應對策略，請參閱銀行提供的詳細合規指引。

\\end{document}`;
};