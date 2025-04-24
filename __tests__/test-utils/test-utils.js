import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
// import { LayoutProvider } from "contexts/LayoutContext";
import { KBarLazyProvider } from "components/CommandBar";
import {
	AppSourceProvider,
	CommissionSummaryProvider,
	EarningSummaryProvider,
	GlobalSearchProvider,
	MenuProvider,
	NetworkUsersProvider,
	NotificationProvider,
	OrgDetailProvider,
	PubSubProvider,
	TodoProvider,
	UserProvider,
	WalletProvider,
} from "contexts";
import { localStorageProvider } from "helpers";
import { Layout } from "layout-components";
import { light } from "styles/themes";
import { MockAdminUser, MockOrg, MockUser } from "./test-utils.mocks";

import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

// Configure Chakra Toast default properties
const toastDefaultOptions = {
	position: "bottom-right",
	duration: 6000,
	isClosable: true,
};

// Add Top level providers here (which should wrap UserProvider):
const TopProviders = ({ children }) => {
	return (
		<MemoryRouterProvider>
			<ChakraProvider
				theme={light}
				resetCSS={true}
				toastOptions={{ defaultOptions: toastDefaultOptions }}
			>
				<AppSourceProvider>
					<OrgDetailProvider initialData={MockOrg}>
						{children}
					</OrgDetailProvider>
				</AppSourceProvider>
			</ChakraProvider>
		</MemoryRouterProvider>
	);
};

// Add in any providers here if necessary:
const BaseProviders = ({ children }) => {
	return (
		<KBarLazyProvider load={false}>
			<GlobalSearchProvider>
				<MenuProvider>
					<WalletProvider>
						<SWRConfig
							value={{
								provider: localStorageProvider,
							}}
						>
							<PubSubProvider>
								<NotificationProvider>
									<EarningSummaryProvider>
										<CommissionSummaryProvider>
											<NetworkUsersProvider>
												<TodoProvider>
													<Layout>{children}</Layout>
												</TodoProvider>
											</NetworkUsersProvider>
										</CommissionSummaryProvider>
									</EarningSummaryProvider>
								</NotificationProvider>
							</PubSubProvider>
						</SWRConfig>
					</WalletProvider>
				</MenuProvider>
			</GlobalSearchProvider>
		</KBarLazyProvider>
	);
};

const LoggedOutProviders = ({ children }) => {
	return (
		<TopProviders>
			<UserProvider>
				<BaseProviders>{children}</BaseProviders>
			</UserProvider>
		</TopProviders>
	);
};

const LoggedInProviders = ({ children }) => {
	return (
		<TopProviders>
			<UserProvider userMockData={MockUser}>
				<BaseProviders>{children}</BaseProviders>
			</UserProvider>
		</TopProviders>
	);
};

const AdminProviders = ({ children }) => {
	return (
		<TopProviders>
			<UserProvider userMockData={MockAdminUser}>
				<BaseProviders>{children}</BaseProviders>
			</UserProvider>
		</TopProviders>
	);
};

/**
 * Standard page render (for logged-in users)
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
const pageRender = (ui, options = {}) =>
	render(ui, { wrapper: LoggedInProviders, ...options });

/**
 * Page render for logged-out users
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
const loggedOutPageRender = (ui, options = {}) =>
	render(ui, { wrapper: LoggedOutProviders, ...options });

/**
 * Page render for admin users
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
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
export { adminRender, loggedOutPageRender, mockRouter, pageRender, userEvent };
