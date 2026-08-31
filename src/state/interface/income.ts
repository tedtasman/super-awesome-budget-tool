export interface CadenceAdjustment {
  originalDate: string;
  adjustedDate: string;
}

export type StreamCadence = { kind: "everyPaycheck" } | { kind: "everyNDays"; n: number; anchorDate: string };

export type IncomeStream =
  | {
      id: string;
      kind: "hourly";
      name: string;
      hourlyRate: number;
      hoursPerPeriod: number;
      streamCadence: StreamCadence;
    }
  | { id: string; kind: "salary"; name: string; annualValue: number; streamCadence: StreamCadence };

export interface Income {
  id: string;
  name: string;
  taxRouteIds: Set<string>;
  streams: Record<string, IncomeStream>;
  payPeriodDays: number;
  anchorDate: string;
  cadenceAdjustments: CadenceAdjustment[];
}
