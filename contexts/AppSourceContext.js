import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const AppSourceSessionStorageKey = "app_source";
const NativeVersionSessionStorageKey = "native_version";

// Creating context
const AppSourceContext = createContext();

// Creating context provider for providing application source details
// App source could be: web, pwa or androidwebview
const AppSourceProvider = ({ children }) => {
	/**
	 * App source (web, pwa or androidwebview)
	 */
	const [appSource, setAppSourceState] = useState("web");

	/**
	 * Native Android wrapper app version
	 * This is used to show/hide certain Android-related features in the app
	 */
	const [nativeVersion, setNativeVersionState] = useState(0);

	const setAppSource = useCallback((appSource) => {
		setAppSourceState(appSource);
		sessionStorage.setItem(AppSourceSessionStorageKey, appSource);
	});

	const setNativeVersion = useCallback((nativeVersion) => {
		setNativeVersionState(nativeVersion);
		sessionStorage.setItem(NativeVersionSessionStorageKey, nativeVersion);
	});

	// Initializations
	useEffect(() => {
		const _appSource = sessionStorage.getItem(AppSourceSessionStorageKey);
		const _nativeVersion = sessionStorage.getItem(
			NativeVersionSessionStorageKey
		);

		if (_appSource) {
			console.log("[AppSourceContext] got from session: ", _appSource);
			setAppSourceState(_appSource);
		} else {
			// Not found in session-storage, derive from user-agent
			const userAgent = navigator.userAgent.toLowerCase();
			if (userAgent.includes("ekoconnectandroidwebview")) {
				setAppSourceState("androidwebview");
				sessionStorage.setItem(
					AppSourceSessionStorageKey,
					"androidwebview"
				);
			}
		}

		if (_nativeVersion) {
			setNativeVersionState(_nativeVersion);
		}
	}, []);

	const value = useMemo(() => {
		return {
			appSource,
			setAppSource,
			nativeVersion,
			setNativeVersion,
			isAndroid: appSource === "androidwebview",
		};
	}, [appSource, nativeVersion]);

	return (
		<AppSourceContext.Provider value={value}>
			{children}
		</AppSourceContext.Provider>
	);
};

const useAppSource = () => {
	const context = useContext(AppSourceContext);
	return context;
};

export { AppSourceProvider, useAppSource };
