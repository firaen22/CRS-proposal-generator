import { ProposalData } from "./types";

export const INITIAL_DATA: ProposalData = {
  client: { name: "陈总 (Mr. Chen)", age: 45 },
  planName: "跨境资产保全与合规传承计划",
  premium: { total: 500000, paymentType: "整付" },
  scenarioA: {
    year10: { surrender: 580000, death: 1200000 },
    year20: { surrender: 950000, death: 1200000 },
    year30: { surrender: 1600000, death: 1800000 },
  },
  scenarioB: {
    annualWithdrawal: 25000,
    year10: { cumulative: 250000, remaining: 450000 },
    year20: { cumulative: 500000, remaining: 480000 },
    year30: { cumulative: 750000, remaining: 650000 },
    year40: { cumulative: 1000000, remaining: 900000 },
  },
  promo: {
    lumpSum: { enabled: true, percent: 3.5 },
    fiveYear: { enabled: false, percent: 10 },
    prepay: { enabled: true, rate: 4.2, deadline: "2025-03-31" },
  },
};

export const SYSTEM_INSTRUCTION = ``; // Deprecated but kept for file structure consistency if needed