import { act, renderHook, waitFor } from "@testing-library/react";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import useBankList from "hooks/useBankList";

// Mock dependencies
jest.mock("contexts", () => ({
	useSession: jest.fn(),
}));

jest.mock("helpers", () => ({
	fetcher: jest.fn(),
}));

jest.mock("hooks", () => ({
	useRefreshToken: jest.fn(),
}));

// Mock Chakra UI toast
const mockToast = jest.fn();
jest.mock("@chakra-ui/react", () => ({
	useToast: () => mockToast,
}));

describe("useBankList hook", () => {
	const mockAccessToken = "mock-access-token";
	const mockGenerateNewToken = jest.fn();
	const mockFetcher = fetcher;
	const mockUseSession = useSession;
	const mockUseRefreshToken = require("hooks").useRefreshToken;

	const mockBankListResponse = {
		status: 0,
		param_attributes: {
			list_elements: [
				{ label: "State Bank of India", value: "SBI001" },
				{ label: "HDFC Bank", value: "HDFC001" },
				{ label: "ICICI Bank", value: "ICICI001" },
			],
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseSession.mockReturnValue({
			accessToken: mockAccessToken,
		});
		mockUseRefreshToken.mockReturnValue({
			generateNewToken: mockGenerateNewToken,
		});
	});

	it("should initialize with correct default values", () => {
		const { result } = renderHook(() => useBankList());

		expect(result.current.banks).toEqual([]);
		expect(result.current.isLoading).toBe(true);
		expect(result.current.error).toBeNull();
		expect(typeof result.current.refetch).toBe("function");
	});

	it("should fetch bank list successfully", async () => {
		mockFetcher.mockResolvedValueOnce(mockBankListResponse);

		const { result } = renderHook(() => useBankList());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.banks).toEqual(
			mockBankListResponse.param_attributes.list_elements
		);
		expect(result.current.error).toBeNull();
		expect(mockFetcher).toHaveBeenCalledWith(
			expect.stringContaining("/transactions/do"),
			{
				token: mockAccessToken,
				body: {
					interaction_type_id: 155,
					bank_id: "",
					locale: "en",
				},
			},
			mockGenerateNewToken
		);
	});

	it("should handle API error response", async () => {
		const errorResponse = {
			status: 1,
			message: "Failed to fetch banks",
		};
		mockFetcher.mockResolvedValueOnce(errorResponse);

		const { result } = renderHook(() => useBankList());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.banks).toEqual([]);
		expect(result.current.error).toBe("Failed to fetch banks");
		expect(mockToast).toHaveBeenCalledWith({
			title: "Error fetching bank list",
			description: "Failed to fetch banks",
			status: "error",
			duration: 3000,
			isClosable: true,
		});
	});

	it("should handle network error", async () => {
		const networkError = new Error("Network error");
		mockFetcher.mockRejectedValueOnce(networkError);

		const { result } = renderHook(() => useBankList());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.banks).toEqual([]);
		expect(result.current.error).toBe("Network error");
		expect(mockToast).toHaveBeenCalledWith({
			title: "Error fetching bank list",
			description: "Network error",
			status: "error",
			duration: 3000,
			isClosable: true,
		});
	});

	it("should not fetch when accessToken is not available", () => {
		mockUseSession.mockReturnValue({
			accessToken: null,
		});

		const { result } = renderHook(() => useBankList());

		expect(result.current.isLoading).toBe(false);
		expect(mockFetcher).not.toHaveBeenCalled();
	});

	it("should refetch bank list when refetch is called", async () => {
		mockFetcher.mockResolvedValueOnce(mockBankListResponse);

		const { result } = renderHook(() => useBankList());

		// Wait for initial fetch
		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		// Clear previous calls
		mockFetcher.mockClear();
		mockFetcher.mockResolvedValueOnce(mockBankListResponse);

		// Call refetch
		await act(async () => {
			await result.current.refetch();
		});

		expect(mockFetcher).toHaveBeenCalledTimes(1);
	});

	it("should handle empty bank list response", async () => {
		const emptyResponse = {
			status: 0,
			param_attributes: {},
		};
		mockFetcher.mockResolvedValueOnce(emptyResponse);

		const { result } = renderHook(() => useBankList());

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.banks).toEqual([]);
		expect(result.current.error).toBeNull();
	});
});
