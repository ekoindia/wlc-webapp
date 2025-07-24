import { LocaleProvider, useLocale } from "contexts/LocaleContext";
import { render } from "test-utils";

describe("LocaleContext", () => {
	it("renders successfully", () => {
		const { container } = render(
			<LocaleProvider>
				<div>Test content</div>
			</LocaleProvider>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("provides default locale as 'en'", () => {
		const TestComponent = () => {
			const { locale } = useLocale();
			return <div data-testid="locale">{locale}</div>;
		};

		const { getByTestId } = render(
			<LocaleProvider>
				<TestComponent />
			</LocaleProvider>
		);

		expect(getByTestId("locale")).toHaveTextContent("en");
	});
});
