export interface Expense {
  id: string;
  name: string;
  taxRouteIds: string[]; // references
  value: number;
}
