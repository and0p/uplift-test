import type { Claim, Policy } from "./types";

import * as claimFunctions from "./index";

describe("Claim evaluation", () => {
  describe("evaluateClaim", () => {
    const defaultClaim: Claim = {
      policyId: "test",
      incidentType: "accident",
      incidentDate: new Date(),
      amountClaimed: 500,
    };

    const defaultPolicy: Policy = {
      policyId: "test",
      startDate: new Date(2025, 1, 1),
      endDate: new Date(2025, 12, 31),
      deductible: 300,
      coverageLimit: 400,
      coveredIncidents: ["accident", "fire", "theft", "water damage"],
    };

    let doesClaimFallWithinPolicyWindowSpy = jest.spyOn(
      claimFunctions,
      "doesClaimFallWithinPolicyWindow",
    );
    let isClaimIncidentTypeCoveredUnderPolicySpy = jest.spyOn(
      claimFunctions,
      "isClaimIncidentTypeCoveredUnderPolicy",
    );
    let calculateClaimPayoutUnderPolicySpy = jest.spyOn(
      claimFunctions,
      "calculateClaimPayoutUnderPolicy",
    );

    beforeEach(() => {
      // Mock "happy" returns by default, to reduce boilerplate later
      doesClaimFallWithinPolicyWindowSpy.mockReturnValue(true);
      isClaimIncidentTypeCoveredUnderPolicySpy.mockReturnValue(true);
      calculateClaimPayoutUnderPolicySpy.mockReturnValue(100);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("Should return with POLICY_INACTIVE if the policy is inactive", () => {
      doesClaimFallWithinPolicyWindowSpy.mockReturnValue(false);
      const result = claimFunctions.evaluateClaim(defaultClaim, defaultPolicy);
      expect(result).toEqual({
        approved: false,
        payout: 0,
        reason: "POLICY_INACTIVE",
      });
    });

    it("Should return NOT_COVERED if the policy does not covered", () => {
      isClaimIncidentTypeCoveredUnderPolicySpy.mockReturnValue(false);
      const result = claimFunctions.evaluateClaim(defaultClaim, defaultPolicy);
      expect(result).toEqual({
        approved: false,
        payout: 0,
        reason: "NOT_COVERED",
      });
    });

    it("Should return with ZERO_PAYOUT if the payout is <= 0", () => {
      // Testing with exactly zero
      calculateClaimPayoutUnderPolicySpy.mockReturnValue(0);
      let result = claimFunctions.evaluateClaim(defaultClaim, defaultPolicy);
      expect(result).toEqual({
        approved: false,
        payout: 0,
        reason: "ZERO_PAYOUT",
      });

      // Testing with a negative number
      calculateClaimPayoutUnderPolicySpy.mockReturnValue(-500);
      result = claimFunctions.evaluateClaim(defaultClaim, defaultPolicy);
      expect(result).toEqual({
        approved: false,
        payout: 0,
        reason: "ZERO_PAYOUT",
      });
    });

    it("Should return APPROVED with the payout if it is above zero and the claim has not been denied for any reason", () => {
      const result = claimFunctions.evaluateClaim(defaultClaim, defaultPolicy);
      expect(result).toEqual({
        approved: true,
        payout: 200,
        reason: "APPROVED",
      });
    });
  });

  describe("doesClaimFallWithinPolicyWindow", () => {
    it("Should return true if the claim time is after the policy start time and before the policy end time", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2025, 6, 1),
        amountClaimed: 50,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 10,
        coverageLimit: 1000,
        coveredIncidents: ["fire"],
      };

      expect(
        claimFunctions.doesClaimFallWithinPolicyWindow(claim, policy),
      ).toBeTruthy();
    });

    it("Should return false if the claim time is before the policy started", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2022, 6, 1),
        amountClaimed: 50,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 10,
        coverageLimit: 1000,
        coveredIncidents: ["fire"],
      };

      expect(
        claimFunctions.doesClaimFallWithinPolicyWindow(claim, policy),
      ).toBeFalsy();
    });

    it("Should return false if the claim time is after the policy ended", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 50,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 10,
        coverageLimit: 1000,
        coveredIncidents: ["fire"],
      };

      expect(
        claimFunctions.doesClaimFallWithinPolicyWindow(claim, policy),
      ).toBeFalsy();
    });
  });

  describe("isClaimIncidentTypeCoveredUnderPolicy", () => {
    it("Should return true if the claim incident type is covered by the policy", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 50,
      };

      let policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 10,
        coverageLimit: 1000,
        coveredIncidents: ["accident"],
      };

      expect(
        claimFunctions.isClaimIncidentTypeCoveredUnderPolicy(claim, policy),
      ).toBeTruthy();

      // Also test with fuller array in different order
      policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 10,
        coverageLimit: 1000,
        coveredIncidents: ["fire", "accident", "theft", "water damage"],
      };

      expect(
        claimFunctions.isClaimIncidentTypeCoveredUnderPolicy(claim, policy),
      ).toBeTruthy();
    });

    it("Should return false if the claim incident type is not covered by the policy", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 50,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 10,
        coverageLimit: 1000,
        coveredIncidents: ["fire", "theft"],
      };

      expect(
        claimFunctions.isClaimIncidentTypeCoveredUnderPolicy(claim, policy),
      ).toBeFalsy();
    });
  });

  describe("calculateClaimPayoutUnderPolicy", () => {
    it("Should return the amount passed if there is no deductible and the amount is below the limit", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 5000,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 0,
        coverageLimit: 1000000,
        coveredIncidents: ["fire", "theft"],
      };

      expect(
        claimFunctions.calculateClaimPayoutUnderPolicy(claim, policy),
      ).toBe(5000);
    });

    it("Should subtract the deductible", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 500,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 200,
        coverageLimit: 1000000,
        coveredIncidents: ["fire", "theft"],
      };

      expect(
        claimFunctions.calculateClaimPayoutUnderPolicy(claim, policy),
      ).toBe(300);
    });

    it("Should cap the amount at the coverage limit", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 500000,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 0,
        coverageLimit: 50,
        coveredIncidents: ["fire", "theft"],
      };

      expect(
        claimFunctions.calculateClaimPayoutUnderPolicy(claim, policy),
      ).toBe(50);
    });

    it("Should consider the deductible before the coverage limit", () => {
      const claim: Claim = {
        policyId: "test",
        incidentType: "accident",
        incidentDate: new Date(2028, 6, 1),
        amountClaimed: 600,
      };

      const policy: Policy = {
        policyId: "test",
        startDate: new Date(2025, 1, 1),
        endDate: new Date(2025, 12, 1),
        deductible: 200,
        coverageLimit: 500,
        coveredIncidents: ["fire", "theft"],
      };

      expect(
        claimFunctions.calculateClaimPayoutUnderPolicy(claim, policy),
      ).toBe(400);
    });
  });
});
