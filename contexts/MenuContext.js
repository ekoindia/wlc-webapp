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
		let local_interaction_list = localStorage.getItem("interaction_list");
		let local_role_tx_list = localStorage.getItem("role_tx_list");
		if (userData?.is_org_admin === 0) {
			if (local_interaction_list && local_role_tx_list) {
				setInteractions({
					interaction_list: JSON.parse(local_interaction_list),
					role_tx_list: JSON.parse(local_role_tx_list),
				});
			} else {
				fetch(
					process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/wlc",
					{
						method: "POST",
						headers: {
							"Content-type": "application/json",
							Authorization: `Bearer ${userData?.access_token}`,
						},
						body: JSON.stringify({ org_id: -1 }),
					}
				)
					.then((res) => res.json())
					.then((data) => {
						if (data.length) {
							const processedData = processTransactionData(data);
							setInteractions(processedData);
							localStorage.setItem(
								"interaction_list",
								JSON.stringify(processedData.interaction_list)
							);
							localStorage.setItem(
								"role_tx_list",
								JSON.stringify(processedData.role_tx_list)
							);
						}
					})
					.catch((err) => console.log(err));
			}
		}
	}, [userData?.is_org_admin]);

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
