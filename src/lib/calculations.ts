// src/lib/calculations.ts
import { NavData } from './types';
import { differenceInDays, differenceInYears, parseISO, eachMonthOfInterval, endOfMonth } from 'date-fns';

/**
 * Finds the closest available NAV for a given date.
 */
const findClosestNav = (targetDate: Date, navHistory: NavData[]): NavData | null => {
  let closest = null;
  let minDiff = Infinity;

  for (const nav of navHistory) {
    const navDate = parseISO(nav.date);
    const diff = Math.abs(differenceInDays(targetDate, navDate));

    if (diff < minDiff) {
      minDiff = diff;
      closest = nav;
    }
  }
  return closest;
};

/**
 * Calculates simple and annualized returns between two dates.
 */
export function calculateReturns(navHistory: NavData[], from: string, to: string) {
  const startDate = parseISO(from);
  const endDate = parseISO(to);

  const startNavData = findClosestNav(startDate, navHistory);
  const endNavData = findClosestNav(endDate, navHistory);

  if (!startNavData || !endNavData) {
    throw new Error('NAV data not found for the selected period.');
  }

  const startNAV = parseFloat(startNavData.nav);
  const endNAV = parseFloat(endNavData.nav);
  const years = differenceInDays(parseISO(endNavData.date), parseISO(startNavData.date)) / 365.25;

  const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;
  
  // Annualized return is only meaningful for periods >= 1 year
  const annualizedReturn = years >= 1 
    ? ((Math.pow(endNAV / startNAV, 1 / years)) - 1) * 100
    : simpleReturn;

  return {
    startDate: startNavData.date,
    endDate: endNavData.date,
    startNAV,
    endNAV,
    simpleReturn: parseFloat(simpleReturn.toFixed(2)),
    annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
  };
}

/**
 * Calculates SIP returns over a period.
 */
export function calculateSip(
  navHistory: NavData[],
  amount: number,
  from: string,
  to: string
) {
  const startDate = parseISO(from);
  const endDate = parseISO(to);

  const investmentDates = eachMonthOfInterval({ start: startDate, end: endDate });
  
  let totalInvested = 0;
  let totalUnits = 0;

  investmentDates.forEach(date => {
    const navOnDate = findClosestNav(date, navHistory);
    if (navOnDate) {
      const navValue = parseFloat(navOnDate.nav);
      totalUnits += amount / navValue;
      totalInvested += amount;
    }
  });

  const latestNavData = findClosestNav(endDate, navHistory) ?? navHistory[0];
  const latestNav = parseFloat(latestNavData.nav);
  const currentValue = totalUnits * latestNav;
  
  const years = differenceInYears(endDate, startDate);

  const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;

  // CAGR-like formula as requested. Note: XIRR is more accurate for irregular cash flows.
  const annualizedReturn = years > 0
    ? ((Math.pow(currentValue / totalInvested, 1 / years)) - 1) * 100
    : absoluteReturn;

  return {
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    totalUnits: parseFloat(totalUnits.toFixed(4)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
  };
}