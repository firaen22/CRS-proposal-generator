import { ProposalData } from "../types";

export const generateLocalProposal = (data: ProposalData): string => {
  const rebateParts = [];
  if (data.promo.lumpSum.enabled) rebateParts.push(`一笔过 ${data.promo.lumpSum.percent}\\%`);
  if (data.promo.fiveYear.enabled) rebateParts.push(`5年缴 ${data.promo.fiveYear.percent}\\%`);
  const rebateString = rebateParts.length > 0 ? rebateParts.join(", ") : "N/A";

  const prepayString = data.promo.prepay.enabled 
    ? `${data.promo.prepay.rate}\\%`
    : "N/A";
  
  const prepayNote = data.promo.prepay.enabled ? `(注意: 优惠截止至 ${data.promo.prepay.deadline})` : "";

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
\\setCJKmainfont{Noto Sans CJK SC}

% Color Definitions
\\definecolor{pbGold}{RGB}{184, 134, 11}
\\definecolor{pbDark}{RGB}{33, 44, 60}
\\definecolor{pbLight}{RGB}{245, 245, 245}
\\definecolor{pbRed}{RGB}{185, 28, 28}

\\title{\\bfseries\\color{pbDark} 离岸资产配置建议书}
\\author{Private Banking Division}
\\date{\\today}

\\begin{document}

\\maketitle
\\thispagestyle{empty}

\\section*{合规概览: ${data.client.name}}

\\textbf{尊贵的 ${data.client.name} 阁下}，鉴于内地“金税四期”大数据监管的全面启动，以及 CRS（共同汇报标准）对海外资产的穿透式交换，传统的资产持有方式已面临挑战。本建议书旨在利用“${data.planName}”搭建合规的资产隔离架构，协助您应对潜在的税务追征风险，并实现资产的合法跨境传承。

\\vspace{1em}
\\noindent
\\textbf{保费信息:}
\\begin{itemize}
    \\item 总保费: USD ${data.premium.total.toLocaleString()}
    \\item 缴费方式: ${data.premium.paymentType}
\\end{itemize}

\\vspace{1em}
\\noindent
\\colorbox{pbRed!10}{\\parbox{\\dimexpr\\linewidth-2\\fboxsep}{
  \\textbf{\\textcolor{pbRed}{当前关键风险提示 (Risk Alerts):}}
  \\begin{itemize}
    \\item \\textbf{金税四期 & CRS:} 账户信息自动比对，隐匿资产面临定性风险及 0.5-5 倍罚款。
    \\item \\textbf{滞纳金风险:} 长期未缴税款将产生 \\textbf{每年 18\\%} 的滞纳金。
    \\item \\textbf{身份规划:} 建议尽早配置香港身份，转换税务居民身份以优化税务空间。
  \\end{itemize}
}}

\\vspace{2em}
\\begin{center}
\\begin{tikzpicture}
    % Circular Infographic - Updated for Tax Context
    \\node[circle, draw=pbGold, line width=2pt, minimum size=4cm, align=center, fill=pbGold!10] (core) at (0,0) {\\textbf{税务}\\\\\\textbf{合规}};
    
    \\node[circle, fill=pbDark, text=white, minimum size=2.5cm, align=center] (isolation) at (90:3.5cm) {资产\\\\隔离};
    \\node[circle, fill=pbDark, text=white, minimum size=2.5cm, align=center] (identity) at (210:3.5cm) {身份\\\\规划};
    \\node[circle, fill=pbDark, text=white, minimum size=2.5cm, align=center] (liquidity) at (330:3.5cm) {流动\\\\储备};
    
    \\draw[->, >=latex, line width=1.5pt, pbGold] (core) -- (isolation);
    \\draw[->, >=latex, line width=1.5pt, pbGold] (core) -- (identity);
    \\draw[->, >=latex, line width=1.5pt, pbGold] (core) -- (liquidity);
\\end{tikzpicture}
\\end{center}

\\newpage

\\section*{情境 A: 资产隔离与增值 (Asset Isolation)}

利用保险架构的法律属性，实现资产与个人债务风险的有效隔离。

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.5}
\\begin{tabular}{c|c|c|c}
\\hline
\\rowcolor{pbDark!10} \\textbf{保单年度} & \\textbf{退保价值 (流动性)} & \\textbf{身故赔偿 (资产传承)} & \\textbf{总回报率 (\\%)} \\\\
\\hline
第 10 年 & ${data.scenarioA.year10.surrender.toLocaleString()} & ${data.scenarioA.year10.death.toLocaleString()} & ${getReturnRate(data.scenarioA.year10.surrender)} \\\\
第 20 年 & ${data.scenarioA.year20.surrender.toLocaleString()} & ${data.scenarioA.year20.death.toLocaleString()} & ${getReturnRate(data.scenarioA.year20.surrender)} \\\\
第 30 年 & ${data.scenarioA.year30.surrender.toLocaleString()} & ${data.scenarioA.year30.death.toLocaleString()} & ${getReturnRate(data.scenarioA.year30.surrender)} \\\\
\\hline
\\end{tabular}
\\caption{资产隔离效益}
\\end{table}

\\section*{情境 B: 税务流动性准备 (Tax Liquidity Reserve)}

针对潜在的税务补缴需求或突发资金周转，提供每年 \\textbf{USD ${data.scenarioB.annualWithdrawal.toLocaleString()}} 的稳定现金流，避免滞纳金风险。

\\begin{table}[H]
\\centering
\\renewcommand{\\arraystretch}{1.5}
\\begin{tabular}{c|c|c|c}
\\hline
\\rowcolor{pbDark!10} \\textbf{保单年度} & \\textbf{累计流动性提取} & \\textbf{剩余储备价值} & \\textbf{总回报率 (\\%)} \\\\
\\hline
第 10 年 & ${data.scenarioB.year10.cumulative.toLocaleString()} & ${data.scenarioB.year10.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year10.cumulative + data.scenarioB.year10.remaining)} \\\\
第 20 年 & ${data.scenarioB.year20.cumulative.toLocaleString()} & ${data.scenarioB.year20.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year20.cumulative + data.scenarioB.year20.remaining)} \\\\
第 30 年 & ${data.scenarioB.year30.cumulative.toLocaleString()} & ${data.scenarioB.year30.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year30.cumulative + data.scenarioB.year30.remaining)} \\\\
第 40 年 & ${data.scenarioB.year40.cumulative.toLocaleString()} & ${data.scenarioB.year40.remaining.toLocaleString()} & ${getReturnRate(data.scenarioB.year40.cumulative + data.scenarioB.year40.remaining)} \\\\
\\hline
\\end{tabular}
\\caption{流动性储备展示}
\\end{table}

\\section*{限时推广}

\\begin{description}
    \\item[保费回赠:] ${rebateString}
    \\item[预缴利率 (锁定美息):] ${prepayString} ${prepayNote}
\\end{description}

\\vfill
\\noindent
\\rule{\\linewidth}{0.5pt}
\\vspace{0.5em}
\\scriptsize
\\textbf{合规免责声明:} 本文件仅供参考，不构成税务法律意见。税务后果取决于客户具体情况及当时法律，建议咨询专业税务顾问。关于香港身份规划、CRS申报及金税四期应对策略，请参阅银行提供的详细合规指引。

\\end{document}`;
};