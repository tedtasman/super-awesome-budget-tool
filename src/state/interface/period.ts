export type Period =
  | { kind: "day" | "week" | "month" | "year"; amount: number }
  | { kind: "custom"; amount: number; labelSingular: string; labelPlural: string };
