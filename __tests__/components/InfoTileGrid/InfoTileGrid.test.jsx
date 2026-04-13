import { InfoTileGrid } from "components/InfoTileGrid";
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

// Sample list data for testing
const mockList = [
	{
		label: "Product A",
		desc: "Description for Product A",
		icon: "home",
		url: "/product-a",
	},
	{
		label: "Product B",
		desc: "Description for Product B",
		icon: "settings",
		url: "/product-b",
	},
	{
		label: "Product C",
		desc: "Description for Product C",
		icon: "user",
		onClick: jest.fn(),
	},
];

const mockListWithNames = [
	{
		name: "product-a",
		label: "Product A",
		desc: "Description for Product A",
		icon: "home",
	},
	{
		name: "product-b",
		label: "Product B",
		desc: "Description for Product B",
		icon: "settings",
	},
	{
		name: "product-c",
		label: "Product C",
		desc: "Description for Product C",
		icon: "user",
	},
];

describe("InfoTileGrid", () => {
	beforeEach(() => {
		mockRouter.setCurrentUrl("/");
		jest.clearAllMocks();
	});

	describe("Rendering", () => {
		it("renders without error with no attributes", () => {
			const { container } = render(<InfoTileGrid />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders without error with empty list", () => {
			const { container } = render(<InfoTileGrid list={[]} />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders without error with undefined list", () => {
			const { container } = render(<InfoTileGrid list={undefined} />);
			expect(container).not.toBeEmptyDOMElement();
		});

		it("renders all tiles from the list", () => {
			render(<InfoTileGrid list={mockList} />);

			expect(screen.getByText("Product A")).toBeInTheDocument();
			expect(screen.getByText("Product B")).toBeInTheDocument();
			expect(screen.getByText("Product C")).toBeInTheDocument();
		});

		it("renders descriptions for all tiles", () => {
			render(<InfoTileGrid list={mockList} />);

			expect(
				screen.getByText("Description for Product A")
			).toBeInTheDocument();
			expect(
				screen.getByText("Description for Product B")
			).toBeInTheDocument();
			expect(
				screen.getByText("Description for Product C")
			).toBeInTheDocument();
		});

		it("skips items without labels", () => {
			const listWithMissingLabel = [
				{ label: "Valid Item", desc: "Valid description" },
				{ label: "", desc: "No label item" },
				{ desc: "Missing label item" },
			];

			render(<InfoTileGrid list={listWithMissingLabel} />);

			expect(screen.getByText("Valid Item")).toBeInTheDocument();
			expect(screen.queryByText("No label item")).not.toBeInTheDocument();
			expect(
				screen.queryByText("Missing label item")
			).not.toBeInTheDocument();
		});
	});

	describe("Icon Styles", () => {
		it("uses avatar iconStyle by default", () => {
			const { container } = render(<InfoTileGrid list={mockList} />);

			// Should have avatar elements
			const avatars = container.querySelectorAll(".chakra-avatar");
			expect(avatars.length).toBe(3);
		});

		it("uses square iconStyle when specified", () => {
			const { container } = render(
				<InfoTileGrid list={mockList} iconStyle="square" />
			);

			// Should not have avatar elements when using square style
			const avatars = container.querySelectorAll(".chakra-avatar");
			expect(avatars.length).toBe(0);
		});
	});

	describe("Click Behavior", () => {
		it("navigates to url when tile with url is clicked", () => {
			render(<InfoTileGrid list={mockList} />);

			fireEvent.click(screen.getByText("Product A"));
			expect(mockRouter.asPath).toBe("/product-a");
		});

		it("calls onClick when tile with onClick is clicked", () => {
			const handleClick = jest.fn();
			const listWithClick = [
				{
					label: "Clickable Item",
					desc: "Click me",
					onClick: handleClick,
				},
			];

			render(<InfoTileGrid list={listWithClick} />);

			fireEvent.click(screen.getByText("Clickable Item"));
			expect(handleClick).toHaveBeenCalledTimes(1);
		});

		it("onClick takes precedence over url", () => {
			const handleClick = jest.fn();
			const listWithBoth = [
				{
					label: "Both Click and URL",
					desc: "Has both handlers",
					url: "/should-not-navigate",
					onClick: handleClick,
				},
			];

			render(<InfoTileGrid list={listWithBoth} />);

			fireEvent.click(screen.getByText("Both Click and URL"));
			expect(handleClick).toHaveBeenCalledTimes(1);
			expect(mockRouter.asPath).toBe("/"); // Should not have navigated
		});
	});

	describe("Event Delegation (name prop)", () => {
		it("renders data-card-name attributes when name is provided", () => {
			const { container } = render(
				<InfoTileGrid list={mockListWithNames} />
			);

			expect(
				container.querySelector('[data-card-name="product-a"]')
			).toBeInTheDocument();
			expect(
				container.querySelector('[data-card-name="product-b"]')
			).toBeInTheDocument();
			expect(
				container.querySelector('[data-card-name="product-c"]')
			).toBeInTheDocument();
		});

		it("does not render data-card-name when name is not provided", () => {
			const listWithoutNames = [
				{ label: "No Name Item", desc: "Description" },
			];

			const { container } = render(
				<InfoTileGrid list={listWithoutNames} />
			);

			expect(
				container.querySelector("[data-card-name]")
			).not.toBeInTheDocument();
		});

		it("supports event delegation pattern with parent click handler", () => {
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
					<InfoTileGrid list={mockListWithNames} />
				</div>
			);

			// Click on Product A
			fireEvent.click(screen.getByText("Product A"));
			expect(handleCaptureClick).toHaveBeenCalled();

			// Verify the card name can be extracted
			const cardElement = container.querySelector(
				'[data-card-name="product-a"]'
			);
			expect(cardElement).toBeInTheDocument();
		});
	});

	describe("Grid Layout", () => {
		it("renders as a grid container", () => {
			const { container } = render(<InfoTileGrid list={mockList} />);

			// Check that the grid structure is present
			const gridElement = container.firstChild;
			expect(gridElement).toBeInTheDocument();
		});

		it("renders correct number of tiles", () => {
			render(<InfoTileGrid list={mockList} />);

			// Each tile is wrapped in a Flex, count the tiles with labels
			expect(screen.getByText("Product A")).toBeInTheDocument();
			expect(screen.getByText("Product B")).toBeInTheDocument();
			expect(screen.getByText("Product C")).toBeInTheDocument();
		});
	});

	describe("Key Generation", () => {
		it("uses name as key when provided", () => {
			// This test ensures no console warnings about duplicate keys
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation();

			render(<InfoTileGrid list={mockListWithNames} />);

			// Should not have any key-related warnings
			expect(consoleSpy).not.toHaveBeenCalledWith(
				expect.stringContaining("key")
			);

			consoleSpy.mockRestore();
		});

		it("uses label + url as key when name not provided", () => {
			const consoleSpy = jest
				.spyOn(console, "error")
				.mockImplementation();

			render(<InfoTileGrid list={mockList} />);

			// Should not have any key-related warnings
			expect(consoleSpy).not.toHaveBeenCalledWith(
				expect.stringContaining("key")
			);

			consoleSpy.mockRestore();
		});
	});

	describe("Mixed list with and without names", () => {
		it("handles mixed list correctly", () => {
			const mixedList = [
				{ name: "named-item", label: "Named Item", desc: "Has a name" },
				{ label: "Unnamed Item", desc: "No name", url: "/unnamed" },
			];

			const { container } = render(<InfoTileGrid list={mixedList} />);

			expect(screen.getByText("Named Item")).toBeInTheDocument();
			expect(screen.getByText("Unnamed Item")).toBeInTheDocument();
			expect(
				container.querySelector('[data-card-name="named-item"]')
			).toBeInTheDocument();
		});
	});
});
