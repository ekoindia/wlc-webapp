import { transactionSample } from "constants";
import { processTransactionData } from "helpers";
import { createContext, useContext, useEffect, useState } from "react";

const MenuContext = createContext();

const MenuProvider = ({ children }) => {
	const [interactions, setInteractions] = useState({
		interaction_list: [],
		_role_tx_list: {},
	});

	useEffect(() => {
		//API call /transaction to fetch menu list
		// fetch("/db/transactionSample.json", {
		// 	method: "get",
		// })
		// 	.then((res) => res.json())
		// 	.then((data) => console.log(data))
		// 	.catch((err) => console.log(err));
		const processedData = processTransactionData(transactionSample);
		setInteractions(processedData);
	}, []);

	console.log("interactions", interactions);
	//TODO fetch menu data,process data, set in local storage

	return (
		<MenuContext.Provider value={interactions}>
			{children}
		</MenuContext.Provider>
	);
};

const useMenuContext = () => {
	const context = useContext(MenuContext);
	return context;
};

export { MenuProvider, useMenuContext };
