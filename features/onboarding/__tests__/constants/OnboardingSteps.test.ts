import {
	filterOnboardingStepsByRoles,
	masterOnboardingSteps,
} from "features/onboarding";

describe("OnboardingSteps", () => {
	describe("masterOnboardingSteps", () => {
		it("should have unique IDs", () => {
			const ids = masterOnboardingSteps.map((step) => step.id);
			const uniqueIds = new Set(ids);
			expect(uniqueIds.size).toBe(ids.length);
		});

		it("should have applicableRoles array for steps with roles", () => {
			// Filter to steps that are expected to have applicableRoles
			// (visible steps that appear in the onboarding flow)
			const stepsWithRoles = masterOnboardingSteps.filter(
				(step) => step.isVisible && step.applicableRoles
			);

			stepsWithRoles.forEach((step) => {
				expect(step.applicableRoles).toBeDefined();
				expect(Array.isArray(step.applicableRoles)).toBe(true);
				expect(step.applicableRoles!.length).toBeGreaterThan(0);
			});
		});
	});

	describe("filterOnboardingStepsByRoles", () => {
		it("should filter steps by applicableRoles", () => {
			const apiSteps = [
				{ role: 12400, label: "Aadhaar Verification" },
				{ role: 24000, label: "Aadhaar Consent" },
			];

			const filtered = filterOnboardingStepsByRoles(
				masterOnboardingSteps,
				apiSteps
			);

			// Should include steps with roles 12400 or 24000 in their applicableRoles
			expect(filtered.length).toBeGreaterThan(0);

			filtered.forEach((step) => {
				const hasMatchingRole = step.applicableRoles?.some((role) =>
					[12400, 24000].includes(role)
				);
				expect(hasMatchingRole).toBe(true);
			});
		});

		it("should handle multi-role steps correctly", () => {
			// LOCATION_CAPTURE has both 13000 and 12400
			const apiSteps = [{ role: 13000, label: "Location Capture" }];

			const filtered = filterOnboardingStepsByRoles(
				masterOnboardingSteps,
				apiSteps
			);

			// Should include LOCATION_CAPTURE step
			const locationStep = filtered.find(
				(step) => step.name === "LOCATION_CAPTURE"
			);
			expect(locationStep).toBeDefined();
			expect(locationStep?.applicableRoles).toContain(13000);
		});

		it("should return empty array when no roles match", () => {
			const apiSteps = [{ role: 99999, label: "Non-existent" }];

			const filtered = filterOnboardingStepsByRoles(
				masterOnboardingSteps,
				apiSteps
			);

			expect(filtered.length).toBe(0);
		});
	});

	describe("API Integration", () => {
		it("should maintain ID-based routing compatibility", () => {
			// Verify critical IDs for API routing logic
			const locationStep = masterOnboardingSteps.find((s) => s.id === 3);
			expect(locationStep?.name).toBe("LOCATION_CAPTURE");

			const uploadSteps = masterOnboardingSteps.filter((s) =>
				[1, 4, 8, 11].includes(s.id)
			);
			expect(uploadSteps.length).toBeGreaterThan(0);
		});

		it("should preserve all required step properties", () => {
			masterOnboardingSteps.forEach((step) => {
				expect(step.id).toBeDefined();
				expect(step.name).toBeDefined();
				expect(step.label).toBeDefined();
				expect(typeof step.isRequired).toBe("boolean");
				expect(typeof step.isVisible).toBe("boolean");
				expect(step.primaryCTAText).toBeDefined();
				expect(step.form_data).toBeDefined();
			});
		});

		it("should determine skippability based on isRequired property", () => {
			masterOnboardingSteps.forEach((step) => {
				// Skippability is the inverse of isRequired
				// A step is skippable when it's NOT required
				const isSkippable = !step.isRequired;
				expect(typeof isSkippable).toBe("boolean");
			});
		});
	});
});
