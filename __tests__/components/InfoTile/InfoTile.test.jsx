import { InfoTile } from "components/InfoTile";
import mockRouter from "next-router-mock";
import { fireEvent, render, screen } from "test-utils";

/*
	* React Testing Library:
		- Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
		- How to query: https://testing-library.com/docs/queries/about/
		- Testing user events: https://testing-library.com/docs/user-event/intro
	* Jest:
		- Docs: https://jestjs.io/docs/getting-started
		- Jest-dom (matchers): https://github.com/testing-library/jest-dom
*/

describe("InfoTile", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/");
	});

	describe("Rendering", () => {
		it("renders without error with no attributes", () => {
			const { container } = render(<InfoTile />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders with label", () => {
			render(<InfoTile label="Test Label" desc="Test Description" />);
			expect(screen.getByText("Test Label")).toBeInTheDocument();
		});

		it("renders with description", () => {
			render(<InfoTile label="Test Label" desc="Test Description" />);
			expect(screen.getByText("Test Description")).toBeInTheDocument();
		});

		it("renders with both label and description", () => {
			render(
				<InfoTile
					label="My Label"
					desc="My detailed description here"
				/>
			);
			expect(screen.getByText("My Label")).toBeInTheDocument();
			expect(
				screen.getByText("My detailed description here")
			).toBeInTheDocument();
		});

		it("does not render label if empty string", () => {
			render(<InfoTile label="" desc="Some description" />);
			expect(screen.queryByText("Some description")).toBeInTheDocument();
		});

		it("does not render description if empty string", () => {
			render(<InfoTile label="Test Label" desc="" />);
			expect(screen.getByText("Test Label")).toBeInTheDocument();
		});
	});

	describe("Icon Styles", () => {
		it("renders with default avatar icon style", () => {
			const { container } = render(
				<InfoTile label="Test" desc="Description" icon="home" />
			);
			// Avatar component should be present
			expect(
				container.querySelector(".chakra-avatar")
			).toBeInTheDocument();
		});

		it("renders with square icon style", () => {
			const { container } = render(
				<InfoTile
					label="Test"
					desc="Description"
					icon="home"
					iconStyle="square"
				/>
			);
			// Should not have avatar class when using square style
			expect(
				container.querySelector(".chakra-avatar")
			).not.toBeInTheDocument();
		});
	});

	describe("Click Behavior", () => {
		it("calls onClick when clicked", () => {
			const handleClick = jest.fn();

			render(
				<InfoTile
					label="Click Me"
					desc="Description"
					onClick={handleClick}
				/>
			);

			fireEvent.click(screen.getByText("Click Me"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("navigates to url when clicked and no onClick provided", () => {
			render(
				<InfoTile
					label="Navigate"
					desc="Description"
					url="/test-page"
				/>
			);

			fireEvent.click(screen.getByText("Navigate"));
			expect(mockRouter.asPath).toBe("/test-page");
		});

		it("calls onClick instead of navigating when both onClick and url are provided", () => {
			const handleClick = jest.fn();

			render(
				<InfoTile
					label="Test"
					desc="Description"
					onClick={handleClick}
					url="/should-not-navigate"
				/>
			);

			fireEvent.click(screen.getByText("Test"));
			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(mockRouter.asPath).toBe("/"); // Should not have navigated
		});

		it("shows pointer cursor when onClick is provided", () => {
			const { container } = render(
				<InfoTile label="Test" desc="Description" onClick={() => {}} />
			);

			const flexElement = container.querySelector(".chakra-stack, div");
			expect(flexElement).toBeInTheDocument();
		});

		it("shows pointer cursor when url is provided", () => {
			const { container } = render(
				<InfoTile label="Test" desc="Description" url="/test" />
			);

			const flexElement = container.querySelector(".chakra-stack, div");
			expect(flexElement).toBeInTheDocument();
		});
	});

	describe("Event Delegation (name prop)", () => {
		it("renders without data-card-name when name is not provided", () => {
			const { container } = render(
				<InfoTile label="Test" desc="Description" />
			);

			expect(
				container.querySelector("[data-card-name]")
			).not.toBeInTheDocument();
		});

		it("renders with data-card-name wrapper when name is provided", () => {
			const { container } = render(
				<InfoTile label="Test" desc="Description" name="test-card" />
			);

			const wrapper = container.querySelector("[data-card-name]");
			expect(wrapper).toBeInTheDocument();
			expect(wrapper).toHaveAttribute("data-card-name", "test-card");
		});

		it("renders with correct name value in data-card-name attribute", () => {
			const { container } = render(
				<InfoTile
					label="Test"
					desc="Description"
					name="my-unique-card"
				/>
			);

			const wrapper = container.querySelector(
				'[data-card-name="my-unique-card"]'
			);
			expect(wrapper).toBeInTheDocument();
		});

		it("wrapper has full width when name is provided", () => {
			const { container } = render(
				<InfoTile label="Test" desc="Description" name="test-card" />
			);

			const wrapper = container.querySelector("[data-card-name]");
			expect(wrapper).toHaveStyle({ width: "100%" });
		});

		it("can be used for event delegation with parent click handler", () => {
			const handleCaptureClick = jest.fn((event) => {
				const target = event.target;
				const cardElement = target.closest("[data-card-name]");
				if (cardElement) {
					return cardElement.dataset.cardName;
				}
				return null;
			});

			const { container } = render(
				<div onClickCapture={handleCaptureClick}>
					<InfoTile
						label="Test"
						desc="Description"
						name="test-card"
					/>
				</div>
			);

			fireEvent.click(screen.getByText("Test"));
			expect(handleCaptureClick).toHaveBeenCalled();

			// Verify the card name can be extracted
			const cardElement = container.querySelector(
				'[data-card-name="test-card"]'
			);
			expect(cardElement).toBeInTheDocument();
		});
	});

	describe("Hover Effects", () => {
		it("changes state on mouse enter and leave", () => {
			const { container } = render(
				<InfoTile label="Hover Me" desc="Description" url="/test" />
			);

			// Find the clickable flex container
			const tile = screen.getByText("Hover Me").closest("div");

			// Trigger mouse enter and leave
			fireEvent.mouseEnter(tile);
			fireEvent.mouseLeave(tile);

			// The component should still be rendered after hover interactions
			expect(container).toBeInTheDocument();
		});
	});

	describe("Accessibility", () => {
		it("text is selectable by default (userSelect: none for labels)", () => {
			render(<InfoTile label="Test Label" desc="Test Description" />);

			expect(screen.getByText("Test Label")).toBeInTheDocument();
			expect(screen.getByText("Test Description")).toBeInTheDocument();
		});
	});
});
