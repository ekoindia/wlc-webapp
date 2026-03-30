import { DigiKhataPage } from "features/digikhata";
import { render } from "test-utils";

const mockCheckFeatureFlag = jest.fn(() => true);

jest.mock("@copilotkit/react-core", () => ({
	__esModule: true,
	CopilotKit: ({ children }: { children: React.ReactNode }) => children,
	useCopilotAction: jest.fn(),
	useCopilotReadable: jest.fn(),
}));

jest.mock("@copilotkit/react-ui", () => ({
	__esModule: true,
	CopilotPopup: () => null,
	useCopilotChatSuggestions: jest.fn(),
}));

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
	default: () => [true, mockCheckFeatureFlag],
}));

jest.mock("contexts", () => ({
	__esModule: true,
	useUser: () => ({
		userData: {
			userDetails: {
				mobile: "9999999999",
			},
		},
	}),
}));

describe("DigiKhataPage", () => {
	it("renders initial DigiKhata wallet state", () => {
		const { container, getByRole, getByText } = render(<DigiKhataPage />);
		expect(container).not.toBeEmptyDOMElement();
		expect(
			getByRole("button", { name: /Fetch Balance/i })
		).toBeInTheDocument();
		expect(
			getByText(/Your DigiKhata Wallet is locked/i)
		).toBeInTheDocument();
	});
});
