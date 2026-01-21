export interface ScenarioValue {
  surrender: number;
  death: number;
}

export interface ScenarioBValue {
  cumulative: number;
  remaining: number;
}

export interface ClientData {
  name: string;
  age: number;
}

export interface PremiumData {
  total: number;
  paymentType: string; // e.g., "整付" or "5年"
}

export interface ScenarioAData {
  year10: ScenarioValue;
  year20: ScenarioValue;
  year30: ScenarioValue;
}

export interface ScenarioBData {
  annualWithdrawal: number;
  year10: ScenarioBValue;
  year20: ScenarioBValue;
  year30: ScenarioBValue;
  year40: ScenarioBValue;
}

export interface PromoOption {
  enabled: boolean;
  percent: number;
}

export interface PrepayOption {
  enabled: boolean;
  rate: number;
  deadline: string;
}

export interface PromoData {
  lumpSum: PromoOption;
  fiveYear: PromoOption;
  prepay: PrepayOption;
}

export interface ProposalData {
  client: ClientData;
  planName: string;
  premium: PremiumData;
  scenarioA: ScenarioAData;
  scenarioB: ScenarioBData;
  promo: PromoData;
}

export enum ViewMode {
  FORM = 'FORM',
  RESULT = 'RESULT'
}