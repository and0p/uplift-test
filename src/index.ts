import type { Claim, Policy } from './types';

export function doesClaimFallWithinPolicy(claim: Claim, policy: Policy): boolean {
    return claim.incidentDate >= policy.startDate && claim.incidentDate < policy.endDate
}