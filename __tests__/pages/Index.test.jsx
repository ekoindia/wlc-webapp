import Index from "pages";
import { loggedOutPageRender, screen } from "test-utils";

describe("Login (index) page", () => {
	it("should render properly with login form", () => {
		loggedOutPageRender(<Index />);

		// Check for the label text instead of a heading
		const loginLabel = screen.getByText(/login with your mobile number/i);
		expect(loginLabel).toBeInTheDocument();

		// Verify that the app name is displayed
		const appName = screen.getByText("AbhiPay");
		expect(appName).toBeInTheDocument();

		// Verify that the verify button exists
		const verifyButton = screen.getByText("Verify");
		expect(verifyButton).toBeInTheDocument();
	});

	test.todo(
		"TODO: add test cases for the index (Login) page: render custom logo, mobile number input, conditional Google login button"
	);
});
