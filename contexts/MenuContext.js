import { fetcher } from "helpers/apiHelper";
import { processTransactionData } from "helpers/processData";
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
		console.log("userData::", userData);

		if (userData?.loggedIn && userData?.userId > 1) {
			if (userData?.is_org_admin !== 1) {
				// load menu & role data only if user is not an admin

				// TODO: use SWR with caching

				let local_interaction_list =
					sessionStorage.getItem("interaction_list") || "[]";
				let local_role_tx_list =
					sessionStorage.getItem("role_tx_list") || "{}";

				if (
					local_interaction_list &&
					local_role_tx_list &&
					local_interaction_list !== "[]" &&
					local_role_tx_list !== "{}"
				) {
					setInteractions({
						interaction_list: JSON.parse(local_interaction_list),
						role_tx_list: JSON.parse(local_role_tx_list),
					});
				} else {
					fetcher(
						process.env.NEXT_PUBLIC_API_BASE_URL +
							"/transactions/wlc",
						{
							token: userData?.access_token,
							// body: { org_id: -1 },
						}
					)
						// .then((res) => res.json())
						.then((data) => {
							if (data.length) {
								const processedData =
									processTransactionData(data);
								setInteractions(processedData);
								sessionStorage.setItem(
									"interaction_list",
									JSON.stringify(
										processedData.interaction_list
									)
								);
								sessionStorage.setItem(
									"role_tx_list",
									JSON.stringify(processedData.role_tx_list)
								);
							}
						})
						.catch((err) => console.error(err));
				}
			}
		} else {
			// Not logged in...reset roles & menu...
			setInteractions({
				role_tx_list: {},
				interaction_list: [],
			});
			sessionStorage.setItem("interaction_list", "[]");
			sessionStorage.setItem("role_tx_list", "{}");
		}
	}, [userData?.loggedIn, userData?.userId, userData?.is_org_admin]);

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
