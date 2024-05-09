import { ChakraProvider } from "@chakra-ui/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayoutProvider } from "contexts/LayoutContext";
import { MenuProvider } from "contexts/MenuContext";
import { OrgDetailProvider } from "contexts/OrgDetailContext";
import { UserProvider } from "contexts/UserContext";
import { Layout } from "layout-components";
import { light } from "styles/themes";
import { MockAdminUser, MockOrg, MockUser } from "./test-utils.mocks";

import mockRouter from "next-router-mock";

// Add in any providers here if necessary:
const BaseProviders = ({ children }) => {
	return (
		<GoogleOAuthProvider
			clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
		>
			<ChakraProvider theme={light}>
				<OrgDetailProvider initialData={MockOrg}>
					<LayoutProvider>
						<MenuProvider>
							<Layout>{children}</Layout>
						</MenuProvider>
					</LayoutProvider>
				</OrgDetailProvider>
			</ChakraProvider>
		</GoogleOAuthProvider>
	);
};

const LoggedOutProviders = ({ children }) => {
	return (
		<UserProvider>
			<BaseProviders>{children}</BaseProviders>
		</UserProvider>
	);
};

const LoggedInProviders = ({ children }) => {
	return (
		<UserProvider userMockData={MockUser}>
			<BaseProviders>{children}</BaseProviders>
		</UserProvider>
	);
};

const AdminProviders = ({ children }) => {
	return (
		<UserProvider userMockData={MockAdminUser}>
			<BaseProviders>{children}</BaseProviders>
		</UserProvider>
	);
};

// Standard page render (for logged-in users)
const pageRender = (ui, options = {}) =>
	render(ui, { wrapper: LoggedInProviders, ...options });

// Page render for logged-out users
const loggedOutPageRender = (ui, options = {}) =>
	render(ui, { wrapper: LoggedOutProviders, ...options });

// Page render for admin users
const adminRender = (ui, options = {}) =>
	render(ui, { wrapper: AdminProviders, ...options });

// Mock JSDOM Methods (https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom)
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});

// Re-export everything
export * from "@testing-library/dom";
export * from "@testing-library/react";
export { pageRender, adminRender, loggedOutPageRender, userEvent, mockRouter };
