import AgentOnboarding from "pages/admin/agent-onboarding";
import { mockRouter, pageRender } from "test-utils";

describe("AgentOnboarding", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<AgentOnboarding />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// it("matches snapshot", () => {
	//	const { asFragment } = pageRender(<AgentOnboarding />);
	// 	expect(asFragment()).toMatchSnapshot();
	// });

	test.todo(
		"TODO: add proper test cases for AgentOnboarding in __tests__/pages/admin/agent-onboarding/agent-onboarding.test.jsx"
	);
});
