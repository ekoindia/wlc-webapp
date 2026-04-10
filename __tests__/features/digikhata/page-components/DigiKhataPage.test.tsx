import { DigiKhataPage } from "features/digikhata";
import { render } from "test-utils";

const mockCheckFeatureFlag = jest.fn(() => true);

jest.mock("@copilotkit/react-core", () => ({
	__esModule: true,
	CopilotKit: ({ children }: { children: React.ReactNode }) => children,
	useCopilotAction: jest.fn(),
	useCopilotReadable: jest.fn(),
}));

const mockGenerateSenderOtp = jest.fn();

jest.mock("features/digikhata/hooks/useDigiKhataApi", () => ({
	__esModule: true,
	useDigiKhataApi: () => ({
		generateSenderOtp: mockGenerateSenderOtp,
		isGeneratingSenderOtp: false,
		verifySenderOtp: jest.fn(),
		isVerifyingSenderOtp: false,
	}),
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
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders initial DigiKhata wallet state", () => {
		const { container } = render(<DigiKhataPage />);
		expect(container).not.toBeEmptyDOMElement();
	});

	it("shows an error toast if API returns an unhandled response in handleFetchBalance", async () => {
		// Mock API returning unhandled response type (not 2129, 308, or 309)
		mockGenerateSenderOtp.mockResolvedValueOnce({
			data: {
				response_type_id: 999, // Unhandled
				message: "Test OTP Failed",
				data: {
					description: "This is a forced error description",
				},
			},
		});

		const { getByRole, findByText } = render(<DigiKhataPage />);

		// Trigger the balance fetch. Assuming the "Get Started" or similar button is there.
		// Actually the existing test checked for "Fetch Balance"? But it failed.
		// Let's click the first button that triggers it.
		// DigiKhataInner has a WalletCard which has the onFetchBalance prop.
		// We'll click the button present in WalletCard.
		// Let's use text match instead.

		const getStartedBtn = getByRole("button", {
			name: /(Create Wallet|Get Started|Fetch Balance|Retry)/i,
		});
		getStartedBtn.click();

		// Wait for the toast to appear
		const toastTitle = await findByText("Test OTP Failed");
		const toastDesc = await findByText(
			"This is a forced error description"
		);

		expect(toastTitle).toBeInTheDocument();
		expect(toastDesc).toBeInTheDocument();
	});
});
