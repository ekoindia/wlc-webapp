import { renderHook, waitFor } from "@testing-library/react";
import {
	loginUsingAccessToken,
	loginUsingRefreshToken,
} from "helpers/loginHelper";
import { useAutoLoginFromUrlToken } from "page-components/LandingPanel/useAutoLoginFromUrlToken";

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
	loginUsingAccessToken: jest.fn().mockResolvedValue(undefined),
	loginUsingRefreshToken: jest.fn().mockResolvedValue(undefined),
}));

/**
 * Point jsdom's address bar at `url` before rendering the hook.
 * @param url
 */
const setUrl = (url: string) => window.history.replaceState({}, "", url);

describe("useAutoLoginFromUrlToken", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		isLoggedIn = false;
		setUrl("/");
	});

	it("does nothing when there is no credential param", () => {
		const { result } = renderHook(() => useAutoLoginFromUrlToken());

		expect(result.current).toBe(false);
		expect(replace).not.toHaveBeenCalled();
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
		expect(loginUsingRefreshToken).not.toHaveBeenCalled();
	});

	it("seeds the session directly from an access_token", async () => {
		setUrl("/?access_token=acc-123");

		const { result } = renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() => expect(replace).toHaveBeenCalled());
		expect(replace).toHaveBeenCalledWith("/", undefined, { shallow: true });

		await waitFor(() =>
			expect(loginUsingAccessToken).toHaveBeenCalledWith(
				"acc-123",
				updateUserInfo,
				login,
				logout,
				false
			)
		);
		// No token exchange: the caller's refresh token must not be rotated
		expect(loginUsingRefreshToken).not.toHaveBeenCalled();
		await waitFor(() => expect(result.current).toBe(false));
	});

	it("falls back to the refresh_token when no access_token is given", async () => {
		setUrl("/?refresh_token=ref-123");

		renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() =>
			expect(loginUsingRefreshToken).toHaveBeenCalledWith(
				"ref-123",
				updateUserInfo,
				login,
				logout,
				false
			)
		);
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
	});

	it("prefers access_token and strips both when given both", async () => {
		setUrl("/?access_token=acc-123&refresh_token=ref-123&next=%2Fhistory");

		renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith(
				"/?next=%2Fhistory",
				undefined,
				{ shallow: true }
			)
		);
		expect(loginUsingAccessToken).toHaveBeenCalled();
		expect(loginUsingRefreshToken).not.toHaveBeenCalled();
	});

	it("keeps the other query params so RouteProtecter can still redirect", async () => {
		setUrl("/?access_token=acc-123&next=%2Fhistory&role=1");

		renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith(
				"/?next=%2Fhistory&role=1",
				undefined,
				{ shallow: true }
			)
		);
	});

	it("preserves the URL fragment while stripping the credential", async () => {
		setUrl("/?access_token=acc-123#section");

		renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith("/#section", undefined, {
				shallow: true,
			})
		);
	});

	it("strips an empty credential param without attempting a login", async () => {
		setUrl("/?access_token=&next=%2Fhistory");

		renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith(
				"/?next=%2Fhistory",
				undefined,
				{ shallow: true }
			)
		);
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
		expect(loginUsingRefreshToken).not.toHaveBeenCalled();
	});

	it("only strips the param when the user is already logged in", async () => {
		isLoggedIn = true;
		setUrl("/?access_token=acc-123");

		renderHook(() => useAutoLoginFromUrlToken());

		await waitFor(() =>
			expect(replace).toHaveBeenCalledWith("/", undefined, {
				shallow: true,
			})
		);
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
	});

	it("logs in only once across re-renders", async () => {
		setUrl("/?access_token=acc-123");

		const { rerender } = renderHook(() => useAutoLoginFromUrlToken());
		rerender();
		rerender();

		await waitFor(() =>
			expect(loginUsingAccessToken).toHaveBeenCalledTimes(1)
		);
	});
});
