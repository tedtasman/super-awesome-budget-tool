import { useFinancialStore } from "../store/financial";
import { financialSelectors } from "../selectors/financial";
import type { PaycheckDeduction } from "../store/expenses";

// Financial store hooks
export const useFederalTaxBrackets = () => useFinancialStore((state) => state.federalTaxBrackets);
export const useSetFederalTaxBrackets = () => useFinancialStore((state) => state.setFederalTaxBrackets);
export const useStateTaxBrackets = () => useFinancialStore((state) => state.stateTaxBrackets);
export const useSetStateTaxBrackets = () => useFinancialStore((state) => state.setStateTaxBrackets);
export const useSocialSecurityTaxRate = () => useFinancialStore((state) => state.socialSecurityTaxRate);
export const useSetSocialSecurityTaxRate = () => useFinancialStore((state) => state.setSocialSecurityTaxRate);
export const useMedicareTaxRate = () => useFinancialStore((state) => state.medicareTaxRate);
export const useSetMedicareTaxRate = () => useFinancialStore((state) => state.setMedicareTaxRate);
export const useFederalStandardDeduction = () => useFinancialStore((state) => state.federalStandardDeduction);
export const useSetFederalStandardDeduction = () => useFinancialStore((state) => state.setFederalStandardDeduction);
export const useStateStandardDeduction = () => useFinancialStore((state) => state.stateStandardDeduction);
export const useSetStateStandardDeduction = () => useFinancialStore((state) => state.setStateStandardDeduction);
export const useAdditionalClaimedDeductions = () => useFinancialStore((state) => state.additionalClaimedDeductions);
export const useSetAdditionalClaimedDeductions = () =>
  useFinancialStore((state) => state.setAdditionalClaimedDeductions);
export const useAdditionalWithholding = () => useFinancialStore((state) => state.additionalWithholding);
export const useSetAdditionalWithholding = () => useFinancialStore((state) => state.setAdditionalWithholding);
export const useFicaDeductions = () => useFinancialStore((state) => state.ficaDeductions);
export const useSetFicaDeductions = () => useFinancialStore((state) => state.setFicaDeductions);
export const useSalary = () => useFinancialStore((state) => state.salary);
export const useSetSalary = () => useFinancialStore((state) => state.setSalary);
export const usePaychecksPerYear = () => useFinancialStore((state) => state.paychecksPerYear);
export const useSetPaychecksPerYear = () => useFinancialStore((state) => state.setPaychecksPerYear);
export const useHourlyPay = () => useFinancialStore((state) => state.hourlyPay);
export const useSetHourlyPay = () => useFinancialStore((state) => state.setHourlyPay);
// End financial store hooks

// Financial selectors hooks
export const useFederalTaxableIncome = () => useFinancialStore(financialSelectors.federalTaxableIncome);
export const useStateTaxableIncome = () => useFinancialStore(financialSelectors.stateTaxableIncome);
export const useFicaTaxableIncome = () => useFinancialStore(financialSelectors.ficaTaxableIncome);
export const useFederalTax = () => useFinancialStore(financialSelectors.federalTax);
export const useStateTax = () => useFinancialStore(financialSelectors.stateTax);
export const useSocialSecurityTax = () => useFinancialStore(financialSelectors.socialSecurityTax);
export const useMedicareTax = () => useFinancialStore(financialSelectors.medicareTax);
export const useTotalTax = () => useFinancialStore(financialSelectors.totalTax);
export const useNetIncome = () => useFinancialStore(financialSelectors.netIncome);
export const useValueIfTaxed = (preTaxValue: number) => useFinancialStore(financialSelectors.valueIfTaxed(preTaxValue));
export const usePaycheck = () => useFinancialStore(financialSelectors.paycheck);
export const usePreTaxDeductionValuePerPaycheck = (deduction: PaycheckDeduction) =>
  useFinancialStore((state) => financialSelectors.getPreTaxDeductionValuePerPaycheck(deduction, state));

// End financial selectors hooks
