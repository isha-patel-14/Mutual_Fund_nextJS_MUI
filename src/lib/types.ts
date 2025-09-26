// src/lib/types.ts
export interface Scheme {
  schemeCode: number;
  schemeName: string;
}

export interface NavData {
  date: string;
  nav: string;
}

export interface SchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
  };
  data: NavData[];
  status: string;
}

export interface ReturnCalculationResult {
  startDate: string;
  endDate: string;
  startNAV: number;
  endNAV: number;
  simpleReturn: number;
  annualizedReturn: number;
}

export interface SipCalculationResult {
  totalInvested: number;
  currentValue: number;
  totalUnits: number;
  absoluteReturn: number;
  annualizedReturn: number;
}