import type { Claim, Policy } from './types';

import { doesClaimFallWithinPolicyWindow, isClaimIncidentTypeCoveredUnderPolicy } from './index';

describe('Claim evaluation', () => {
    describe('isPolicyCurrentlyActive', () => {
        it('Should return true if the claim time is after the policy start time and before the policy end time', () => {
            const claim: Claim = {
                policyId: 'test',
                incidentType: 'accident',
                incidentDate: new Date(2025, 6, 1),
                amountClaimed: 50
            }

            const policy: Policy = {
                policyId: 'test',
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 12, 1),
                deductible: 10,
                coverageLimit: 1000,
                coveredIncidents: ['fire']
            }

            expect(doesClaimFallWithinPolicyWindow(claim, policy)).toBeTruthy();
        });

        it('Should return false if the claim time is before the policy started', () => {
            const claim: Claim = {
                policyId: 'test',
                incidentType: 'accident',
                incidentDate: new Date(2022, 6, 1),
                amountClaimed: 50
            }

            const policy: Policy = {
                policyId: 'test',
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 12, 1),
                deductible: 10,
                coverageLimit: 1000,
                coveredIncidents: ['fire']
            }

            expect(doesClaimFallWithinPolicyWindow(claim, policy)).toBeFalsy();
        });

        it('Should return false if the claim time is after the policy ended', () => {
            const claim: Claim = {
                policyId: 'test',
                incidentType: 'accident',
                incidentDate: new Date(2028, 6, 1),
                amountClaimed: 50
            }

            const policy: Policy = {
                policyId: 'test',
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 12, 1),
                deductible: 10,
                coverageLimit: 1000,
                coveredIncidents: ['fire']
            }

            expect(doesClaimFallWithinPolicyWindow(claim, policy)).toBeFalsy();
        });
    });

    describe('isClaimCoveredUnderPolicy', () => {
        it('Should return true if the claim incident type is covered by the policy', () => {
            const claim: Claim = {
                policyId: 'test',
                incidentType: 'accident',
                incidentDate: new Date(2028, 6, 1),
                amountClaimed: 50
            }

            let policy: Policy = {
                policyId: 'test',
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 12, 1),
                deductible: 10,
                coverageLimit: 1000,
                coveredIncidents: ['accident']
            }

            expect(isClaimIncidentTypeCoveredUnderPolicy(claim, policy)).toBeTruthy();

            // Also test with fuller array in different order
            policy = {
                policyId: 'test',
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 12, 1),
                deductible: 10,
                coverageLimit: 1000,
                coveredIncidents: ['fire', 'accident', 'theft', 'water damage']
            }

            expect(isClaimIncidentTypeCoveredUnderPolicy(claim, policy)).toBeTruthy();
        });

        it('Should return false if the claim incident type is not covered by the policy', () => {
            const claim: Claim = {
                policyId: 'test',
                incidentType: 'accident',
                incidentDate: new Date(2028, 6, 1),
                amountClaimed: 50
            }

            let policy: Policy = {
                policyId: 'test',
                startDate: new Date(2025, 1, 1),
                endDate: new Date(2025, 12, 1),
                deductible: 10,
                coverageLimit: 1000,
                coveredIncidents: ['fire', 'theft']
            }

            expect(isClaimIncidentTypeCoveredUnderPolicy(claim, policy)).toBeFalsy();
        });
    });
});