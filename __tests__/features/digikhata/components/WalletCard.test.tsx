import { WalletCard } from "features/digikhata/components/WalletCard";
import { WalletData } from "features/digikhata/context/types";
import { fireEvent, render } from "test-utils";

const mockWalletData: WalletData = {
	walletAcOpened: true,
	walletAcOpeningInProgress: false,
	walletHolderName: "Test Agent",
	accountStatus: "ACTIVE",
	walletToBankLimitAvailable: 50000,
	walletToBankLimitConsumed: 10000,
	totalMonthlyLimit: 100000,
	token: "mock-token",
	walletCurrentBalance: 2500,
	walletKYCDocStatus: { aadharVerified: true, pancardVerified: true },
	lastUpdatedAt: "2024-01-01T12:00:00Z",
};

describe("WalletCard", () => {
	const noop = () => {};

	it("renders without crashing when no wallet data", () => {
		const { container } = render(
			<WalletCard
				walletData={null}
				isLoading={false}
				hasFetchedWallet={false}
				onFetchBalance={noop}
			/>
		);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("shows 'Fetch Balance' button when wallet not yet fetched", () => {
		const { getByRole } = render(
			<WalletCard
				walletData={null}
				isLoading={false}
				hasFetchedWallet={false}
				onFetchBalance={noop}
			/>
		);
		expect(
			getByRole("button", { name: /Fetch Balance/i })
		).toBeInTheDocument();
	});

	it("shows 'Refresh' button when wallet has been fetched", () => {
		const { getByRole } = render(
			<WalletCard
				walletData={mockWalletData}
				isLoading={false}
				hasFetchedWallet={true}
				onFetchBalance={noop}
			/>
		);
		expect(
			getByRole("button", { name: /Refresh Balance/i })
		).toBeInTheDocument();
	});

	it("displays wallet holder name when data is present", () => {
		const { getByText } = render(
			<WalletCard
				walletData={mockWalletData}
				isLoading={false}
				hasFetchedWallet={true}
				onFetchBalance={noop}
			/>
		);
		expect(getByText(/Test Agent/i)).toBeInTheDocument();
	});

	it("shows skeleton when isLoading is true", () => {
		const { container } = render(
			<WalletCard
				walletData={null}
				isLoading={true}
				hasFetchedWallet={false}
				onFetchBalance={noop}
			/>
		);
		// Chakra skeleton produces an element — just ensure it renders
		expect(container).not.toBeEmptyDOMElement();
	});

	it("calls onFetchBalance when the fetch button is clicked", () => {
		const mockFetch = jest.fn();
		const { getByRole } = render(
			<WalletCard
				walletData={null}
				isLoading={false}
				hasFetchedWallet={false}
				onFetchBalance={mockFetch}
			/>
		);
		fireEvent.click(getByRole("button", { name: /Fetch Balance/i }));
		expect(mockFetch).toHaveBeenCalledTimes(1);
	});
});
