import type { OnboardingStep } from "features/onboarding/constants";
import { executePipeline } from "features/onboarding/utils/executePipeline";

/**
 * Builds a minimal custom step whose pipeline is a single upload call.
 * `skipIfNoFiles` is toggled to prove the scoped skip behavior.
 * @param skipIfNoFiles
 */
const buildUploadStep = (skipIfNoFiles: boolean): OnboardingStep =>
	({
		id: 999,
		name: "UPLOAD_ONLY",
		label: "Upload only",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		primaryCTAText: "Submit",
		description: "",
		form_data: {},
		localRenderer: { type: "custom", component: "X" }, // no formFields => no filtering
		api: {
			pipeline: [
				{
					id: "upload",
					type: "upload",
					docType: 7,
					interactionTypeId: 1,
					skipIfNoFiles,
				},
			],
		},
	}) as OnboardingStep;

const baseOptions = (stepConfig: OnboardingStep) => ({
	stepConfig,
	formData: { id: 999, form_data: { account: "12345" } }, // no File present
	mobile: "9999999999",
	accessToken: "token",
	generateNewToken: jest.fn(),
});

describe("executePipeline — upload with no files", () => {
	const fetchSpy = jest.fn();

	beforeEach(() => {
		fetchSpy.mockReset();
		global.fetch = fetchSpy as unknown as typeof fetch;
	});

	it("skips the upload as success when skipIfNoFiles is set (no network call)", async () => {
		const result = await executePipeline(
			baseOptions(buildUploadStep(true))
		);

		expect(result.status).toBe("success");
		expect(result.list[0].status).toBe("success");
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it("fails the upload when skipIfNoFiles is NOT set (required upload)", async () => {
		// Backend would reject an empty upload — model that with a non-ok response.
		fetchSpy.mockResolvedValue({ ok: false });

		const result = await executePipeline(
			baseOptions(buildUploadStep(false))
		);

		expect(result.status).toBe("failed");
		expect(result.list[0].status).toBe("failed");
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});
