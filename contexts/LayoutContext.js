import { createContext, useContext, useState } from "react";

const LayoutContext = createContext();

const LayoutProvider = ({ children }) => {
	const [isNavHidden, setNavHidden] = useState(false);
	console.log("isNavHidden", isNavHidden);

	return (
		<LayoutContext.Provider value={{ isNavHidden, setNavHidden }}>
			{children}
		</LayoutContext.Provider>
	);
};

const useLayoutContext = () => {
	const context = useContext(LayoutContext);
	return context;
};

export { LayoutProvider, useLayoutContext };
