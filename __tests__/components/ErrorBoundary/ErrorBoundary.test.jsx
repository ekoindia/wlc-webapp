import { ErrorBoundary } from "components/ErrorBoundary";
import { render } from "test-utils";

const Child = () => {
	throw new Error();
};

describe("Error Boundary", () => {
	it(`should render error boundary component in case of error`, () => {
		console.error = jest.fn();

		const { container } = render(
			<ErrorBoundary>
				<Child />
			</ErrorBoundary>
		);
		expect(container).toHaveTextContent("something went wrong");
	});
});
