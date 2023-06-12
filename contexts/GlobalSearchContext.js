import { createContext, useContext, useEffect, useMemo, useState } from "react";

/**
 * @typedef {Object} GlobalSearchValue
 * @property {string} title - The current GlobalSearch title.
 * @property {function(string):void} setSearchTitle - Function to update the GlobalSearch title.
 * @property {function():void} resetSearchTitle - Set the GlobalSearch title back to default.
 */

/**
 * The globalSearch context.
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
 */
export const GlobalSearchProvider = ({ children }) => {
	// State to store the placeholder text for the Global Searchbar
	const [globalSearchTitle, setGlobalSearchTitle] = useState("");

	// State to store all the Kbar actions under the "My Business Details..." section
	const [businessActions, setBusinessActions] = useState([]);

	// useEffect(() => {
	// 	console.log("Registered businessActions:: ", businessActions);
	// }, [businessActions]);

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
	 * Register the actions for the "My Business Details..." section.
	 * Actions with existing id will be overwritten.
	 * @param {Array} actions - The actions to register.
	 */
	const registerBusinessSearchData = (actions) => {
		if (!Array.isArray(actions)) {
			console.error(
				"[registerBusinessSearchData] Actions must be an array:",
				actions
			);
			return;
		}

		setBusinessActions((prevActions) => {
			const newActionList = [...prevActions];
			actions.forEach((action) => {
				const index = newActionList.findIndex(
					(newAction) => newAction.id === action.id
				);

				// Set default values for the action
				const newAction = {
					parent: "my-business",
					perform: () => {},
					...action,
				};

				if (index === -1) {
					// New action
					newActionList.push(newAction);
				} else {
					// Overwrite the existing action only if name or subtitle have changed
					if (
						newActionList[index].name !== action.name ||
						newActionList[index].subtitle !== action.subtitle
					) {
						newActionList[index] = newAction;
					}
				}
			});
			return newActionList;
		});
	};

	/**
	 * The value provided to the GlobalSearch context.
	 * @type {GlobalSearchValue}
	 */
	const value = useMemo(() => {
		return {
			title: globalSearchTitle,
			setSearchTitle,
			resetSearchTitle,
			businessActions,
			registerBusinessSearchData,
		};
	}, [
		globalSearchTitle,
		businessActions,
		setSearchTitle,
		resetSearchTitle,
		registerBusinessSearchData,
	]);

	return (
		<GlobalSearchContext.Provider value={value}>
			{children}
		</GlobalSearchContext.Provider>
	);
};

export const useBusinessSearchActions = (actions, dependencies) => {
	const { registerBusinessSearchData } = useGlobalSearch();

	useEffect(() => {
		registerBusinessSearchData(actions);
	}, dependencies);
};
