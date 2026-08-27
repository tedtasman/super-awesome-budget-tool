import type { PaycheckDeduction } from "../state/store/expenses";

export function calculateDeductionValuePerPaycheck(deduction: PaycheckDeduction, paycheck: number): number {
  return (deduction.percentage / 100) * paycheck + deduction.flatAmount;
}
