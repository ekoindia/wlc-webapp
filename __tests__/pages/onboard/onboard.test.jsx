import Onboard from "pages/onboard";
import { mockRouter, pageRender } from "test-utils";

describe("Onboard", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/page-path");
	});

	it("renders without error", () => {
		const { container } = pageRender(<Onboard />);
		expect(container).not.toBeEmptyDOMElement();
	});

	// it("matches snapshot", () => {
	//	const { asFragment } = pageRender(<Onboard />);
	// 	expect(asFragment()).toMatchSnapshot();
	// });

	test.todo(
		"TODO: add proper test cases for Onboard in __tests__/pages/onboard/onboard.test.jsx"
	);
});
