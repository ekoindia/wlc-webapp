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

/**
 * Context provider for application source: `web`, `pwa` or `androidwebview`
 * @param root0
 * @param root0.children
 */
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
			let _source = "";
			if (
				navigator?.userAgent
					?.toLowerCase()
					?.includes("ekoconnectandroidwebview")
			) {
				_source = "androidwebview";
			} else if (
				window?.location?.href?.endsWith("/source/androidwebview")
			) {
				_source = "androidwebview";
			} else if (window?.location?.href?.endsWith("/source/pwa")) {
				_source = "pwa";
			}

			if (_source) {
				console.log(
					"[AppSourceContext] app-source derived from user-agent/URL: ",
					_source
				);
				setAppSourceState(_source);
				sessionStorage.setItem(AppSourceSessionStorageKey, _source);
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
			isPWA: appSource === "pwa",
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
