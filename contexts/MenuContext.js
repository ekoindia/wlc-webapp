import { processTransactionData } from "helpers";
import { fetcher } from "helpers/apiHelper";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./UserContext";

const MenuContext = createContext();

const MenuProvider = ({ children }) => {
	const { isLoggedIn, isAdmin, accessToken } = useSession();
	const [interactions, setInteractions] = useState({
		interaction_list: [],
		role_tx_list: {},
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isLoggedIn) {
			if (!isAdmin) {
				// load menu & role data only if user is not an admin
				setLoading(true);

				// TODO: use SWR with caching
				let local_interaction_list =
					sessionStorage.getItem("interaction_list") || "[]";
				let local_role_tx_list =
					sessionStorage.getItem("role_tx_list") || "{}";

				// Data cached? Use it...
				if (
					local_interaction_list &&
					local_role_tx_list &&
					local_interaction_list !== "[]" &&
					local_role_tx_list !== "{}"
				) {
					const context_data = {
						interaction_list: JSON.parse(local_interaction_list),
						role_tx_list: JSON.parse(local_role_tx_list),
					};
					setInteractions(context_data);
					setLoading(false);
					console.log(
						"[MenuContext]: data loaded from cache: ",
						context_data
					);
					return;
				}

				// Data not cached? Fetch from API...
				fetcher(
					process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/wlc",
					{
						token: accessToken,
						// body: { org_id: -1 },
					}
				)
					// .then((res) => res.json())
					.then((data) => {
						setLoading(false);
						if (data.length) {
							const processedData = processTransactionData(data);
							setInteractions(processedData);
							sessionStorage.setItem(
								"interaction_list",
								JSON.stringify(processedData.interaction_list)
							);
							sessionStorage.setItem(
								"role_tx_list",
								JSON.stringify(processedData.role_tx_list)
							);

							console.log(
								"[MenuContext]: data loaded from API: ",
								processedData
							);
						}
					})
					.catch((err) => console.error("MenuProvider error: ", err))
					.finally(() => setLoading(false));
			}
		}
	}, [isLoggedIn, isAdmin, accessToken]);

	return (
		<MenuContext.Provider value={{ interactions, loading }}>
			{children}
		</MenuContext.Provider>
	);
};

const useMenuContext = () => {
	const context = useContext(MenuContext);
	return context;
};

export { MenuProvider, useMenuContext };
