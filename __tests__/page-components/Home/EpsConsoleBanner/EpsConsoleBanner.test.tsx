import { fireEvent, renderHook } from "@testing-library/react";
import {
	EpsConsoleBanner,
	useEpsConsoleUrl,
} from "page-components/Home/EpsConsoleBanner";
import { render } from "test-utils";

const mockUserDetails: { current: Record<string, string | undefined> } = {
	current: {},
};

jest.mock("contexts", () => ({
	__esModule: true,
	useUser: () => ({ userData: { userDetails: mockUserDetails.current } }),
}));

const EPS_PARTNER = { org_id: "1", user_type: "23", mobile: "6710000002" };
const ORIGINAL_ENV = process.env.NEXT_PUBLIC_EPS_CONSOLE_URL;

describe("EpsConsoleBanner", () => {
	it("opens console URL in new tab from the login button", () => {
		const openSpy = jest
			.spyOn(window, "open")
			.mockImplementation(() => null);
		const { getByRole, getByText } = render(
			<EpsConsoleBanner consoleUrl="https://eps.eko.in/console?mobile=1" />
		);

		expect(
			getByText(/permanently moved to eps\.eko\.in/i)
		).toBeInTheDocument();
		fireEvent.click(
			getByRole("button", { name: /login to eps\.eko\.in/i })
		);

		expect(openSpy).toHaveBeenCalledWith(
			"https://eps.eko.in/console?mobile=1",
			"_blank",
			"noopener,noreferrer"
		);
		openSpy.mockRestore();
	});
});

describe("useEpsConsoleUrl", () => {
	beforeEach(() => {
		process.env.NEXT_PUBLIC_EPS_CONSOLE_URL = "https://eps.eko.in/console";
		mockUserDetails.current = EPS_PARTNER;
	});

	afterAll(() => {
		process.env.NEXT_PUBLIC_EPS_CONSOLE_URL = ORIGINAL_ENV;
	});

	it("returns console URL with mobile for org-1 EPS partner", () => {
		const { result } = renderHook(() => useEpsConsoleUrl());
		expect(result.current).toBe(
			"https://eps.eko.in/console?mobile=6710000002"
		);
	});

	it("keeps existing query params and omits missing mobile", () => {
		process.env.NEXT_PUBLIC_EPS_CONSOLE_URL =
			"https://eps.eko.in/console?a=1";
		mockUserDetails.current = { ...EPS_PARTNER, mobile: undefined };
		const { result } = renderHook(() => useEpsConsoleUrl());
		expect(result.current).toBe("https://eps.eko.in/console?a=1");
	});

	it.each([
		["env missing", undefined, EPS_PARTNER],
		["env invalid", "not a url", EPS_PARTNER],
		[
			"other user type",
			"https://eps.eko.in/console",
			{ ...EPS_PARTNER, user_type: "2" },
		],
		[
			"other org",
			"https://eps.eko.in/console",
			{ ...EPS_PARTNER, org_id: "2" },
		],
	])("returns null when %s", (_label, envUrl, userDetails) => {
		if (envUrl === undefined)
			delete process.env.NEXT_PUBLIC_EPS_CONSOLE_URL;
		else process.env.NEXT_PUBLIC_EPS_CONSOLE_URL = envUrl;
		mockUserDetails.current = userDetails;
		const errorSpy = jest
			.spyOn(console, "error")
			.mockImplementation(() => {});

		const { result } = renderHook(() => useEpsConsoleUrl());

		expect(result.current).toBeNull();
		errorSpy.mockRestore();
	});
});
