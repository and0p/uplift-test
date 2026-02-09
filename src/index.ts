import type { Claim, ClaimEvaluationResult, Policy } from "./types";

export function evaluateClaim(
  claim: Claim,
  policy: Policy,
): ClaimEvaluationResult {
  throw new Error("Not implemented.");
  // check policy window
  // check claim type
  // calculate cost
  // return if zero
  // return payout
}

export function doesClaimFallWithinPolicyWindow(
  claim: Claim,
  policy: Policy,
): boolean {
  return (
    claim.incidentDate >= policy.startDate &&
    claim.incidentDate < policy.endDate
  );
}

export function isClaimIncidentTypeCoveredUnderPolicy(
  claim: Claim,
  policy: Policy,
): boolean {
  return policy.coveredIncidents.includes(claim.incidentType);
}

export function calculateClaimPayoutUnderPolicy(
  claim: Claim,
  policy: Policy,
): number {
  // Subtract deductible
  let payout = claim.amountClaimed - policy.deductible;
  // Limit the payout by the policy maximum
  if (payout > policy.coverageLimit) {
    return policy.coverageLimit;
  }
  return payout;
}
