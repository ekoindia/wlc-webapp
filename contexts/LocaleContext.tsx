import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

interface LocaleContextType {
	locale: string;
	changeLocale: (_lng: string) => void;
}

const LocaleContext = createContext<LocaleContextType>({
	locale: "en",
	changeLocale: () => {},
});

interface LocaleProviderProps {
	children: React.ReactNode;
}

/**
 * Provides locale management functionality throughout the application
 * Handles locale persistence via localStorage and cookies
 * @param {LocaleProviderProps} props - Provider props containing children
 * @returns {JSX.Element} Context provider with locale state
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
	const router = useRouter();
	const [locale, setLocale] = useState<string>(router.locale || "en");

	useEffect(() => {
		const saved = localStorage.getItem("user-locale-preference");
		if (saved && saved !== locale) {
			setLocale(saved);
			router.replace(router.asPath, undefined, { locale: saved });
		}
	}, [locale, router]);

	/**
	 * Changes the application locale and persists the preference
	 * @param {string} lng - The locale code to switch to
	 */
	const changeLocale = (lng: string): void => {
		setLocale(lng);
		localStorage.setItem("user-locale-preference", lng);
		document.cookie = `NEXT_LOCALE=${lng}; path=/; max-age=31536000`;
		router.push(router.asPath, undefined, { locale: lng });
	};

	return (
		<LocaleContext.Provider value={{ locale, changeLocale }}>
			{children}
		</LocaleContext.Provider>
	);
};

/**
 * Hook to access locale context
 * @returns {LocaleContextType} Current locale and change function
 */
export const useLocale = (): LocaleContextType => useContext(LocaleContext);
