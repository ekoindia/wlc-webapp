/**
 * Lazy-load context wrapper for KBarProvider context. It lazy-loads the context provider only when load=true is pased to the KBarLazyProvider
 */

import { useSession } from "contexts";
import { createContext, useContext, useEffect, useState } from "react";
import { getDefaultActions } from ".";

// Create a context for our provider
const KBarContext = createContext();

/**
 * Custom KBarProvider wrapper
 * @param {object} props
 * @param {React.ReactNode} props.children - The children to render
 * @param {boolean} props.load - If true, load the KBarProvider
 */
export function KBarLazyProvider({ children, load }) {
	const [kbar, setKBar] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const { logout } = useSession();

	// Use useEffect to asynchronously import the kbar library and set the state
	useEffect(() => {
		if (load) {
			import("kbar").then((kbarModule) => {
				setKBar(kbarModule);
				setLoaded(true); // set loaded to true after kbar is successfully imported
			});
		}
	}, [load]); // Rerun this effect whenever the `load` prop changes

	// Render our context provider and the KBarProvider (if loaded)
	return (
		<KBarContext.Provider value={{ ready: loaded }}>
			{loaded && kbar ? (
				<kbar.KBarProvider
					actions={getDefaultActions({ logout })}
					options={{
						enableHistory: false,
						disableScrollbarManagement: true,
						// callbacks: {
						// 	onOpen: () => {
						// 		console.log("[KBar] onOpen");
						// 	},
						// },
					}}
				>
					{children}
				</kbar.KBarProvider>
			) : (
				<>{children}</>
			)}
		</KBarContext.Provider>
	);
}

// Custom hook to use the context
/**
 *
 */
export function useKBarReady() {
	const context = useContext(KBarContext);
	if (context === undefined) {
		throw new Error("useKBar must be used within a KBarLazyProvider");
	}
	return context;
}
