export interface CadenceAdjustment {
  originalDate: string;
  adjustedDate: string;
}

export type LineCadence = { kind: "everyPaycheck" } | { kind: "everyNDays"; n: number; anchorDate: string };

export type IncomeLine =
  | {
      id: string;
      kind: "hourly";
      name: string;
      hourlyRate: number;
      hoursPerPeriod: number;
      cadence: LineCadence;
    }
  | { id: string; kind: "salary"; name: string; annualValue: number; cadence: LineCadence };

export interface Income {
  id: string;
  name: string;
  taxRouteIds: Set<string>;
  lines: Record<string, IncomeLine>;
  payPeriodDays: number;
  anchorDate: string;
  cadenceAdjustments: CadenceAdjustment[];
}
