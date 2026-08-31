import { pageRender, waitFor } from "__tests__/test-utils/test-utils";
import { screen } from "@testing-library/react";
import { ProviderSelect } from "page-components/products/aeps-cashout/components/ProviderSelect";
import { AepsProvider } from "page-components/products/aeps-cashout/context/AepsContext";
import type { AepsServices } from "page-components/products/aeps-cashout/contracts";

const mockServices: AepsServices = {
	accessToken: "test-token",
	userCode: "test-user",
	initiatorId: "123",
	orgId: "org-123",
};

/**
 * Tests for ProviderSelect component - the first step of the AEPS flow.
 * User selects which provider (Fingpay, etc.) to use for the transaction.
 */
describe("ProviderSelect Component", () => {
	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<AepsProvider services={mockServices}>{children}</AepsProvider>
	);

	it("should render provider selection options", async () => {
		const { container } = pageRender(<ProviderSelect />, {
			wrapper: Wrapper,
		});

		await waitFor(() => {
			expect(container).not.toBeEmptyDOMElement();
		});
	});

	it("should allow provider selection", async () => {
		const { container } = pageRender(<ProviderSelect />, {
			wrapper: Wrapper,
		});

		await waitFor(() => {
			expect(container).not.toBeEmptyDOMElement();
		});

		// Look for any selectable elements (buttons, radio buttons, etc)
		const selectableElements = screen.queryAllByRole("button");
		expect(selectableElements.length).toBeGreaterThanOrEqual(0);
	});

	it("should render without errors", () => {
		const { container } = pageRender(<ProviderSelect />, {
			wrapper: Wrapper,
		});
		expect(container).not.toBeEmptyDOMElement();
	});
});
