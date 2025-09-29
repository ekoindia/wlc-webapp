import FieldAgentOnboarding from "pages/field-agent-onboarding";
import { mockRouter, pageRender } from "test-utils";

describe("FieldAgentOnboarding", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<FieldAgentOnboarding />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// it("matches snapshot", () => {
	//	const { asFragment } = pageRender(<FieldAgentOnboarding />);
	// 	expect(asFragment()).toMatchSnapshot();
	// });

	test.todo(
		"TODO: add proper test cases for FieldAgentOnboarding in __tests__/pages/field-agent-onboarding/field-agent-onboarding.test.jsx"
	);
});
