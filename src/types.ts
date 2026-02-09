export type IncidentType = "accident" | "theft" | "fire" | "water damage";

export interface Claim {
  policyId: string;
  incidentType: IncidentType;
  incidentDate: Date;
  amountClaimed: number;
}

export interface Policy {
  policyId: string;
  startDate: Date; // assuming UTC
  endDate: Date; // assuming UTC
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

export type ReasonCode =
  | "APPROVED"
  | "POLICY_INACTIVE"
  | "NOT_COVERED"
  | "ZERO_PAYOUT";

export interface ClaimEvaluationResult {
  approved: boolean;
  payout: number;
  reason: ReasonCode;
}
