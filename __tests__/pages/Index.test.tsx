import Index from "@/pages/index";
import { loggedOutPageRender, screen } from "test-utils";

describe("Login (index) page", () => {
	it("should render properly with 'Login' heading", () => {
		loggedOutPageRender(
			<Index
				data={{
					org_id: 2,
					org_name: "ABC Corp",
					org_logo: "",
					app_name: "Abc",
				}}
			/>
		);

		const header = screen.getByRole("heading");
		const headerText = "Login";

		expect(header).toHaveTextContent(headerText);
	});

	test.todo(
		"TODO: add test cases for the index (Login) page: render custom logo, mobile number input, conditional Google login button"
	);
});
