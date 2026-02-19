import React from "react";
import { pageRender, screen, userEvent, waitFor } from "test-utils";

// Mock BulkPayout context used by the component
jest.mock(
	"page-components/products/bulk-payout/context/BulkPayoutContext",
	() => ({
		useBulkPayout: () => ({
			setTab: jest.fn(),
			customerParams: { customerName: "ACME", customerNumber: "999" },
			processingBatchCount: 0,
		}),
	})
);

// Mock Dropzone to auto-set a file without dealing with DOM file input
jest.mock("components", () => {
	const actual = jest.requireActual("components");
	const MockDropzone = ({ setFile }: any) => {
		React.useEffect(() => {
			const blob = new Blob(["123"], {
				type: "application/vnd.ms-excel",
			});
			const file = new File([blob], "recipients.xlsx", {
				type: "application/vnd.ms-excel",
			});
			setFile(file);
		}, [setFile]);
		return <div data-testid="mock-dropzone" />;
	};
	return { ...actual, Dropzone: MockDropzone };
});

// Ensure Endpoints exists
jest.mock("constants/EndPoints", () => ({
	Endpoints: { UPLOAD: "/tunnel" },
}));

// Ensure NEXT_PUBLIC_API_BASE_URL is set
process.env.NEXT_PUBLIC_API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com";
process.env.NEXT_PUBLIC_ENV = process.env.NEXT_PUBLIC_ENV || "development";

// Under test
import UploadRecipients from "page-components/products/bulk-payout/components/BulkUpload";

const setupFetchSuccess = () => {
	// @ts-ignore
	global.fetch = jest.fn().mockResolvedValue({
		ok: true,
		status: 200,
		statusText: "OK",
		json: async () => ({ status: 0, message: "ok" }),
	});
};

const getPinInput = () => screen.getByLabelText(/Secret PIN/i);

describe("UploadRecipients - Enter key behavior", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("does not submit on Enter when PIN < 4", async () => {
		setupFetchSuccess();
		pageRender(<UploadRecipients />);
		const pin = getPinInput();
		await userEvent.type(pin, "123{enter}");
		await waitFor(() => expect(global.fetch).not.toHaveBeenCalled());
	});

	it("submits on Enter when PIN length is 4 and file present", async () => {
		setupFetchSuccess();
		pageRender(<UploadRecipients />);
		const pin = getPinInput();
		await userEvent.type(pin, "1234{enter}");
		await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
	});
});
