import { GstinVerification } from "page-components/products/kyc/gstin/GstinVerification";
import { render } from "test-utils";

describe("GstinVerification", () => {
	it("renders GSTIN and PAN tabs", () => {
		const { getByText } = render(<GstinVerification />);
		expect(getByText("Verify GSTIN")).toBeInTheDocument();
		expect(getByText("Get GSTINs by PAN")).toBeInTheDocument();
	});

	// it("shows GSTIN input and validates length", async () => {
	// 	const { getByLabelText, getByText } = render(<GstinVerification />);
	// 	const input = getByLabelText("GSTIN");
	// 	await userEvent.type(input, "123");
	// 	userEvent.click(getByText("Verify GSTIN"));
	// 	expect(getByText("GSTIN must be 15 characters")).toBeInTheDocument();
	// });

	// it("shows PAN input and validates format", async () => {
	// 	const { getByText, getByLabelText } = render(<GstinVerification />);
	// 	userEvent.click(getByText("Get GSTINs by PAN"));
	// 	const input = getByLabelText("PAN");
	// 	await userEvent.type(input, "1234");
	// 	userEvent.click(getByText("Fetch GSTINs"));
	// 	expect(getByText("Invalid PAN format")).toBeInTheDocument();
	// });
});
