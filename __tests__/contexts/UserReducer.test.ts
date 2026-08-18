import { UserReducer, defaultUserState } from "contexts/UserReducer";
import { setUserDetails, setandUpdateAuthTokens } from "helpers/loginHelper";

jest.mock("helpers/loginHelper", () => ({
	...jest.requireActual("helpers/loginHelper"),
	setandUpdateAuthTokens: jest.fn(),
	setUserDetails: jest.fn(),
	revokeSession: jest.fn(),
	clearAuthTokens: jest.fn(),
}));

const baseState = {
	loggedIn: true,
	userId: "9876543210",
	access_token: "acc-123",
	userDetails: { mobile: "9876543210" },
	shopDetails: { shop_name: "Old Shop" },
	personalDetails: { name: "Old Name" },
	accountDetails: {},
};

describe("UserReducer", () => {
	beforeEach(() => jest.clearAllMocks());

	// Regression: the switch had no trailing `return`, so every `break` path
	// returned undefined and React replaced the session state with it.
	it("never returns undefined for an action that falls through", () => {
		const next = UserReducer(baseState, {
			type: "UPDATE_USER_STORE",
			payload: { no_tokens_here: true },
			meta: {},
		});

		expect(next).toBe(baseState);
	});

	it("updates shop details immutably", () => {
		const next = UserReducer(baseState, {
			type: "UPDATE_SHOP_DETAILS",
			payload: { shop_name: "New Shop" },
			meta: {},
		});

		expect(next).not.toBe(baseState); // new reference, so consumers re-render
		expect(next.shopDetails).toEqual({ shop_name: "New Shop" });
		expect(baseState.shopDetails).toEqual({ shop_name: "Old Shop" }); // not mutated
	});

	it("updates personal details immutably", () => {
		const next = UserReducer(baseState, {
			type: "UPDATE_PERSONAL_DETAILS",
			payload: { name: "New Name" },
			meta: {},
		});

		expect(next).not.toBe(baseState);
		expect(next.personalDetails).toEqual({ name: "New Name" });
		expect(baseState.personalDetails).toEqual({ name: "Old Name" });
	});

	// An `?access_token=` session has no refresh token; requiring one here used
	// to drop the update and wipe the session.
	it("accepts UPDATE_USER_STORE without a refresh_token", () => {
		const next = UserReducer(baseState, {
			type: "UPDATE_USER_STORE",
			payload: {
				access_token: "acc-456",
				token_expiration: 3600,
				details: { mobile: "9876543210", is_org_admin: 0 },
			},
			meta: {},
		});

		expect(next).not.toBe(baseState);
		expect(next.access_token).toBe("acc-456");
		expect(next.loggedIn).toBe(true);
		expect(setandUpdateAuthTokens).toHaveBeenCalled();
		expect(setUserDetails).toHaveBeenCalled();
	});

	it("logs in without a refresh_token", () => {
		const next = UserReducer(defaultUserState, {
			type: "LOGIN",
			payload: {
				access_token: "acc-456",
				details: { mobile: "9876543210", is_org_admin: 0 },
			},
			meta: {},
		});

		expect(next.loggedIn).toBe(true);
		expect(next.access_token).toBe("acc-456");
		expect(next.userId).toBe("9876543210");
	});

	it("keeps the previous state when LOGIN has no details", () => {
		const next = UserReducer(baseState, {
			type: "LOGIN",
			payload: { access_token: "acc-456" },
			meta: {},
		});

		expect(next).toBe(baseState);
	});
});
