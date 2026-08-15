import { renderHook, waitFor } from "@testing-library/react";
import { loginUsingRefreshToken } from "helpers/loginHelper";
import { useAutoLoginFromRefreshToken } from "page-components/LandingPanel/useAutoLoginFromRefreshToken";

const replace = jest.fn().mockResolvedValue(true);
const login = jest.fn();
const logout = jest.fn();
const updateUserInfo = jest.fn();
let isLoggedIn = false;

jest.mock("next/router", () => ({
	useRouter: () => ({ replace }),
}));

jest.mock("contexts", () => ({
	useUser: () => ({
		isLoggedIn,
		login,
		logout,
		updateUserInfo,
	}),
	useAppSource: () => ({ isAndroid: false }),
}));

jest.mock("helpers/loginHelper", () => ({
	loginUsingRefreshToken: jest.fn().mockResolvedValue(undefined),
}));

/**
 * Point jsdom's address bar at `url` before rendering the hook.
 * @param url
 */
const setUrl = (url: string) => window.history.replaceState({}, "", url);

describe("useAutoLoginFromRefreshToken", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		isLoggedIn = false;
		setUrl("/");
	});

	it("does nothing when there is no refresh_token param", () => {
		const { result } = renderHook(() => useAutoLoginFromRefreshToken());

		expect(result.current).toBe(false);
		expect(replace).not.toHaveBeenCalled();
		expect(loginUsingRefreshToken).not.toHaveBeenCalled();
	});

	it("strips the token from the URL and exchanges it for a session", async () => {
		setUrl("/?refresh_token=tok-123");

		const { result } = renderHook(() => useAutoLoginFromRefreshToken());

		// Loader is shown while the exchange is in flight
		await waitFor(() => expect(replace).toHaveBeenCalled());
		expect(replace).toHaveBeenCalledWith("/", undefined, { shallow: true });

		await waitFor(() =>
			expect(loginUsingRefreshToken).toHaveBeenCalledWith(
				"tok-123",
				updateUserInfo,
				login,
				logout,
				false
			)
		);
		await waitFor(() => expect(result.current).toBe(false));
	});

	it("keeps the other query params so RouteProtecter can still redirect", async () => {
		setUrl("/?refresh_token=tok-123&next=%2Fhistory&role=1");

		renderHook(() => useAutoLoginFromRefreshToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith(
				"/?next=%2Fhistory&role=1",
				undefined,
				{ shallow: true }
			)
		);
	});

	it("only strips the param when the user is already logged in", async () => {
		isLoggedIn = true;
		setUrl("/?refresh_token=tok-123");

		renderHook(() => useAutoLoginFromRefreshToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith("/", undefined, {
				shallow: true,
			})
		);
		expect(loginUsingRefreshToken).not.toHaveBeenCalled();
	});

	it("exchanges the token only once across re-renders", async () => {
		setUrl("/?refresh_token=tok-123");

		const { rerender } = renderHook(() => useAutoLoginFromRefreshToken());
		rerender();
		rerender();

		await waitFor(() =>
			expect(loginUsingRefreshToken).toHaveBeenCalledTimes(1)
		);
	});
});
