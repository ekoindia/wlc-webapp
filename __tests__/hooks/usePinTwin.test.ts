import { useToast } from "@chakra-ui/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { fetcher } from "helpers/apiHelper";
import { usePinTwin } from "hooks/usePinTwin";

jest.mock("helpers/apiHelper");
jest.mock("@chakra-ui/react", () => ({
	useToast: jest.fn(() => jest.fn()),
}));

const mockedFetcher = fetcher as jest.Mock;
const mockedUseToast = useToast as jest.Mock;

describe("usePinTwin", () => {
	beforeEach(() => {
		mockedFetcher.mockClear();
		mockedUseToast.mockClear();
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
		expect(mockedUseToast().mock.calls[0][0].status).toBe("success");
	});

	it("should handle fetch error and retry", async () => {
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		const { result, waitForNextUpdate } = renderHook(() =>
			usePinTwin({ autoLoad: true, retryDelay: 10 })
		);

		expect(result.current.loading).toBe(true);

		await waitForNextUpdate();

		expect(result.current.loading).toBe(false);
		expect(result.current.keyLoadError).toBe(true);
		expect(result.current.retryCount).toBe(1);
		expect(mockedUseToast().mock.calls[0][0].status).toBe("warning");

		// Should retry
		await waitForNextUpdate();
		expect(result.current.retryCount).toBe(2);
	});

	it("should stop retrying after max retries", async () => {
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		const { result, waitFor } = renderHook(() =>
			usePinTwin({ autoLoad: true, maxRetries: 2, retryDelay: 10 })
		);

		await waitFor(
			() => {
				expect(result.current.retryCount).toBe(2);
			},
			{ timeout: 500 }
		);

		await waitFor(
			() => {
				expect(mockedUseToast().mock.calls.length).toBe(3); // 2 retries + 1 final error
			},
			{ timeout: 500 }
		);

		expect(mockedUseToast().mock.calls[2][0].title).toContain(
			"Failed to load PinTwin key after multiple attempts"
		);
		expect(mockedUseToast().mock.calls[2][0].status).toBe("error");
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

		expect(encodedPin).toBe("8765");
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

	it("should cleanup timeouts on unmount", () => {
		const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");
		mockedFetcher.mockRejectedValue(new Error("API Error"));

		const { unmount, waitForNextUpdate } = renderHook(() =>
			usePinTwin({ retryDelay: 100 })
		);

		waitForNextUpdate().then(() => {
			unmount();
			expect(clearTimeoutSpy).toHaveBeenCalled();
		});
	});
});
