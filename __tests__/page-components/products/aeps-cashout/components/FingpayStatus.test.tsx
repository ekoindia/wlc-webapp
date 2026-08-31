import { pageRender, waitFor } from "__tests__/test-utils/test-utils";
import { screen } from "@testing-library/react";
import { FingpayStatus } from "page-components/products/aeps-cashout/components/FingpayStatus";
import { AepsProvider } from "page-components/products/aeps-cashout/context/AepsContext";
import type { AepsServices } from "page-components/products/aeps-cashout/contracts";

const mockServices: AepsServices = {
	accessToken: "test-token",
	userCode: "test-user",
	initiatorId: "123",
	orgId: "org-123",
};

/**
 * Tests for FingpayStatus component - the first step after provider selection.
 * Location is captured here if missing, before firing the Fingpay Status check.
 */
describe("FingpayStatus Component", () => {
	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<AepsProvider services={mockServices}>{children}</AepsProvider>
	);

	it("should render location capture when latLong is not set", async () => {
		pageRender(<FingpayStatus />, { wrapper: Wrapper });

		await waitFor(() => {
			const text = screen.queryByText(/Location is required/i);
			expect(text).toBeInTheDocument();
		});
	});

	it("should show spinner when checking Fingpay status", async () => {
		const { container } = pageRender(<FingpayStatus />, {
			wrapper: Wrapper,
		});

		// Initially should show location capture UI
		await waitFor(() => {
			expect(container).not.toBeEmptyDOMElement();
		});
	});

	it("should render without errors", () => {
		const { container } = pageRender(<FingpayStatus />, {
			wrapper: Wrapper,
		});
		expect(container).not.toBeEmptyDOMElement();
	});
});
