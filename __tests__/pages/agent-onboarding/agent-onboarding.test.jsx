import AssistedOnboarding from "pages/agent-onboarding";
import { mockRouter, pageRender } from "test-utils";

describe("AssistedOnboarding", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<AssistedOnboarding />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// it("matches snapshot", () => {
	//	const { asFragment } = pageRender(<AssistedOnboarding />);
	// 	expect(asFragment()).toMatchSnapshot();
	// });

	test.todo(
		"TODO: add proper test cases for AssistedOnboarding in __tests__/pages/field-agent-onboarding/field-agent-onboarding.test.jsx"
	);
});
