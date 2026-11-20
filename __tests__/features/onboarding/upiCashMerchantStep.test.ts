import { ParamType } from "constants/trxnFramework";
import {
	masterOnboardingSteps,
	ONBOARDING_STEP_IDS,
	type OnboardingStep,
} from "features/onboarding/constants";
import { filterOnboardingStepsByRoles } from "features/onboarding/utils/stepGenerator";
import {
	UPI_CASH_INTERACTION,
	UPI_CASH_MERCHANT_ROLE,
} from "page-components/products/upi-cash-withdrawal/constants";

const merchantStep = masterOnboardingSteps.find(
	(s) => s.name === "UPI_CASH_MERCHANT"
) as OnboardingStep;

const fieldNames = (step: OnboardingStep): string[] =>
	(step.localRenderer?.formFields ?? []).map((f) => f.name);

const fieldByName = (step: OnboardingStep, name: string) =>
	(step.localRenderer?.formFields ?? []).find((f) => f.name === name);

describe("UPI Cash Withdrawal merchant onboarding step (interaction 365)", () => {
	it("exists in masterOnboardingSteps with a unique id", () => {
		expect(merchantStep).toBeDefined();
		expect(merchantStep.id).toBe(ONBOARDING_STEP_IDS.UPI_CASH_MERCHANT);
		const ids = masterOnboardingSteps.map((s) => s.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	// AC-2.1 — a not-registered agent (merchant role present in onboarding_steps)
	// is routed to this self-onboarding step; others never see it.
	it("is selected only when the merchant role is in onboarding_steps (AC-2.1)", () => {
		const selected = filterOnboardingStepsByRoles(masterOnboardingSteps, [
			{ role: UPI_CASH_MERCHANT_ROLE },
		]);
		expect(selected.some((s) => s.name === "UPI_CASH_MERCHANT")).toBe(true);

		const otherRole = filterOnboardingStepsByRoles(masterOnboardingSteps, [
			{ role: 12400 },
		]);
		expect(otherRole.some((s) => s.name === "UPI_CASH_MERCHANT")).toBe(
			false
		);
	});

	// AC-2.2 — collects the required merchant details.
	it("collects name, PAN, Aadhaar, bank a/c + IFSC, address, category and doc images (AC-2.2)", () => {
		const names = fieldNames(merchantStep);
		[
			"merchant_name",
			"pan",
			"aadhaar_number",
			"bank_account_number",
			"ifsc",
			"shop_address",
			"city",
			"district",
			"state",
			"pincode",
			"merchant_category",
			"aadhaar_front_image",
			"aadhaar_back_image",
			"pan_image",
		].forEach((name) => expect(names).toContain(name));

		// Category is a dropdown with options.
		const category = fieldByName(merchantStep, "merchant_category");
		expect(category?.parameter_type_id).toBe(ParamType.LIST);
		expect(
			Array.isArray((category as Record<string, any>)?.list_elements)
		).toBe(true);

		// Document images are file uploads.
		["aadhaar_front_image", "aadhaar_back_image", "pan_image"].forEach(
			(name) => {
				expect(fieldByName(merchantStep, name)?.parameter_type_id).toBe(
					ParamType.FILE
				);
			}
		);
	});

	// AC-2.3 — on success → registered/enabled; NO biometric eKYC.
	it("submits via interaction 365, refreshes profile on success, and uses no biometric (AC-2.3)", () => {
		const pipeline = merchantStep.api?.pipeline ?? [];
		const submit = pipeline.find((p) => p.id === "submit");
		expect(submit?.interactionTypeId).toBe(UPI_CASH_INTERACTION.ONBOARDING);
		expect(UPI_CASH_INTERACTION.ONBOARDING).toBe(365);

		// Profile refresh flips the product gate to "registered".
		expect(merchantStep.postSubmit?.refreshProfile).toBe(true);

		// No fingerprint/face biometric field or renderer.
		const fields = merchantStep.localRenderer?.formFields ?? [];
		expect(
			fields.some((f) => f.parameter_type_id === ParamType.FINGERPRINT)
		).toBe(false);
		expect(
			fields.some((f) => /biometric|fingerprint|face/i.test(f.name))
		).toBe(false);
	});

	// AC-2.4 — self-service; Eko only enables (no separate admin onboarding step).
	it("is a self-service step gated solely by the merchant role (AC-2.4)", () => {
		expect(merchantStep.applicableRoles).toEqual([UPI_CASH_MERCHANT_ROLE]);
		expect(merchantStep.isVisible).toBe(true);
		// Exactly one master step owns this role — no parallel admin variant.
		const owning = masterOnboardingSteps.filter((s) =>
			s.applicableRoles?.includes(UPI_CASH_MERCHANT_ROLE)
		);
		expect(owning).toHaveLength(1);
	});

	// AC-2.5 — failure must not silently enable: every API is gated on its success
	// response-type, and the form renders through LocalStepForm (provider reason +
	// retry). Completing the form requires the uploads too, not just the 365 submit.
	it("gates every pipeline step on a success response-type and renders via the form path (AC-2.5)", () => {
		const pipeline = merchantStep.api?.pipeline ?? [];
		expect(pipeline.length).toBeGreaterThan(1);
		pipeline.forEach((step) => {
			expect(step.successResponseTypeIds?.length).toBeGreaterThan(0);
		});
		expect(merchantStep.localRenderer?.type).toBe("form");
	});
});
