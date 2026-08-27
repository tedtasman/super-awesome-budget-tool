import type { FinancialStore } from "../store/financial";
import { getFederal, getState, getSocialSecurity, getMedicare, getTotal } from "../calc/financial";

export const financialSelectors = {
  federalTaxableIncome: (state: FinancialStore) =>
    state.salary - state.federalStandardDeduction - state.additionalClaimedDeductions,

  stateTaxableIncome: (state: FinancialStore) =>
    state.salary - state.stateStandardDeduction - state.additionalClaimedDeductions,

  ficaTaxableIncome: (state: FinancialStore) => state.salary - state.ficaDeductions,

  federalTax: (state: FinancialStore) => getFederal(financialSelectors.federalTaxableIncome(state), state),

  stateTax: (state: FinancialStore) => getState(financialSelectors.stateTaxableIncome(state), state),

  socialSecurityTax: (state: FinancialStore) => getSocialSecurity(financialSelectors.ficaTaxableIncome(state), state),

  medicareTax: (state: FinancialStore) => getMedicare(financialSelectors.ficaTaxableIncome(state), state),

  totalTax: (state: FinancialStore) =>
    getTotal(
      financialSelectors.federalTaxableIncome(state),
      financialSelectors.stateTaxableIncome(state),
      financialSelectors.ficaTaxableIncome(state),
      state,
    ),

  valueIfTaxed: (preTaxValue: number) => (state: FinancialStore) => {
    const currentTaxOwed = financialSelectors.totalTax(state);
    const taxIfNotDeducted = getTotal(
      financialSelectors.federalTaxableIncome(state),
      financialSelectors.stateTaxableIncome(state),
      financialSelectors.ficaTaxableIncome(state),
      state,
    );
    return preTaxValue - (taxIfNotDeducted - currentTaxOwed);
  },
};
