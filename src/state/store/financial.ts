import { create } from "zustand";
import type { StateCreator } from "zustand";

interface FederalTaxBracket {
  rate: number;
  incomeThreshold: number;
}

interface StateTaxBracket {
  rate: number;
  incomeThreshold: number;
}

interface HourlyPayRate {
  rate: number;
  hoursPerPaycheck: number;
}

export interface FinancialStore {
  // Tax-related state
  federalTaxBrackets: FederalTaxBracket[];
  setFederalTaxBrackets: (brackets: FederalTaxBracket[]) => void;
  stateTaxBrackets: StateTaxBracket[];
  setStateTaxBrackets: (brackets: StateTaxBracket[]) => void;
  socialSecurityTaxRate: number;
  setSocialSecurityTaxRate: (rate: number) => void;
  medicareTaxRate: number;
  setMedicareTaxRate: (rate: number) => void;
  federalStandardDeduction: number;
  setFederalStandardDeduction: (deduction: number) => void;
  stateStandardDeduction: number;
  setStateStandardDeduction: (deduction: number) => void;
  additionalClaimedDeductions: number;
  setAdditionalClaimedDeductions: (deductions: number) => void;
  additionalWithholding: number;
  setAdditionalWithholding: (withholding: number) => void;
  ficaDeductions: number;
  setFicaDeductions: (deductions: number) => void;
  // End tax-related state

  // Income-related state
  salary: number;
  setSalary: (salary: number) => void;
  paychecksPerYear: number;
  setPaychecksPerYear: (paychecks: number) => void;
  hourlyPay: HourlyPayRate[];
  setHourlyPay: (hourlyPay: HourlyPayRate[]) => void;
  // End income-related state
}

const createFinancialStore: StateCreator<FinancialStore> = (set) => ({
  // Begin tax-related state
  federalTaxBrackets: [],
  setFederalTaxBrackets: (brackets) => set({ federalTaxBrackets: brackets }),

  stateTaxBrackets: [],
  setStateTaxBrackets: (brackets) => set({ stateTaxBrackets: brackets }),

  socialSecurityTaxRate: 0,
  setSocialSecurityTaxRate: (rate) => set({ socialSecurityTaxRate: rate }),

  medicareTaxRate: 0,
  setMedicareTaxRate: (rate) => set({ medicareTaxRate: rate }),

  federalStandardDeduction: 0,
  setFederalStandardDeduction: (deduction) =>
    set({ federalStandardDeduction: deduction }),

  stateStandardDeduction: 0,
  setStateStandardDeduction: (deduction) =>
    set({ stateStandardDeduction: deduction }),

  additionalClaimedDeductions: 0,
  setAdditionalClaimedDeductions: (deductions) =>
    set({ additionalClaimedDeductions: deductions }),

  additionalWithholding: 0,
  setAdditionalWithholding: (withholding) =>
    set({ additionalWithholding: withholding }),

  ficaDeductions: 0,
  setFicaDeductions: (deductions) => set({ ficaDeductions: deductions }),
  // End tax-related state

  // Begin income-related state
  salary: 0,
  setSalary: (salary) => set({ salary }),

  paychecksPerYear: 0,
  setPaychecksPerYear: (paychecks) => set({ paychecksPerYear: paychecks }),

  hourlyPay: [],
  setHourlyPay: (hourlyPay) => set({ hourlyPay }),
  // End income-related state
});

export const useFinancialStore = create<FinancialStore>(createFinancialStore);
