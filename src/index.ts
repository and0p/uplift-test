import type { Claim, ClaimEvaluationResult, Policy } from "./types";

export function evaluateClaim(
  claim: Claim,
  policy: Policy,
): ClaimEvaluationResult {
  // Check if policy is active
  if (!exports.doesClaimFallWithinPolicyWindow(claim, policy)) {
    return {
      approved: false,
      payout: 0,
      reason: "POLICY_INACTIVE",
    };
  }

  // Check if claim is covered under policy
  if (!exports.isClaimIncidentTypeCoveredUnderPolicy(claim, policy)) {
    return {
      approved: false,
      payout: 0,
      reason: "NOT_COVERED",
    };
  }

  const payout = exports.calculateClaimPayoutUnderPolicy(claim, policy);

  if (payout <= 0) {
    return {
      approved: false, // assuming this is correct behavior
      payout: 0,
      reason: "ZERO_PAYOUT",
    };
  }

  return {
    approved: true,
    payout,
    reason: "APPROVED",
  };
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
