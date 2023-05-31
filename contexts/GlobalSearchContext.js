import React, { createContext, useContext, useState } from "react";

/**
 * @typedef {Object} GlobalSearchValue
 * @property {string} title - The current GlobalSearch title.
 * @property {function(string):void} setSearchTitle - Function to update the GlobalSearch title.
 * @property {function():void} resetSearchTitle - Set the GlobalSearch title back to default.
 */

/**
 * The globalSearch context.
 * @type {React.Context<globalSearchValue>}
 */
const GlobalSearchContext = createContext();

/**
 * Custom hook to use the globalSearch context.
 * @returns {globalSearchValue} The globalSearch context.
 */
export const useGlobalSearch = () => {
	return useContext(GlobalSearchContext);
};

/**
 * Provider component for the globalSearch context.
 * @param {Object} props - The props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The provider element.
 */
export const GlobalSearchProvider = ({ children }) => {
	const [globalSearchTitle, setGlobalSearchTitle] = useState("");

	// Function to set globalSearch title
	const setSearchTitle = (title) => {
		setGlobalSearchTitle(title);
	};

	/**
	 * Reset the GlobalSearch title.
	 */
	const resetSearchTitle = () => {
		setGlobalSearchTitle("");
	};

	/**
	 * The value provided to the GlobalSearch context.
	 * @type {GlobalSearchValue}
	 */
	const value = {
		title: globalSearchTitle,
		setSearchTitle,
		resetSearchTitle,
	};

	return (
		<GlobalSearchContext.Provider value={value}>
			{children}
		</GlobalSearchContext.Provider>
	);
};
