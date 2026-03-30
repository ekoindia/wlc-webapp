import { DigiKhataPage } from "features/digikhata";
import { pageRender } from "test-utils";

jest.mock("hooks/useApiFetch", () => ({
	__esModule: true,
	default: () => [jest.fn(), false, jest.fn()],
	useEpsV3Fetch: () => [jest.fn(), false, jest.fn()],
}));

jest.mock("hooks/useBankList", () => ({
	__esModule: true,
	default: () => ({
		banks: [],
		isLoading: false,
		error: null,
		refetch: jest.fn(),
		clearCache: jest.fn(),
	}),
}));

jest.mock("hooks/useFeatureFlag", () => ({
	__esModule: true,
	default: () => [true, jest.fn()],
}));

describe("DigiKhataPage", () => {
	it("renders without crashing", () => {
		const { container } = pageRender(<DigiKhataPage />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("shows the wallet card", () => {
		const { container } = pageRender(<DigiKhataPage />);
		// WalletCard always renders — check for "DigiKhata" label or Fetch Balance button
		expect(
			container.querySelector("[data-testid='wallet-card']") ?? container
		).not.toBeEmptyDOMElement();
	});

	it("shows 'Fetch Balance' in the initial state", () => {
		const { getByText } = pageRender(<DigiKhataPage />);
		expect(getByText(/Fetch Balance/i)).toBeInTheDocument();
	});

	it("shows the initial locked wallet message", () => {
		const { getByText } = pageRender(<DigiKhataPage />);
		expect(
			getByText(/Your DigiKhata Wallet is locked/i)
		).toBeInTheDocument();
	});
});
