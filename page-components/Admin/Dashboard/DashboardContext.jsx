import { createContext, useContext, useState } from "react";

/**
 * Context for managing dashboard data.
 * @type {React.Context<{ businessDashboardData: object, setBusinessDashboardData: React.Dispatch<React.SetStateAction<object>> } | undefined>}
 */
const DashboardContext = createContext(undefined);

/**
 * Provides dashboard context to its children.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to wrap with context.
 * @returns {JSX.Element} The provider component.
 */
const DashboardProvider = ({ children }) => {
	const [businessDashboardData, setBusinessDashboardData] = useState({});
	const [onboardingDashboardData, setOnboardingDashboardData] = useState({});

	return (
		<DashboardContext.Provider
			value={{
				businessDashboardData,
				setBusinessDashboardData,
				onboardingDashboardData,
				setOnboardingDashboardData,
			}}
		>
			{children}
		</DashboardContext.Provider>
	);
};

/**
 * Custom hook to access dashboard context.
 * @throws {Error} If used outside of `DashboardProvider`.
 * @returns {{ businessDashboardData: object, setBusinessDashboardData: React.Dispatch<React.SetStateAction<object>> }} Dashboard context value.
 */
const useDashboard = () => {
	const context = useContext(DashboardContext);
	if (!context) {
		throw new Error("useDashboard must be used within a DashboardProvider");
	}
	return context;
};

export { DashboardProvider, useDashboard };
