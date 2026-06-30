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

describe("extractStepConfiguration — custom config (meta)", () => {
	it("returns a stepOrgConfig map carrying instruction + props", () => {
		const config = {
			"2": {
				ADD_BANK_ACCONT: {
					hide: 0,
					optional: 0,
					meta: {
						instruction: "Bank account is needed for payouts.",
						props: { hidePassbook: true },
					},
				},
			},
		} as const;

		const { stepOrgConfig } = extractStepConfiguration(config, 2, lookup);

		expect(stepOrgConfig?.get(BANK_ID)).toEqual({
			instruction: "Bank account is needed for payouts.",
			props: { hidePassbook: true },
		});
	});

	it("attaches custom config independently of hide/optional", () => {
		const config = {
			"2": {
				// neither hidden nor optional — only carries props
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
					meta: { instruction: "hi" },
				},
			},
		} as const;
		const { stepOrgConfig } = extractStepConfiguration(config, 3, lookup);
		expect(stepOrgConfig?.get(BANK_ID)?.instruction).toBe("hi");
	});

	it("returns undefined stepOrgConfig when no meta props/instruction present", () => {
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

	it("attaches orgConfig only to the matching step id", () => {
		const map = new Map<number, StepOrgConfig>([
			[steps[1].id, { instruction: "note", props: { x: 1 } }],
		]);
		const result = applyStepOrgConfigHelper(steps, map);

		expect(result[0].orgConfig).toBeUndefined();
		expect(result[1].orgConfig).toEqual({
			instruction: "note",
			props: { x: 1 },
		});
		expect(result[2].orgConfig).toBeUndefined();
	});

	it("returns steps untouched when the map is empty/undefined", () => {
		expect(applyStepOrgConfigHelper(steps, undefined)).toBe(steps);
		expect(applyStepOrgConfigHelper(steps, new Map())).toBe(steps);
	});
});

describe("generateInitialSteps — end to end", () => {
	it("surfaces a hidePassbook flag onto the bank step's orgConfig", () => {
		const { stepOrgConfig } = extractStepConfiguration(
			{
				"2": {
					ADD_BANK_ACCONT: {
						hide: 0,
						optional: 0,
						meta: { props: { hidePassbook: true } },
					},
				},
			} as const,
			2,
			lookup
		);

		const steps = generateInitialSteps({
			onboardingSteps: [{ role: 51700 }], // keeps the bank step (applicableRoles: [51700])
			stepOrgConfig,
		});

		const bankStep = steps.find((s) => s.id === BANK_ID);
		expect(bankStep).toBeDefined();
		expect(bankStep?.orgConfig?.props?.hidePassbook).toBe(true);
	});
});
