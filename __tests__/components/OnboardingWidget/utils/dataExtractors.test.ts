import {
	getAgreementIdFromData,
	getMobileFromData,
	getOnboardingStepsFromData,
	getUserTypeFromData,
	type UnifiedUserData,
} from "../../../../components/OnboardingWidget/utils/dataExtractors";

// Test data for normal onboarding
const normalOnboardingData: UnifiedUserData = {
	details: {
		user_type: 3,
		mobile: "9112333301",
		onboarding_steps: [
			{ role: 12400, label: "Upload Aadhaar Card" },
			{ role: 24000, label: "Aadhar verify" },
		],
	},
	user_detail: {
		mobile: "9112333301",
		agreement_id: 20,
	},
};

// Test data for assisted onboarding
const assistedOnboardingData: UnifiedUserData = {
	details: {
		user_detail: {
			user_type: 3,
			mobile: "9002333313",
			onboarding_steps: [
				{ role: 12400, label: "Upload Aadhaar Card" },
				{ role: 24000, label: "Aadhar verify" },
			],
			agreement_id: 20,
		},
	},
	user_detail: {
		mobile: "9002333313",
	},
};

describe("OnboardingWidget Data Extractors", () => {
	describe("getUserTypeFromData", () => {
		it("should extract user type from normal onboarding data", () => {
			const userType = getUserTypeFromData(normalOnboardingData);
			expect(userType).toBe(3);
		});

		it("should extract user type from assisted onboarding data", () => {
			const userType = getUserTypeFromData(assistedOnboardingData);
			expect(userType).toBe(3);
		});

		it("should return undefined for missing user type", () => {
			const userType = getUserTypeFromData({});
			expect(userType).toBeUndefined();
		});
	});

	describe("getMobileFromData", () => {
		it("should extract mobile from normal onboarding data", () => {
			const mobile = getMobileFromData(normalOnboardingData);
			expect(mobile).toBe("9112333301");
		});

		it("should extract mobile from assisted onboarding data", () => {
			const mobile = getMobileFromData(assistedOnboardingData);
			expect(mobile).toBe("9002333313");
		});

		it("should return undefined for missing mobile", () => {
			const mobile = getMobileFromData({});
			expect(mobile).toBeUndefined();
		});
	});

	describe("getOnboardingStepsFromData", () => {
		it("should extract onboarding steps from normal onboarding data", () => {
			const steps = getOnboardingStepsFromData(normalOnboardingData);
			expect(steps).toHaveLength(2);
			expect(steps?.[0].role).toBe(12400);
		});

		it("should extract onboarding steps from assisted onboarding data", () => {
			const steps = getOnboardingStepsFromData(assistedOnboardingData);
			expect(steps).toHaveLength(2);
			expect(steps?.[0].role).toBe(12400);
		});

		it("should return undefined for missing onboarding steps", () => {
			const steps = getOnboardingStepsFromData({});
			expect(steps).toBeUndefined();
		});
	});

	describe("getAgreementIdFromData", () => {
		it("should extract agreement ID from normal onboarding data", () => {
			const agreementId = getAgreementIdFromData(normalOnboardingData);
			expect(agreementId).toBe(20);
		});

		it("should extract agreement ID from assisted onboarding data", () => {
			const agreementId = getAgreementIdFromData(assistedOnboardingData);
			expect(agreementId).toBe(20);
		});

		it("should return undefined for missing agreement ID", () => {
			const agreementId = getAgreementIdFromData({});
			expect(agreementId).toBeUndefined();
		});
	});
});
