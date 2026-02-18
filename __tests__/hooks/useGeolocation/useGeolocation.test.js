import { useGeolocation } from "hooks";
import { act, renderHook, waitFor } from "test-utils";

// Mock navigator.geolocation
const mockGeolocation = {
	getCurrentPosition: jest.fn(),
	watchPosition: jest.fn(),
	clearWatch: jest.fn(),
};

// Mock navigator.permissions
const mockPermissions = {
	query: jest.fn(),
};

describe("useGeolocation", () => {
	beforeAll(() => {
		Object.defineProperty(global, "navigator", {
			value: {
				geolocation: mockGeolocation,
				permissions: mockPermissions,
				userAgent: "jest",
			},
			configurable: true,
			writable: true,
		});
	});

	beforeEach(() => {
		jest.clearAllMocks();
		mockPermissions.query.mockResolvedValue({
			state: "prompt",
			onchange: null,
		});
	});

	test("should initialize with default states", () => {
		const { result } = renderHook(() => useGeolocation());

		expect(result.current.latitude).toBeNull();
		expect(result.current.longitude).toBeNull();
		expect(result.current.error).toBeNull();
		expect(result.current.isLoading).toBe(false);
		expect(result.current.permissionState).toBe("prompt");
	});

	test("should request location manually", async () => {
		mockGeolocation.getCurrentPosition.mockImplementation((success) => {
			success({
				coords: {
					latitude: 27.01234,
					longitude: 38.01234,
					accuracy: 5,
				},
				timestamp: 1234567890,
			});
		});

		const { result } = renderHook(() => useGeolocation());

		await act(async () => {
			result.current.requestLocation();
		});

		expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
		expect(result.current.latitude).toBe(27.01234);
		expect(result.current.longitude).toBe(38.01234);
		expect(result.current.accuracy).toBe(5);
		expect(result.current.timestamp).toBe(1234567890);
	});

	test("should auto-request location when autoRequest is true", async () => {
		mockGeolocation.getCurrentPosition.mockImplementation((success) => {
			success({
				coords: {
					latitude: 10.0,
					longitude: 20.0,
					accuracy: 10,
				},
				timestamp: 1234567890,
			});
		});

		const { result } = renderHook(() =>
			useGeolocation({ autoRequest: true })
		);

		expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
		expect(result.current.latitude).toBe(10.0);
		expect(result.current.longitude).toBe(20.0);
	});

	test("should handle geolocation errors", async () => {
		mockGeolocation.getCurrentPosition.mockImplementation(
			(success, error) => {
				error({
					code: 1,
					message: "User denied Geolocation",
				});
			}
		);

		const { result } = renderHook(() => useGeolocation());

		await act(async () => {
			result.current.requestLocation();
		});

		expect(result.current.error).toBe("User denied Geolocation");
		expect(result.current.isLoading).toBe(false);
	});

	test("should watch position and update location", async () => {
		const watchId = 123;
		mockGeolocation.watchPosition.mockReturnValue(watchId);
		mockGeolocation.watchPosition.mockImplementation(
			(success, _error, _options) => {
				// Simulate first update
				success({
					coords: {
						latitude: 10,
						longitude: 10,
						accuracy: 10,
					},
					timestamp: 1000,
				});
				return watchId;
			}
		);

		const { result } = renderHook(() =>
			useGeolocation({ watchPosition: true })
		);

		await act(async () => {
			result.current.requestLocation();
		});

		expect(mockGeolocation.watchPosition).toHaveBeenCalled();
		expect(result.current.latitude).toBe(10);
		expect(result.current.longitude).toBe(10);

		// Stop watching
		act(() => {
			result.current.stopWatching();
		});
		expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId);
	});

	test("should stop watching after maxWatchUpdates", async () => {
		const watchId = 456;
		mockGeolocation.watchPosition.mockReturnValue(watchId);
		mockGeolocation.watchPosition.mockImplementation((success) => {
			// Simulate 3 updates
			success({
				coords: { latitude: 1, longitude: 1, accuracy: 1 },
				timestamp: 1,
			});
			// This is a simplified mock; real watchPosition calls success multiple times.
			// But since our mock is a function call, we can't easily simulate "interval" calls here
			// without using jest.useFakeTimers or manual trigger.
			// For now, let's just checking if it calls clearWatch is tricky if the hook logic relies on *subsequent* calls.
			// The hook tracks `updateCountRef`.
			// Let's manually trigger success callback if we can capture it.
			return watchId;
		});

		// Better strategy: Capture the success callback and call it manually.
		let successCallback;
		mockGeolocation.watchPosition.mockImplementation((cb) => {
			successCallback = cb;
			return watchId;
		});

		const { result } = renderHook(() =>
			useGeolocation({
				watchPosition: true,
				maxWatchUpdates: 2,
				autoRequest: true,
			})
		);

		// Wait for requestLocation to be called
		await waitFor(() =>
			expect(mockGeolocation.watchPosition).toHaveBeenCalled()
		);

		// 1st update
		act(() => {
			successCallback({
				coords: { latitude: 1, longitude: 1, accuracy: 1 },
				timestamp: 1,
			});
		});
		expect(result.current.latitude).toBe(1);

		// 2nd update
		act(() => {
			successCallback({
				coords: { latitude: 2, longitude: 2, accuracy: 1 },
				timestamp: 2,
			});
		});
		expect(result.current.latitude).toBe(2);

		// Should have stopped watching
		expect(mockGeolocation.clearWatch).toHaveBeenCalledWith(watchId);
	});

	test("should update permission state on change", async () => {
		let changeCallback;
		const mockStatus = {
			state: "prompt",
			onchange: null,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};
		// Use Object.defineProperty to intercept the setting of onchange
		Object.defineProperty(mockStatus, "onchange", {
			set: (cb) => {
				changeCallback = cb;
			},
			get: () => changeCallback,
		});

		mockPermissions.query.mockResolvedValue(mockStatus);

		const { result } = renderHook(() => useGeolocation());

		await waitFor(() => {
			expect(result.current.permissionState).toBe("prompt");
		});

		// Simulate permission change
		act(() => {
			if (changeCallback) {
				mockStatus.state = "granted";
				changeCallback();
			}
		});

		await waitFor(() => {
			expect(result.current.permissionState).toBe("granted");
		});
	});
});
