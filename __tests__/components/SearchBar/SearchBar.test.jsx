import SearchBar from "components/SearchBar/SearchBar";
import { act, fireEvent, render, screen, waitFor } from "test-utils";

/*
 * React Testing Library:
 *   - Cheatsheet: https://testing-library.com/docs/react-testing-library/cheatsheet
 *   - Testing user events: https://testing-library.com/docs/user-event/intro
 * Jest:
 *   - Docs: https://jestjs.io/docs/getting-started
 *   - Jest-dom matchers: https://github.com/testing-library/jest-dom
 *
 * Note: jest.config.js enables fakeTimers globally so we use
 * `jest.advanceTimersByTime` to flush the 300 ms debounce.
 */

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Stable module-level reference — mirrors the fix in SearchBar.tsx. */
const SEARCH_KEYS = ["name", "mobile"];

const SAMPLE_USERS = [
	{ name: "Alice Smith", mobile: "9876543210" },
	{ name: "Bob Jones", mobile: "9123456789" },
	{ name: "Charlie Brown", mobile: "8000000001" },
	{ name: "alice kumar", mobile: "7000000002" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the underlying <input> rendered by the SearchBar. */
const getInput = () => screen.getByRole("textbox");

/**
 * Types into the input and advances fake timers past the debounce delay.
 * @param text
 */
const typeAndDebounce = async (text) => {
	fireEvent.change(getInput(), { target: { value: text } });
	act(() => jest.advanceTimersByTime(350));
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("SearchBar", () => {
	it("renders without error with required props only", () => {
		const { container } = render(
			<SearchBar setSearch={jest.fn()} searchKeys={SEARCH_KEYS} />
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("renders the placeholder text", () => {
		render(
			<SearchBar
				setSearch={jest.fn()}
				placeholder="Search by Mobile"
				searchKeys={SEARCH_KEYS}
			/>
		);
		expect(getInput()).toHaveAttribute("placeholder", "Search by Mobile");
	});

	// -------------------------------------------------------------------------
	// Simple search mode (no dataList)
	// -------------------------------------------------------------------------

	describe("Simple search mode (no dataList)", () => {
		it("calls setSearch with the input value when Enter is pressed", () => {
			const mockSetSearch = jest.fn();
			render(
				<SearchBar
					setSearch={mockSetSearch}
					searchKeys={SEARCH_KEYS}
					minSearchLimit={0}
					maxSearchLimit={20}
				/>
			);

			fireEvent.change(getInput(), { target: { value: "9876543210" } });
			fireEvent.keyDown(getInput(), { key: "Enter" });

			expect(mockSetSearch).toHaveBeenCalledWith("9876543210");
		});

		it("rejects input silently when value exceeds maxSearchLimit", () => {
			render(
				<SearchBar
					setSearch={jest.fn()}
					searchKeys={SEARCH_KEYS}
					minSearchLimit={0}
					maxSearchLimit={5}
				/>
			);

			// handleChange enforces the limit — the input stays empty
			fireEvent.change(getInput(), { target: { value: "toolongvalue" } });
			expect(getInput()).toHaveValue("");
		});

		it("does NOT call setSearch when value is below minSearchLimit", () => {
			const mockSetSearch = jest.fn();
			render(
				<SearchBar
					setSearch={mockSetSearch}
					searchKeys={SEARCH_KEYS}
					minSearchLimit={5}
					maxSearchLimit={20}
				/>
			);

			fireEvent.change(getInput(), { target: { value: "ab" } });
			fireEvent.keyDown(getInput(), { key: "Enter" });

			expect(mockSetSearch).not.toHaveBeenCalled();
		});

		it("does not render a dropdown when dataList is not provided", async () => {
			render(
				<SearchBar
					setSearch={jest.fn()}
					searchKeys={SEARCH_KEYS}
					placeholder="Search"
				/>
			);

			await typeAndDebounce("Alice");

			// No dropdown items should appear
			expect(screen.queryByText(/alice smith/i)).not.toBeInTheDocument();
		});
	});

	// -------------------------------------------------------------------------
	// Type-ahead dropdown mode
	// -------------------------------------------------------------------------

	describe("Type-ahead dropdown mode (dataList provided)", () => {
		const defaultProps = {
			setSearch: jest.fn(),
			dataList: SAMPLE_USERS,
			searchKeys: SEARCH_KEYS,
			minSearchLimit: 0,
			maxDropdownItems: 5,
		};

		it("shows matching results in the dropdown after debounce", async () => {
			render(<SearchBar {...defaultProps} />);

			await typeAndDebounce("Alice");

			await waitFor(() => {
				// "Alice Smith" and "alice kumar" both match
				expect(screen.getByText(/alice smith/i)).toBeInTheDocument();
				expect(screen.getByText(/alice kumar/i)).toBeInTheDocument();
			});
		});

		it("performs case-insensitive, whitespace-collapsed matching", async () => {
			render(
				<SearchBar
					{...defaultProps}
					maxSearchLimit={15} // "charliebrown" is 11 chars — exceed default 10
				/>
			);

			// "charliebrown" (no space) should still match "Charlie Brown"
			await typeAndDebounce("charliebrown");

			await waitFor(() => {
				expect(screen.getByText(/charlie brown/i)).toBeInTheDocument();
			});
		});

		it("matches against mobile number search key", async () => {
			render(<SearchBar {...defaultProps} />);

			await typeAndDebounce("9123");

			await waitFor(() => {
				// Bob Jones has mobile 9123456789
				expect(screen.getByText(/bob jones/i)).toBeInTheDocument();
			});
		});

		it("hides the dropdown when input is cleared", async () => {
			render(<SearchBar {...defaultProps} />);

			await typeAndDebounce("Alice");
			await waitFor(() =>
				expect(screen.getByText(/alice smith/i)).toBeInTheDocument()
			);

			await typeAndDebounce("");
			await waitFor(() =>
				expect(
					screen.queryByText(/alice smith/i)
				).not.toBeInTheDocument()
			);
		});

		it("respects maxDropdownItems limit", async () => {
			const manyUsers = Array.from({ length: 10 }, (_, i) => ({
				name: `User ${i}`,
				mobile: `900000000${i}`,
			}));

			render(
				<SearchBar
					setSearch={jest.fn()}
					dataList={manyUsers}
					searchKeys={SEARCH_KEYS}
					minSearchLimit={0}
					maxDropdownItems={3}
				/>
			);

			await typeAndDebounce("User");

			await waitFor(() => {
				const items = screen.getAllByText(/^User \d+$/);
				expect(items).toHaveLength(3);
			});
		});

		it("calls onItemSelect with the selected item when a dropdown entry is clicked", async () => {
			const mockOnItemSelect = jest.fn();
			render(
				<SearchBar {...defaultProps} onItemSelect={mockOnItemSelect} />
			);

			await typeAndDebounce("Bob");
			await waitFor(() =>
				expect(screen.getByText(/bob jones/i)).toBeInTheDocument()
			);

			fireEvent.click(
				screen.getByText(/bob jones/i).closest("[role]") ??
					screen.getByText(/bob jones/i)
			);

			expect(mockOnItemSelect).toHaveBeenCalledWith(
				expect.objectContaining({
					name: "Bob Jones",
					mobile: "9123456789",
				})
			);
		});

		it("closes the dropdown after an item is selected", async () => {
			render(<SearchBar {...defaultProps} onItemSelect={jest.fn()} />);

			await typeAndDebounce("Alice");
			await waitFor(() =>
				expect(screen.getByText(/alice smith/i)).toBeInTheDocument()
			);

			fireEvent.click(screen.getByText(/alice smith/i));

			await waitFor(() =>
				expect(
					screen.queryByText(/alice smith/i)
				).not.toBeInTheDocument()
			);
		});

		it("closes the dropdown when clicking outside the component", async () => {
			render(
				<div>
					<SearchBar {...defaultProps} />
					<button>Outside</button>
				</div>
			);

			await typeAndDebounce("Alice");
			await waitFor(() =>
				expect(screen.getByText(/alice smith/i)).toBeInTheDocument()
			);

			fireEvent.mouseDown(
				screen.getByRole("button", { name: /outside/i })
			);

			await waitFor(() =>
				expect(
					screen.queryByText(/alice smith/i)
				).not.toBeInTheDocument()
			);
		});

		it("does NOT show dropdown when query is shorter than minSearchLimit", async () => {
			render(<SearchBar {...defaultProps} minSearchLimit={3} />);

			await typeAndDebounce("Al"); // 2 chars < minSearchLimit of 3

			await waitFor(() =>
				expect(
					screen.queryByText(/alice smith/i)
				).not.toBeInTheDocument()
			);
		});

		it("uses the custom renderItem function when provided", async () => {
			render(
				<SearchBar
					{...defaultProps}
					renderItem={(item) => (
						<span data-testid="custom-item">
							{item.name} — custom
						</span>
					)}
				/>
			);

			await typeAndDebounce("Alice");

			await waitFor(() => {
				const customItems = screen.getAllByTestId("custom-item");
				expect(customItems.length).toBeGreaterThan(0);
				expect(customItems[0]).toHaveTextContent("— custom");
			});
		});
	});
});
