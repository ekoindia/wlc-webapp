import {
	masterOnboardingSteps,
	ONBOARDING_STEP_IDS,
	type OnboardingStep,
} from "features/onboarding/constants";
import {
	applyStepOrgConfigHelper,
	createStepLookupMap,
	extractStepConfiguration,
	generateInitialSteps,
	type StepOrgConfig,
} from "features/onboarding/utils/stepGenerator";

const BANK_ID = ONBOARDING_STEP_IDS.ADD_BANK_ACCOUNT;
const lookup = createStepLookupMap(masterOnboardingSteps);

describe("extractStepConfiguration — per-step overrides (meta)", () => {
	it("returns a stepOrgConfig map carrying label + description + props", () => {
		const config = {
			"2": {
				ADD_BANK_ACCONT: {
					hide: 0,
					optional: 0,
					meta: {
						label: "Bank (org)",
						description: "Add your payout account.",
						props: { hidePassbook: true },
					},
				},
			},
		} as const;

		const { stepOrgConfig } = extractStepConfiguration(config, 2, lookup);

		expect(stepOrgConfig?.get(BANK_ID)).toEqual({
			label: "Bank (org)",
			description: "Add your payout account.",
			props: { hidePassbook: true },
		});
	});

	it("collects overrides independently of hide/optional (props only)", () => {
		const config = {
			"2": {
				ADD_BANK_ACCONT: {
					hide: 0,
					optional: 0,
					meta: { props: { passbookOptional: true } },
				},
			},
		} as const;

		const { disabledSteps, skippableSteps, stepOrgConfig } =
			extractStepConfiguration(config, 2, lookup);

		expect(disabledSteps).toBeUndefined();
		expect(skippableSteps).toBeUndefined();
		expect(stepOrgConfig?.get(BANK_ID)?.props).toEqual({
			passbookOptional: true,
		});
	});

	it("normalizes user type 3 to 2", () => {
		const config = {
			"2": {
				ADD_BANK_ACCONT: {
					hide: 0,
					optional: 0,
					meta: { label: "hi" },
				},
			},
		} as const;
		const { stepOrgConfig } = extractStepConfiguration(config, 3, lookup);
		expect(stepOrgConfig?.get(BANK_ID)?.label).toBe("hi");
	});

	it("returns undefined stepOrgConfig when no meta overrides present", () => {
		const config = {
			"2": { ADD_BANK_ACCONT: { hide: 1, optional: 0 } },
		} as const;
		const { disabledSteps, stepOrgConfig } = extractStepConfiguration(
			config,
			2,
			lookup
		);
		expect(disabledSteps).toContain(BANK_ID);
		expect(stepOrgConfig).toBeUndefined();
	});
});

describe("applyStepOrgConfigHelper", () => {
	const steps: OnboardingStep[] = masterOnboardingSteps.slice(0, 3);

	it("overrides top-level label/description and attaches orgConfig.props on the matching step", () => {
		const map = new Map<number, StepOrgConfig>([
			[
				steps[1].id,
				{
					label: "Org Label",
					description: "Org Description",
					props: { x: 1 },
				},
			],
		]);
		const result = applyStepOrgConfigHelper(steps, map);

		expect(result[1].label).toBe("Org Label");
		expect(result[1].description).toBe("Org Description");
		expect(result[1].orgConfig).toEqual({ props: { x: 1 } });
		// Non-matching steps untouched.
		expect(result[0].label).toBe(steps[0].label);
		expect(result[0].orgConfig).toBeUndefined();
		expect(result[2].orgConfig).toBeUndefined();
	});

	it("leaves label/description untouched for a props-only entry", () => {
		const map = new Map<number, StepOrgConfig>([
			[steps[1].id, { props: { hidePassbook: true } }],
		]);
		const result = applyStepOrgConfigHelper(steps, map);

		expect(result[1].label).toBe(steps[1].label);
		expect(result[1].description).toBe(steps[1].description);
		expect(result[1].orgConfig).toEqual({ props: { hidePassbook: true } });
	});

	it("attaches no orgConfig for a label/description-only entry", () => {
		const map = new Map<number, StepOrgConfig>([
			[steps[1].id, { label: "Only Label" }],
		]);
		const result = applyStepOrgConfigHelper(steps, map);

		expect(result[1].label).toBe("Only Label");
		expect(result[1].orgConfig).toBeUndefined();
	});

	it("ignores empty/blank label so the step title cannot be blanked", () => {
		const map = new Map<number, StepOrgConfig>([
			[steps[1].id, { label: "   ", description: "" }],
		]);
		const result = applyStepOrgConfigHelper(steps, map);

		expect(result[1].label).toBe(steps[1].label);
		expect(result[1].description).toBe(steps[1].description);
	});

	it("returns steps untouched when the map is empty/undefined", () => {
		expect(applyStepOrgConfigHelper(steps, undefined)).toBe(steps);
		expect(applyStepOrgConfigHelper(steps, new Map())).toBe(steps);
	});
});

describe("generateInitialSteps — end to end", () => {
	it("lets org meta.label win over the API label and overrides description", () => {
		const { stepOrgConfig } = extractStepConfiguration(
			{
				"2": {
					ADD_BANK_ACCONT: {
						hide: 0,
						optional: 0,
						meta: {
							label: "Org Bank Label",
							description: "Org bank description.",
							props: { hidePassbook: true },
						},
					},
				},
			} as const,
			2,
			lookup
		);

		const steps = generateInitialSteps({
			// API supplies its own label for the same step (role 51700).
			onboardingSteps: [{ role: 51700, label: "API Bank Label" }],
			stepOrgConfig,
		});

		const bankStep = steps.find((s) => s.id === BANK_ID);
		expect(bankStep).toBeDefined();
		expect(bankStep?.label).toBe("Org Bank Label"); // org wins over API
		expect(bankStep?.description).toBe("Org bank description.");
		expect(bankStep?.orgConfig?.props?.hidePassbook).toBe(true);
	});
});
