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
		const transactionData = fetch(
			process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions",
			{
				method: "POST",
				headers: {
					"Content-type": "application/json",
					// Authorization: `Bearer ${"jjhhj"}`,
				},
				body: JSON.stringify({ org_id: -1 }),
			}
		)
			.then((res) => res.json())
			.then((data) => {
				if (data.length) {
					const processedData = processTransactionData(data);
					console.log("processedData", processedData);
					setInteractions(processedData);
				}
			})
			.catch((err) => console.log(err));
	}, []);

	// console.log("interactions", interactions);
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
