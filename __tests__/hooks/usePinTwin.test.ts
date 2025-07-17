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
	beforeEach(() => {
		mockedFetcher.mockClear();
		mockSessionStorage.clear();
		mockSessionStorage.getItem.mockReturnValue("test-token");
		jest.clearAllTimers();
	});

	it("should return initial state with loading true", () => {
		const { result } = renderHook(() => usePinTwin());

		expect(result.current).toBeDefined();
		expect(result.current.pintwinKey).toEqual([]);
		expect(result.current.loading).toBe(true);
		expect(result.current.keyLoaded).toBe(false);
		expect(result.current.keyLoadError).toBe(false);
		expect(result.current.retryCount).toBe(0);
		expect(result.current.keyId).toBe("");
	});

	it("should return empty string for encoding if key is not loaded", () => {
		const { result } = renderHook(() => usePinTwin());

		expect(result.current).toBeDefined();
		const encodedPin = result.current.encodePinTwin("1234");
		expect(encodedPin).toBe("");
	});

	it("should encode pin correctly when key is loaded via mock data", async () => {
		jest.useFakeTimers();
		const { result } = renderHook(() => usePinTwin({ useMockData: true }));
		expect(result.current).toBeDefined();
		await act(async () => {
			jest.runAllTimers();
		});
		expect(result.current.loading).toBe(false);
		expect(result.current.keyLoaded).toBe(true);
		expect(result.current.pintwinKey).toEqual("1974856302".split(""));
		expect(result.current.keyId).toBe("39");
		const encodedPin = result.current.encodePinTwin("1234");
		expect(encodedPin).toBe("8765|39");
		jest.useRealTimers();
	});

	it("should encode pin without key ID when pin is empty", async () => {
		jest.useFakeTimers();
		const { result } = renderHook(() => usePinTwin({ useMockData: true }));
		expect(result.current).toBeDefined();
		await act(async () => {
			jest.runAllTimers();
		});
		const encodedPin = result.current.encodePinTwin("");
		expect(encodedPin).toBe("");
		jest.useRealTimers();
	});

	it("should reload key manually with reloadKey", async () => {
		jest.useFakeTimers();
		const { result } = renderHook(() => usePinTwin());
		expect(result.current).toBeDefined();
		const mockResponse = {
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
		mockedFetcher.mockResolvedValue(mockResponse);
		await act(async () => {
			await result.current.reloadKey();
			jest.runAllTimers();
		});
		expect(result.current.keyLoaded).toBe(true);
		expect(result.current.pintwinKey).toEqual("0123456789".split(""));
		expect(result.current.keyId).toBe("55");
		jest.useRealTimers();
	});
});
