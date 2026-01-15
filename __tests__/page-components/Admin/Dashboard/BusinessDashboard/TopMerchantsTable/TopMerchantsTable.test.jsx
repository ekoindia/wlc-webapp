import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import { TopMerchantsTable } from "page-components/Admin/Dashboard/BusinessDashboard/TopMerchantsTable";

// Mock the Currency and DateView components to avoid deep dependency issues
jest.mock("components", () => ({
	Currency: ({ value }) => <span data-testid="currency">{value}</span>,
	DateView: ({ date }) => <span data-testid="date">{date}</span>,
}));

const mockMerchantData = [
	{
		name: "Rajesh Kumar",
		status: "active",
		usercode: "RK001",
		gtv: 1250000,
		totalTransactions: 456,
		onboardingDate: "2024-01-15",
		distributorMapped: "Metro Distributors",
	},
	{
		name: "Priya Sharma",
		status: "inactive",
		usercode: "PS002",
		gtv: 950000,
		totalTransactions: 321,
		onboardingDate: "2024-02-10",
		distributorMapped: "City Networks",
	},
];

const renderWithChakra = (component) => {
	return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("TopMerchantsTable component", () => {
	it("renders successfully with merchant data", () => {
		const { container } = renderWithChakra(
			<TopMerchantsTable data={mockMerchantData} isLoading={false} />
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("displays loading state correctly", () => {
		const { container } = renderWithChakra(
			<TopMerchantsTable data={[]} isLoading={true} />
		);

		// Should show skeleton loading boxes
		const skeletonBoxes = container.querySelectorAll("div");
		// Should have multiple divs for skeleton loading, at least 5
		expect(skeletonBoxes.length).toBeGreaterThan(4);
	});

	it("displays empty state when no data", () => {
		const { getByText } = renderWithChakra(
			<TopMerchantsTable data={[]} isLoading={false} />
		);

		expect(getByText("No merchants found")).toBeInTheDocument();
	});

	it("displays merchant names when data is provided", () => {
		const { getByText } = renderWithChakra(
			<TopMerchantsTable data={mockMerchantData} isLoading={false} />
		);

		expect(getByText("Rajesh Kumar")).toBeInTheDocument();
		expect(getByText("Priya Sharma")).toBeInTheDocument();
	});
});
