import {
	NetworkUsersProvider,
	useNetworkUsers,
} from "contexts/NetworkUsersContext";
import { act, renderHook } from "test-utils";

// ─── Mocks ──────────────────────────────────────────────────────────────────

const mockFetchUsers = jest.fn();
const mockToast = jest.fn();

let capturedOnError: ((_err: any) => void) | null = null;
let capturedOnSuccess: ((_res: any) => void) | null = null;

jest.mock("hooks/useApiFetch", () => ({
	__esModule: true,
	default: (_endpoint: string, settings: Record<string, any>) => {
		capturedOnError = settings?.onError;
		capturedOnSuccess = settings?.onSuccess;
		return [mockFetchUsers, false, jest.fn()];
	},
	useEpsV3Fetch: () => [jest.fn(), false, jest.fn()],
}));

jest.mock("hooks/useDailyCacheState", () => ({
	__esModule: true,
	default: (_key: string, initial: any) => [
		{ ...initial, networkUsersList: [] },
		jest.fn(),
		false,
	],
}));

jest.mock("hooks/useUserTypes", () => ({
	__esModule: true,
	default: () => ({ userTypeLabels: {} }),
}));

jest.mock("contexts/UserContext", () => ({
	__esModule: true,
	useUser: () => ({
		isLoggedIn: true,
		isAdmin: false,
		isOnboarding: false,
		accessToken: "test-token",
		userId: "user-1",
		userData: { userDetails: { code: "user-1" } },
	}),
}));

jest.mock("libs", () => ({
	__esModule: true,
	useCopilotInfo: () => "mock-id",
}));

jest.mock("@chakra-ui/react", () => ({
	...jest.requireActual("@chakra-ui/react"),
	useToast: () => mockToast,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const wrapper = ({ children }: { children: React.ReactNode }) => (
	<NetworkUsersProvider>{children}</NetworkUsersProvider>
);

const fireError = () =>
	act(() => {
		capturedOnError?.({
			errorObject: new Error("Network error"),
			request: {},
		});
	});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("NetworkUsersContext — fetch failure limiting", () => {
	beforeEach(() => {
		jest.useFakeTimers();
		mockFetchUsers.mockClear();
		mockToast.mockClear();
		capturedOnError = null;
		capturedOnSuccess = null;
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	it("renders without errors", () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });
		expect(result.current).toBeDefined();
	});

	it("fetchBlocked is false initially", () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });
		expect(result.current.fetchBlocked).toBe(false);
	});

	it("does not block after fewer than 5 failures", async () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });

		for (let i = 0; i < 4; i++) {
			await fireError();
		}

		expect(result.current.fetchBlocked).toBe(false);
		expect(mockToast).not.toHaveBeenCalled();
	});

	it("sets fetchBlocked and fires toast after 5th failure", async () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });

		for (let i = 0; i < 5; i++) {
			await fireError();
		}

		expect(result.current.fetchBlocked).toBe(true);
		expect(mockToast).toHaveBeenCalledTimes(1);
		expect(mockToast).toHaveBeenCalledWith(
			expect.objectContaining({ status: "error" })
		);
	});

	it("refreshUserList is a no-op while fetchBlocked is true", async () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });

		for (let i = 0; i < 5; i++) {
			await fireError();
		}

		mockFetchUsers.mockClear();

		act(() => {
			result.current.refreshUserList(true);
		});

		expect(mockFetchUsers).not.toHaveBeenCalled();
	});

	it("does not start a second cooldown timer on subsequent blocked calls", async () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });

		for (let i = 0; i < 6; i++) {
			await fireError();
		}

		// Still blocked after a 6th failure
		expect(result.current.fetchBlocked).toBe(true);
		// Toast should still only have been called once (on the 5th failure)
		expect(mockToast).toHaveBeenCalledTimes(1);
	});

	it("auto-resets fetchBlocked and failure count after 5-minute cooldown", async () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });

		for (let i = 0; i < 5; i++) {
			await fireError();
		}

		expect(result.current.fetchBlocked).toBe(true);

		// Advance time past the 5-minute cooldown
		act(() => {
			jest.advanceTimersByTime(5 * 60 * 1000 + 100);
		});

		expect(result.current.fetchBlocked).toBe(false);
	});

	it("resets fetchBlocked on a successful fetch after being unblocked", async () => {
		const { result } = renderHook(() => useNetworkUsers(), { wrapper });

		for (let i = 0; i < 5; i++) {
			await fireError();
		}

		expect(result.current.fetchBlocked).toBe(true);

		act(() => {
			capturedOnSuccess?.({ data: { csp_list: [] } });
		});

		expect(result.current.fetchBlocked).toBe(false);
	});
});
