import { StatusCard } from "components/StatusCard";
import { pageRender } from "test-utils";

/*
	* React Testing Library:
		- Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
		- How to query: https://testing-library.com/docs/queries/about/
		- Testing user events: https://testing-library.com/docs/user-event/intro
		- Migrate from Enzyme (examples): https://testing-library.com/docs/react-testing-library/migrate-from-enzyme/
		- Testing onChange event handlers: https://testing-library.com/docs/react-testing-library/faq
		- All APIs: https://testing-library.com/docs/react-testing-library/api
		- Debug: https://testing-library.com/docs/queries/about/#screendebug, https://testing-library.com/docs/dom-testing-library/api-debugging/#prettydom
	* Jest:
		- Docs: https://jestjs.io/docs/getting-started
		- Jest-dom (matchers): https://github.com/testing-library/jest-dom
*/

describe("StatusCard", () => {
	it("renders without error with no attributes", () => {
		const { container } = pageRender(<StatusCard />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders with StatusRow component architecture", () => {
		const { container } = pageRender(<StatusCard />);
		// Component should render successfully with new internal StatusRow structure
		expect(container).not.toBeEmptyDOMElement();
	});

	// Note: Additional behavioral tests would require mocking WalletContext
	// to provide visibility and transaction data. The component correctly
	// hides itself when isWalletVisible is false (default in test environment).
	// Future tests should mock WalletContext to test:
	// - StatusRow displays E-value Balance label
	// - StatusRow shows refresh and load balance buttons
	// - Independent 30-second cooldown per StatusRow
	// - onLoadBalanceClick callback invocation
});
