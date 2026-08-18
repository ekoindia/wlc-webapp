import { fetcher } from "helpers/apiHelper";
import {
	getAuthTokens,
	loginUsingAccessToken,
	setandUpdateAuthTokens,
} from "helpers/loginHelper";

jest.mock("helpers/apiHelper", () => ({
	fetcher: jest.fn(),
}));

const mockFetcher = fetcher as jest.Mock;

describe("setandUpdateAuthTokens", () => {
	beforeEach(() => sessionStorage.clear());

	it("stores every token it is given", () => {
		setandUpdateAuthTokens(
			{
				access_token: "acc",
				refresh_token: "ref",
				access_token_lite: "lite",
				access_token_crm: "crm",
			},
			false
		);

		expect(getAuthTokens()).toEqual({
			access_token: "acc",
			refresh_token: "ref",
			access_token_lite: "lite",
			access_token_crm: "crm",
		});
	});

	// Regression: setItem(key, undefined) stores the STRING "undefined", which
	// reads back as a truthy 9-char token and gets redeemed as if it were real.
	it("does not store the string 'undefined' for a missing token", () => {
		setandUpdateAuthTokens({ access_token: "acc" }, false);

		expect(sessionStorage.getItem("refresh_token")).toBeNull();
		expect(sessionStorage.getItem("access_token_lite")).toBeNull();
		expect(sessionStorage.getItem("access_token_crm")).toBeNull();
	});

	// Regression: an access-token-only login must not inherit the previous
	// session's refresh token from a reused tab.
	it("clears stale tokens left by a previous session", () => {
		setandUpdateAuthTokens(
			{ access_token: "old-acc", refresh_token: "old-ref" },
			false
		);
		setandUpdateAuthTokens({ access_token: "new-acc" }, false);

		expect(sessionStorage.getItem("access_token")).toBe("new-acc");
		expect(sessionStorage.getItem("refresh_token")).toBeNull();
	});
});

describe("loginUsingAccessToken", () => {
	const login = jest.fn();
	const logout = jest.fn();
	const updateUserInfo = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		sessionStorage.clear();
	});

	it("seeds the session without exchanging any token", async () => {
		mockFetcher.mockResolvedValue({
			details: { mobile: "9876543210" },
		});

		await loginUsingAccessToken(
			"acc-123",
			updateUserInfo,
			login,
			logout,
			false
		);

		// Exactly one call, and it is the profile endpoint - never /authentication/token,
		// which would rotate the caller's refresh token.
		expect(mockFetcher).toHaveBeenCalledTimes(1);
		expect(mockFetcher.mock.calls[0][0]).toContain(
			"/authentication/refresh-profile"
		);
		expect(mockFetcher.mock.calls[0][1].token).toBe("acc-123");
		expect(sessionStorage.getItem("access_token")).toBe("acc-123");
		expect(logout).not.toHaveBeenCalled();
	});

	// refresh-profile is a profile endpoint; it is not guaranteed to echo a token
	// back, and the LOGIN reducer refuses a payload without one.
	it("carries the access token into the login payload", async () => {
		mockFetcher.mockResolvedValue({ details: { mobile: "9876543210" } });

		await loginUsingAccessToken(
			"acc-123",
			updateUserInfo,
			login,
			logout,
			false
		);

		expect(login).toHaveBeenCalledWith(
			expect.objectContaining({
				access_token: "acc-123",
				details: { mobile: "9876543210" },
			})
		);
	});

	it("prefers a token returned by the profile response", async () => {
		mockFetcher.mockResolvedValue({
			access_token: "acc-fresh",
			details: { mobile: "9876543210" },
		});

		await loginUsingAccessToken(
			"acc-123",
			updateUserInfo,
			login,
			logout,
			false
		);

		expect(login).toHaveBeenCalledWith(
			expect.objectContaining({ access_token: "acc-fresh" })
		);
	});

	it("clears the half-written session when the profile fetch fails", async () => {
		mockFetcher.mockRejectedValue(new Error("401"));

		await loginUsingAccessToken(
			"bad-token",
			updateUserInfo,
			login,
			logout,
			false
		);

		expect(login).not.toHaveBeenCalled();
		expect(logout).toHaveBeenCalled();
	});
});
