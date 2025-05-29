import { ChakraProvider } from "@chakra-ui/react";
import {
	render as defaultRender,
	renderHook as defaultRenderHook,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockAdminUser, MockOrg, MockUser } from "__tests__/fixtures/session";
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
import { SWRConfig } from "swr";

import mockRouter from "next-router-mock";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

// Configure Chakra Toast default properties
const toastDefaultOptions = {
	position: "bottom-right",
	duration: 6000,
	isClosable: true,
};

// Theme providers needed for most UI elements
const ThemeProviders = ({ children }) => {
	return (
		<ChakraProvider
			theme={light}
			resetCSS={true}
			toastOptions={{ defaultOptions: toastDefaultOptions }}
		>
			{children}
		</ChakraProvider>
	);
};

// Add Top level providers here (which should wrap UserProvider):
const TopProviders = ({ children }) => {
	return (
		<MemoryRouterProvider>
			<ThemeProviders>
				<AppSourceProvider>
					<OrgDetailProvider initialData={MockOrg}>
						{children}
					</OrgDetailProvider>
				</AppSourceProvider>
			</ThemeProviders>
		</MemoryRouterProvider>
	);
};

/**
 * Common Context providers used in Eloka for rendering hooks.
 * It does not include UserProvider, so it can be used for both logged-in and logged-out users.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const CommonHooksProviders = ({ children }) => {
	return (
		<MemoryRouterProvider>
			<AppSourceProvider>
				<OrgDetailProvider initialData={MockOrg}>
					<PubSubProvider>{children}</PubSubProvider>
				</OrgDetailProvider>
			</AppSourceProvider>
		</MemoryRouterProvider>
	);
};

/**
 * Common Context providers, along with the UserProvider which simulates a logged-out user.
 * This is used for rendering hooks that do not require a logged-in user.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const LoggedOutUserHookProviders = ({ children }) => {
	return (
		<CommonHooksProviders>
			<UserProvider>{children}</UserProvider>
		</CommonHooksProviders>
	);
};

/**
 * Common Context providers, along with the UserProvider which simulates a logged-in user.
 * This is used for rendering hooks that require a logged-in user.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const LoggedInUserHookProviders = ({ children }) => {
	return (
		<CommonHooksProviders>
			<UserProvider userMockData={MockUser}>{children}</UserProvider>
		</CommonHooksProviders>
	);
};

/**
 * Common Context providers, along with the UserProvider which simulates an admin user.
 * This is used for rendering hooks that require an admin user.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const AdminUserHookProviders = ({ children }) => {
	return (
		<CommonHooksProviders>
			<UserProvider userMockData={MockAdminUser}>{children}</UserProvider>
		</CommonHooksProviders>
	);
};

/**
 * Common Context providers used in Eloka for rendering components.
 * It includes all necessary providers except UserProvider, so it can be used for both logged-in and logged-out users.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const CommonProviders = ({ children }) => {
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

/**
 * Common Context providers, along with the UserProvider which simulates a logged-out user.
 * This is used for rendering components that do not require a logged-in user.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const LoggedOutProviders = ({ children }) => {
	return (
		<TopProviders>
			<UserProvider>
				<CommonProviders>{children}</CommonProviders>
			</UserProvider>
		</TopProviders>
	);
};

/**
 * Common Context providers, along with the UserProvider which simulates a logged-in user.
 * This is used for rendering components that require a logged-in user.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const LoggedInProviders = ({ children }) => {
	return (
		<TopProviders>
			<UserProvider userMockData={MockUser}>
				<CommonProviders>{children}</CommonProviders>
			</UserProvider>
		</TopProviders>
	);
};

/**
 * Common Context providers, along with the UserProvider which simulates an admin user.
 * This is used for rendering components that require an admin user.
 * @param {ReactElement} children - The child components to render within the providers
 * @returns {JSX.Element} - The rendered component wrapped with necessary providers
 */
const AdminProviders = ({ children }) => {
	return (
		<TopProviders>
			<UserProvider userMockData={MockAdminUser}>
				<CommonProviders>{children}</CommonProviders>
			</UserProvider>
		</TopProviders>
	);
};

/**
 * Default render wrapper function which wraps the component only with necessary Context providers.
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
const render = (ui, options = {}) =>
	defaultRender(ui, { wrapper: ThemeProviders, ...options });

/**
 * Standard page render (for logged-in users)
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
const pageRender = (ui, options = {}) =>
	defaultRender(ui, { wrapper: LoggedInProviders, ...options });

/**
 * Page render for logged-out users
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
const loggedOutPageRender = (ui, options = {}) =>
	defaultRender(ui, { wrapper: LoggedOutProviders, ...options });

/**
 * Page render for admin users
 * @param {ReactElement} ui - The component to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderResult} - The rendered component
 */
const adminRender = (ui, options = {}) =>
	defaultRender(ui, { wrapper: AdminProviders, ...options });

/**
 *Default render hook wrapper function which wraps the component with necessary providers simulating a logged-in user.
 * @param {Function} hook - The hook to render
 * @param {object} options - Additional options for rendering
 * @returns {RenderHookResult} - The rendered hook
 */
const renderHook = (hook, options = {}) =>
	defaultRenderHook(hook, { wrapper: LoggedInUserHookProviders, ...options });

const renderLoggedOutHook = (hook, options = {}) =>
	defaultRenderHook(hook, {
		wrapper: LoggedOutUserHookProviders,
		...options,
	});

const renderAdminHook = (hook, options = {}) =>
	defaultRenderHook(hook, {
		wrapper: AdminUserHookProviders,
		...options,
	});

// Re-export everything
export * from "@testing-library/dom";
export * from "@testing-library/react";
export {
	adminRender,
	CommonHooksProviders,
	loggedOutPageRender,
	mockRouter,
	pageRender,
	render,
	renderAdminHook,
	renderHook,
	renderLoggedOutHook,
	userEvent,
};
