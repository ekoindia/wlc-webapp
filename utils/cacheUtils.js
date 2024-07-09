/**
 * @file Contains utility functions for managing (clearing) the cache (localStorage & sessionStorage).
 */

// import { OrgDetailSessionStorageKey } from "contexts";

/**
 * List of localStorage keys to preserve...
 */
const localStoragePreserveKeys = ["inf-last-route", "inf-last-login", "todos"];

/**
 * List of sessionStorage keys to preserve...
 */
const sessionStoragePreserveKeys = ["org_detail"]; // [OrgDetailSessionStorageKey];

/**
 * Clears all the data stored in the caches.
 * @param clear_session
 */
export const clearCache = (clear_session) => {
	// Clear session storage
	if (clear_session) clearSessionStorage();

	// Clear local storage
	clearLocalStorage();
};

/**
 * Clears all the data stored in the caches and reloads the app.
 * @param clear_session
 */
export const clearCacheAndReload = (clear_session) => {
	// Clear both session storage & local storage caches...
	clearCache(clear_session);

	// Reload
	window.location.reload();
};

/**
 * Clears all the data stored in the sessionStorage cache except the ones in the preserve list.
 */
export const clearSessionStorage = () => {
	if (!window?.sessionStorage) {
		return;
	}

	// Clear session storage (except the ones in the preserve list)
	Object.keys(window.sessionStorage).forEach((key) => {
		if (!sessionStoragePreserveKeys.includes(key)) {
			window.sessionStorage.removeItem(key);
		}
	});
};

/**
 * Clears all the data stored in the localStorage cache except the ones in the preserve list.
 */
export const clearLocalStorage = () => {
	if (!window?.localStorage) {
		return;
	}

	// Clear local storage (except the ones in the preserve list)
	Object.keys(window.localStorage).forEach((key) => {
		if (!localStoragePreserveKeys.includes(key)) {
			window.localStorage.removeItem(key);
		}
	});
};
