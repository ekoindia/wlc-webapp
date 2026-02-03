import { act, renderHook } from "@testing-library/react";
import { fetcher } from "helpers/apiHelper";
import { usePinTwin } from "hooks/usePinTwin";

jest.mock("helpers/apiHelper");

const mockedFetcher = fetcher as jest.Mock;

// Mock sessionStorage
const mockSessionStorage = {
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	clear: jest.fn(),
};

Object.defineProperty(window, "sessionStorage", {
	value: mockSessionStorage,
	writable: true,
});

describe("usePinTwin", () => {
	const mockResponse = {
		response_status_id: 0,
		data: {
			customer_id_type: "mobile_number",
			key_id: 39,
			pintwin_key: "1974856302",
			id_type: "mobile_number",
			customer_id: "9002333333",
		},
		response_type_id: 2,
		message: "Success!",
		status: 0,
	};

	const mockResponseDifferentKey = {
		response_status_id: 0,
		data: {
			customer_id_type: "mobile_number",
			key_id: 55,
			pintwin_key: "0123456789",
			id_type: "mobile_number",
			customer_id: "9002333333",
		},
		response_type_id: 2,
		message: "Success!",
		status: 0,
	};

	beforeEach(() => {
		mockedFetcher.mockClear();
		mockedFetcher.mockReset();
		mockSessionStorage.clear();
		mockSessionStorage.getItem.mockReturnValue("test-token");
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
		jest.clearAllTimers();
	});

	it("should return initial state with loading status", () => {
		const { result } = renderHook(() => usePinTwin());

		expect(result.current).toBeDefined();
		expect(result.current.pinTwinKeyLoadStatus).toBe("loading");
		expect(typeof result.current.refreshPinTwinKey).toBe("function");
		expect(typeof result.current.encodePinTwin).toBe("function");
	});

	it("should return empty string for encoding if key is not loaded", () => {
		const { result } = renderHook(() => usePinTwin());

		expect(result.current).toBeDefined();
		const encodedPin = result.current.encodePinTwin("1234");
		expect(encodedPin).toBe("");
	});

	it("should encode pin correctly when key is loaded", async () => {
		jest.useFakeTimers();

		mockedFetcher.mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePinTwin());
		expect(result.current).toBeDefined();

		await act(async () => {
			jest.runAllTimers();
		});
		expect(result.current.pinTwinKeyLoadStatus).toBe("loaded");
		const encodedPin = result.current.encodePinTwin("1234");
		expect(encodedPin).toBe("9748|39");
		jest.useRealTimers();
	});

	it("should encode pin without key ID when pin is empty", async () => {
		jest.useFakeTimers();

		mockedFetcher.mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePinTwin());
		expect(result.current).toBeDefined();

		await act(async () => {
			jest.runAllTimers();
		});
		const encodedPin = result.current.encodePinTwin("");
		expect(encodedPin).toBe("");
		jest.useRealTimers();
	});

	it("should reload key manually with refreshPinTwinKey", async () => {
		jest.useFakeTimers();
		const { result } = renderHook(() => usePinTwin());
		expect(result.current).toBeDefined();
		mockedFetcher.mockResolvedValue(mockResponseDifferentKey);
		await act(async () => {
			await result.current.refreshPinTwinKey();
			jest.runAllTimers();
		});
		expect(result.current.pinTwinKeyLoadStatus).toBe("loaded");
		const encodedPin = result.current.encodePinTwin("0123");
		expect(encodedPin).toBe("0123|55");
		jest.useRealTimers();
	});

	it("should handle API error and set error status when manually refreshing", async () => {
		// Start with a successful mock to let the hook initialize properly
		mockedFetcher.mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePinTwin());
		expect(result.current).toBeDefined();

		// Wait for initial load to complete
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 100));
		});
		expect(result.current.pinTwinKeyLoadStatus).toBe("loaded");

		// Now mock an error and trigger manual refresh
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		// Suppress console.error for this test since we expect error logs
		const originalError = console.error;
		console.error = jest.fn();

		await act(async () => {
			await result.current.refreshPinTwinKey();
			// Wait for all retries to complete (8 retries with 1000ms delays)
			await new Promise((resolve) => setTimeout(resolve, 9000));
		});

		// Restore console.error
		console.error = originalError;

		expect(result.current.pinTwinKeyLoadStatus).toBe("error");
	}, 15000); // Increase timeout for this test

	it("should validate PIN correctly when key is loaded", async () => {
		jest.useFakeTimers();

		mockedFetcher.mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePinTwin());
		expect(result.current).toBeDefined();

		await act(async () => {
			jest.runAllTimers();
		});
		expect(result.current.pinTwinKeyLoadStatus).toBe("loaded");

		// Test valid PIN
		const validResult = result.current.validatePin("1234");
		expect(validResult.isValid).toBe(true);
		expect(validResult.error).toBeNull();

		// Test PIN too short
		const shortResult = result.current.validatePin("12");
		expect(shortResult.isValid).toBe(false);
		expect(shortResult.error).toBe("PIN must be 4 digits");

		// Test empty PIN
		const emptyResult = result.current.validatePin("");
		expect(emptyResult.isValid).toBe(false);
		expect(emptyResult.error).toBe("Enter a 4-digit PIN");

		// Test custom length validation
		const customLengthResult = result.current.validatePin("12", 6);
		expect(customLengthResult.isValid).toBe(false);
		expect(customLengthResult.error).toBe("PIN must be 6 digits");

		jest.useRealTimers();
	});

	it("should return error when validating PIN before key is loaded", () => {
		const { result } = renderHook(() => usePinTwin());

		// Key is still loading
		expect(result.current.pinTwinKeyLoadStatus).toBe("loading");

		const validationResult = result.current.validatePin("1234");
		expect(validationResult.isValid).toBe(false);
		expect(validationResult.error).toBe("Security key not loaded");
	});
});
