import type { TaxBracket } from "./taxBracket";

export interface TaxRoute {
  id: string;
  name: string;
  brackets: TaxBracket[];
  deductions: number[];
}
