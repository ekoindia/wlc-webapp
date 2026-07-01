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

/**
 * PAN's number (doc_id) and image ride the SAME upload call — there is no separate form
 * step. When an org hides `pan_image` (via `hideFields`), the upload must still fire and
 * submit `doc_id`; `skipIfNoFiles` must therefore NOT be set on PAN, or the number would
 * be silently dropped.
 */
const panNumberOnlyStep = (): OnboardingStep =>
	({
		id: 8,
		name: "PAN_VERIFICATION",
		label: "PAN Verification",
		isRequired: true,
		isVisible: true,
		stepStatus: 0,
		primaryCTAText: "Proceed",
		description: "",
		form_data: {},
		localRenderer: {
			type: "form",
			formFields: [
				{ name: "doc_id", label: "PAN" },
				{ name: "pan_image", label: "PAN Card Image" },
			],
		},
		api: {
			pipeline: [
				{
					id: "upload",
					type: "upload",
					docType: 2,
					interactionTypeId: 1,
					fieldMapping: { pan_image: "file1" },
					successResponseTypeIds: [1569],
					// intentionally NO skipIfNoFiles
				},
			],
		},
	}) as OnboardingStep;

describe("executePipeline — PAN number-only (no skipIfNoFiles)", () => {
	const fetchSpy = jest.fn();

	beforeEach(() => {
		fetchSpy.mockReset();
		global.fetch = fetchSpy as unknown as typeof fetch;
	});

	it("still fires the upload and submits doc_id when no file is present", async () => {
		fetchSpy.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ response_type_id: 1569 }),
		});

		const result = await executePipeline({
			stepConfig: panNumberOnlyStep(),
			formData: { id: 8, form_data: { doc_id: "ABCDE1234F" } },
			mobile: "9999999999",
			accessToken: "token",
			generateNewToken: jest.fn(),
		});

		expect(result.status).toBe("success");
		expect(fetchSpy).toHaveBeenCalledTimes(1);

		// The PAN number must ride the upload call's url-encoded `formdata` field.
		const body = fetchSpy.mock.calls[0][1].body as FormData;
		expect(String(body.get("formdata"))).toContain("doc_id=ABCDE1234F");
	});
});
