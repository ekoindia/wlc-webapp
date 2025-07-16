import { useToast } from "@chakra-ui/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { fetcher } from "helpers/apiHelper";
import { usePinTwin } from "hooks/usePinTwin";

jest.mock("helpers/apiHelper");
jest.mock("@chakra-ui/react", () => ({
	useToast: jest.fn(),
}));

const mockedFetcher = fetcher as jest.Mock;
const mockedUseToast = useToast as jest.Mock;

describe("usePinTwin", () => {
	const mockToast = jest.fn();

	beforeEach(() => {
		mockedFetcher.mockClear();
		mockedUseToast.mockClear();
		mockToast.mockClear();
		mockedUseToast.mockReturnValue(mockToast);
		sessionStorage.clear();
	});

	it("should return initial state", () => {
		const { result } = renderHook(() => usePinTwin({ autoLoad: false }));

		expect(result.current.pintwinKey).toEqual([]);
		expect(result.current.loading).toBe(false);
		expect(result.current.keyLoaded).toBe(false);
		expect(result.current.keyLoadError).toBe(false);
		expect(result.current.retryCount).toBe(0);
		expect(result.current.keyId).toBe("");
	});

	it("should fetch and load pintwin key successfully on autoLoad", async () => {
		const mockResponse = {
			data: {
				pintwin_key: "1234567890",
				key_id: "test-key-id",
			},
		};
		mockedFetcher.mockResolvedValue(mockResponse);

		const { result, waitForNextUpdate } = renderHook(() =>
			usePinTwin({ autoLoad: true })
		);

		expect(result.current.loading).toBe(true);

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.keyLoaded).toBe(true);
		expect(result.current.pintwinKey).toEqual("1234567890".split(""));
		expect(result.current.keyId).toBe("test-key-id");
		expect(mockToast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "PinTwin key loaded successfully",
				status: "success",
				duration: 2000,
			})
		);
	});

	it("should handle fetch error and retry", async () => {
		jest.useFakeTimers();
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		const { result, waitForNextUpdate } = renderHook(() =>
			usePinTwin({ autoLoad: true, retryDelay: 10, maxRetries: 1 })
		);

		expect(result.current.loading).toBe(true);

		await waitForNextUpdate();

		// Fast-forward timers to trigger retry
		act(() => {
			jest.runAllTimers();
		});

		// Wait for state update after retry
		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.keyLoadError).toBe(true);
		expect(result.current.retryCount).toBe(1);
		expect(mockToast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: expect.stringContaining(
					"Failed to load key. Retrying..."
				),
				status: "warning",
				duration: 3000,
			})
		);
		jest.useRealTimers();
	});

	it("should stop retrying after max retries", async () => {
		jest.useFakeTimers();
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		const { result, waitForNextUpdate } = renderHook(() =>
			usePinTwin({ autoLoad: true, maxRetries: 1, retryDelay: 10 })
		);

		await waitForNextUpdate(); // first attempt
		act(() => {
			jest.runAllTimers();
		});
		await waitForNextUpdate(); // after retry

		expect(result.current.retryCount).toBe(1);
		expect(mockToast).toHaveBeenCalledWith(
			expect.objectContaining({
				title: "Failed to load PinTwin key after multiple attempts",
				status: "error",
				duration: 5000,
			})
		);
		jest.useRealTimers();
	});

	it("should encode pin correctly", async () => {
		const mockResponse = {
			data: {
				pintwin_key: "9876543210",
				key_id: "encode-test",
			},
		};
		mockedFetcher.mockResolvedValue(mockResponse);

		const { result, waitForNextUpdate } = renderHook(() => usePinTwin());

		await waitForNextUpdate();

		let encodedPin = "";
		act(() => {
			encodedPin = result.current.encodePinTwin("1234");
		});

		expect(encodedPin).toBe("8765|encode-test");
	});

	it("should return empty string for encoding if key is not loaded", () => {
		const { result } = renderHook(() => usePinTwin({ autoLoad: false }));

		let encodedPin = "";
		act(() => {
			encodedPin = result.current.encodePinTwin("1234");
		});

		expect(encodedPin).toBe("");
	});

	it("should reload key manually with reloadKey", async () => {
		const { result } = renderHook(() => usePinTwin({ autoLoad: false }));

		const mockResponse = {
			data: {
				pintwin_key: "0123456789",
				key_id: "manual-reload",
			},
		};
		mockedFetcher.mockResolvedValue(mockResponse);

		await act(async () => {
			await result.current.reloadKey();
		});

		expect(result.current.keyLoaded).toBe(true);
		expect(result.current.pintwinKey).toEqual("0123456789".split(""));
		expect(result.current.keyId).toBe("manual-reload");
	});

	it("should cleanup timeouts on unmount", async () => {
		jest.useFakeTimers();
		const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		const { waitForNextUpdate, unmount } = renderHook(() =>
			usePinTwin({ retryDelay: 100, maxRetries: 1 })
		);

		await waitForNextUpdate(); // let the first error/retry schedule
		act(() => {
			jest.runOnlyPendingTimers(); // schedule the retry timeout
		});
		unmount();
		expect(clearTimeoutSpy).toHaveBeenCalled();
		jest.useRealTimers();
	});
});
