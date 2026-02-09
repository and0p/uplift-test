import type { Claim, Policy } from './types';

import { doesClaimFallWithinPolicy } from './index';

describe('Claim evaluation', () => {
    describe('isPolicyCurrentlyActive', () => {
        it('Should return true if the current time is after the policy start time and before the policy end time', () => {
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

            expect(doesClaimFallWithinPolicy(claim, policy)).toBeTruthy();
        });
    })
});