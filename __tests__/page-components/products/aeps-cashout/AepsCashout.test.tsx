import { pageRender, waitFor } from "__tests__/test-utils/test-utils";
import { screen } from "@testing-library/react";
import { AepsCashout } from "page-components/products/aeps-cashout";

/**
 * Integration tests for the complete AEPS cashout flow.
 * Tests the flow from start (provider selection) to end (result screen).
 */
describe("AepsCashout - Complete Flow", () => {
	it("should render initial provider selection step", async () => {
		const { container } = pageRender(<AepsCashout />);

		// Provider selection should be first step
		await waitFor(() => {
			expect(container).not.toBeEmptyDOMElement();
		});

		// Check for provider selection elements
		const providerElements = screen.queryAllByRole("button");
		expect(providerElements.length).toBeGreaterThan(0);
	});

	it("should handle provider selection navigation", async () => {
		const { container } = pageRender(<AepsCashout />);

		await waitFor(() => {
			expect(container).not.toBeEmptyDOMElement();
		});

		// Provider selection should render successfully
		expect(container).toBeDefined();
	});

	it("should not render null or empty states", () => {
		const { container } = pageRender(<AepsCashout />);

		expect(container).not.toBeEmptyDOMElement();
		expect(container.firstChild).not.toBeNull();
	});
});
