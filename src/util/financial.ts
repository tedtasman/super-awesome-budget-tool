import { getTotal } from "../state/calc/financial";
import type { FinancialStore } from "../state/store/financial";

export function calculateTaxIfNotDeducted(
  preTaxValue: number,
  federalTaxableIncome: number,
  stateTaxableIncome: number,
  ficaTaxableIncome: number,
  state: FinancialStore,
): number {
  return getTotal(
    federalTaxableIncome + preTaxValue,
    stateTaxableIncome + preTaxValue,
    ficaTaxableIncome + preTaxValue,
    state,
  );
}

export function calculateValueIfTaxed(preTaxValue: number, currentTaxOwed: number, taxIfNotDeducted: number): number {
  return preTaxValue - (taxIfNotDeducted - currentTaxOwed);
}
