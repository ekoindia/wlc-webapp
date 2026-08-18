import { renderHook, waitFor } from "@testing-library/react";
import { useGatewayDirectLogin } from "features/gateway/useGatewayDirectLogin";
import { loginUsingAccessToken } from "helpers/loginHelper";

const mockReplace = jest.fn(() => Promise.resolve(true));

jest.mock("next/router", () => ({
	useRouter: () => ({ replace: mockReplace }),
}));

const mockUser = {
	isLoggedIn: false,
	login: jest.fn(),
	logout: jest.fn(),
	updateUserInfo: jest.fn(),
};

jest.mock("contexts", () => ({
	useUser: () => mockUser,
	useAppSource: () => ({ isAndroid: false }),
}));

jest.mock("helpers/loginHelper", () => ({
	loginUsingAccessToken: jest.fn(() => Promise.resolve()),
}));

describe("useGatewayDirectLogin", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUser.isLoggedIn = false;
	});

	const setUrl = (search: string) => {
		window.history.replaceState(
			null,
			"",
			`/gateway/products/kyc-verification${search}`
		);
	};

	it("logs in with ?access_token=, stripping the URL first", async () => {
		setUrl("?access_token=TOK123&foo=bar");

		const { result } = renderHook(() => useGatewayDirectLogin(true));

		await waitFor(() => expect(result.current).toBe("done"));

		expect(loginUsingAccessToken).toHaveBeenCalledWith(
			"TOK123",
			mockUser.updateUserInfo,
			mockUser.login,
			mockUser.logout,
			false
		);
		// Credential stripped, non-credential params preserved
		expect(mockReplace).toHaveBeenCalledWith(
			"/gateway/products/kyc-verification?foo=bar",
			undefined,
			{ shallow: true }
		);
		// Strip resolved before login fired
		expect(mockReplace.mock.invocationCallOrder[0]).toBeLessThan(
			(loginUsingAccessToken as jest.Mock).mock.invocationCallOrder[0]
		);
	});

	it("strips a reserved ?code= param without redeeming it", async () => {
		setUrl("?access_token=TOK123&code=SHOULD_GO");

		const { result } = renderHook(() => useGatewayDirectLogin(true));

		await waitFor(() => expect(result.current).toBe("done"));
		expect(mockReplace).toHaveBeenCalledWith(
			"/gateway/products/kyc-verification",
			undefined,
			{ shallow: true }
		);
	});

	it("reports no_credential when no token in URL", async () => {
		setUrl("");

		const { result } = renderHook(() => useGatewayDirectLogin(true));

		await waitFor(() => expect(result.current).toBe("no_credential"));
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it("does not log in until enabled, then logs in", async () => {
		setUrl("?access_token=TOK123");

		const { result, rerender } = renderHook(
			({ enabled }) => useGatewayDirectLogin(enabled),
			{ initialProps: { enabled: false } }
		);

		// URL stripped immediately even while disabled
		expect(mockReplace).toHaveBeenCalled();
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
		expect(result.current).toBe("pending");

		rerender({ enabled: true });
		await waitFor(() => expect(result.current).toBe("done"));
		expect(loginUsingAccessToken).toHaveBeenCalled();
	});

	it("keeps an existing session instead of consuming the token", async () => {
		setUrl("?access_token=TOK123");
		mockUser.isLoggedIn = true;

		const { result } = renderHook(() => useGatewayDirectLogin(true));

		await waitFor(() => expect(result.current).toBe("done"));
		expect(loginUsingAccessToken).not.toHaveBeenCalled();
		// Credential still stripped from the URL
		expect(mockReplace).toHaveBeenCalled();
	});
});
