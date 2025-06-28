import { UserType } from "constants/UserTypes";
import ONBOARDING_PERMISSIONS, {
	getOnboardingPermissions,
} from "page-components/Admin/OnboardAgents/OnboardingPermissions";

describe("OnboardingPermissions", () => {
	describe("ONBOARDING_PERMISSIONS configuration", () => {
		it("should define permissions for Admin role", () => {
			expect(ONBOARDING_PERMISSIONS.ADMIN).toBeDefined();
			expect(ONBOARDING_PERMISSIONS.ADMIN.key).toBe("admin");
			expect(ONBOARDING_PERMISSIONS.ADMIN.allowedAgentTypes).toContain(1);
			expect(ONBOARDING_PERMISSIONS.ADMIN.allowedAgentTypes).toContain(2);
			expect(ONBOARDING_PERMISSIONS.ADMIN.autoMapDistributor).toBe(false);
		});

		it("should define permissions for Super Distributor role", () => {
			expect(ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR).toBeDefined();
			expect(ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR.key).toBe(
				UserType.SUPER_DISTRIBUTOR
			);
			expect(
				ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR.allowedAgentTypes
			).toContain(1);
			expect(
				ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR.allowedAgentTypes
			).toContain(2);
			expect(
				ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR.autoMapDistributor
			).toBe(false);
		});

		it("should define permissions for Distributor role", () => {
			expect(ONBOARDING_PERMISSIONS.DISTRIBUTOR).toBeDefined();
			expect(ONBOARDING_PERMISSIONS.DISTRIBUTOR.key).toBe(
				UserType.DISTRIBUTOR
			);
			expect(
				ONBOARDING_PERMISSIONS.DISTRIBUTOR.allowedAgentTypes
			).not.toContain(1);
			expect(
				ONBOARDING_PERMISSIONS.DISTRIBUTOR.allowedAgentTypes
			).toContain(2);
			expect(ONBOARDING_PERMISSIONS.DISTRIBUTOR.autoMapDistributor).toBe(
				true
			);
		});

		it("should define permissions for Field Executive role", () => {
			expect(ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE).toBeDefined();
			expect(ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE.key).toBe(
				UserType.FOS
			);
			expect(
				ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE.allowedAgentTypes
			).not.toContain(1);
			expect(
				ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE.allowedAgentTypes
			).toContain(2);
			expect(
				ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE.autoMapDistributor
			).toBe(false);
		});
	});

	describe("getOnboardingPermissions function", () => {
		it("should return Admin permissions when isAdmin is true", () => {
			const permissions = getOnboardingPermissions(
				true,
				UserType.DISTRIBUTOR
			);
			expect(permissions).toEqual(ONBOARDING_PERMISSIONS.ADMIN);
		});

		it("should return Super Distributor permissions for Super Distributor user type", () => {
			const permissions = getOnboardingPermissions(
				false,
				UserType.SUPER_DISTRIBUTOR
			);
			expect(permissions).toEqual(
				ONBOARDING_PERMISSIONS.SUPER_DISTRIBUTOR
			);
		});

		it("should return Distributor permissions for Distributor user type", () => {
			const permissions = getOnboardingPermissions(
				false,
				UserType.DISTRIBUTOR
			);
			expect(permissions).toEqual(ONBOARDING_PERMISSIONS.DISTRIBUTOR);
		});

		it("should return Field Executive permissions for FOS user type", () => {
			const permissions = getOnboardingPermissions(false, UserType.FOS);
			expect(permissions).toEqual(ONBOARDING_PERMISSIONS.FIELD_EXECUTIVE);
		});

		it("should return default restrictive permissions for unknown user type", () => {
			const permissions = getOnboardingPermissions(false, 999);
			expect(permissions.key).toBe("unknown");
			expect(permissions.allowedAgentTypes).toEqual([]);
			expect(permissions.autoMapDistributor).toBe(false);
		});
	});
});
