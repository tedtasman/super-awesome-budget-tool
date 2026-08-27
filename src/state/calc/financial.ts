import type { FinancialStore } from "../store/financial";

export function getFederal(income: number, financialStore: FinancialStore): number {
  const incomeByBracket = financialStore.federalTaxBrackets.map((bracket) => {
    if (income > bracket.incomeThreshold) {
      return bracket.incomeThreshold * bracket.rate;
    } else {
      return income * bracket.rate;
    }
  });
  return incomeByBracket.reduce((total, current) => total + current, 0);
}

export function getState(income: number, financialStore: FinancialStore): number {
  const incomeByBracket = financialStore.stateTaxBrackets.map((bracket) => {
    if (income > bracket.incomeThreshold) {
      return bracket.incomeThreshold * bracket.rate;
    } else {
      return income * bracket.rate;
    }
  });
  return incomeByBracket.reduce((total, current) => total + current, 0);
}

export function getSocialSecurity(income: number, financialStore: FinancialStore): number {
  const socialSecurityTaxRate = financialStore.socialSecurityTaxRate;
  return income * socialSecurityTaxRate;
}

export function getMedicare(income: number, financialStore: FinancialStore): number {
  const medicareTaxRate = financialStore.medicareTaxRate;
  return income * medicareTaxRate;
}

export function getTotal(
  federalIncome: number,
  stateIncome: number,
  ficaIncome: number,
  financialStore: FinancialStore,
): number {
  const federalTax = getFederal(federalIncome, financialStore);
  const stateTax = getState(stateIncome, financialStore);
  const socialSecurityTax = getSocialSecurity(ficaIncome, financialStore);
  const medicareTax = getMedicare(ficaIncome, financialStore);
  return federalTax + stateTax + socialSecurityTax + medicareTax;
}

export function getFica(income: number, financialStore: FinancialStore): number {
  const socialSecurityTax = getSocialSecurity(income, financialStore);
  const medicareTax = getMedicare(income, financialStore);
  return socialSecurityTax + medicareTax;
}
