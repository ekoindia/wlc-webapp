import { Endpoints } from "constants/EndPoints";
import { processTransactionData } from "helpers";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

const MenuContext = createContext();

const MenuProvider = ({ children }) => {
	const { userData } = useUser();
	const [interactions, setInteractions] = useState({
		interaction_list: [],
		role_tx_list: {},
	});

	useEffect(() => {
		if (userData?.is_org_admin === 0) {
			//API call /transaction to fetch menu list
			fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/wlc", {
				method: "POST",
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${userData?.access_token}`,
				},
				body: JSON.stringify({ org_id: -1 }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data.length) {
						const processedData = processTransactionData(data);
						setInteractions(processedData);
					}
				})
				.catch((err) => console.log(err));
		}
	}, [userData?.is_org_admin]);

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
