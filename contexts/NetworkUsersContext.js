import { Endpoints, UserType, UserTypeLabel } from "constants";
import { useSession } from "contexts/UserContext";
import { useApiFetch, useDailyCacheState } from "hooks";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

/**
 * @typedef {object} NetworkUsersValue
 * @property {number} this_month_till_yesterday - This month's earnings till yesterday midnight.
 * @property {number} last_month_till_yesterday - Last month's earnings till the previous day midnight.
 * @property {number} last_month_total - Last month's total earnings.
 * @property {string} asof - The date/time till which the earnings are calculated.
 * @property {string} userId - The user code of the user.
 */

/**
 * The NetworkUsers context. Fetch and cache the network users data.
 */
const NetworkUsersContext = createContext();

/**
 * Custom hook to use the NetworkUsers context.
 * @returns {NetworkUsersValue} The NetworkUsers context.
 */
export const useNetworkUsers = () => {
	return useContext(NetworkUsersContext);
};

/**
 * Provider component for the NetworkUsers context.
 * @param {object} props - The props to pass to the provider.
 * @param {object} props.children - The child components.
 */
export const NetworkUsersProvider = ({ children }) => {
	const [networkUsers, setNetworkUsers, isValid] = useDailyCacheState(
		"inf-netusrs",
		{
			networkUsersList: [],
			asof: null,
			userId: "",
		}
	);
	const [networkCount, setNetworkCount] = useState(0);
	const [networkUsersTree, setNetworkUsersTree] = useState({});
	const [userTypeIdList, setUserTypeIdList] = useState([]);

	// Get the logged-in user's data from the UserContext.
	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId } =
		useSession();

	const [fetchUsers, loading] = useApiFetch(Endpoints.TRANSACTION, {
		headers: {
			"tf-req-uri-root-path": "/ekoicici/v1",
			"tf-req-uri": "/network/agent-list",
			"tf-req-method": "GET",
		},
		onSuccess: (res) => {
			if (res?.data?.csp_list) {
				setNetworkUsers({
					networkUsersList: res?.data?.csp_list,
					asof: Date.now(),
					userId: userId,
				});
			}
		},
		onError: ({ errorObject, request }) => {
			console.error("Error fetching network users:", {
				error: errorObject,
				request,
			});
		},
	});

	/**
	 * Get Tree View Data and User Count from the list of users
	 */
	useEffect(() => {
		if (!networkUsers?.networkUsersList?.length) return;

		setNetworkCount(networkUsers.networkUsersList.length || 0);
		generateTree(
			networkUsers.networkUsersList,
			setNetworkUsersTree,
			setUserTypeIdList
		);
	}, [networkUsers.networkUsersList]);

	/**
	 * Fetch the network users data from the server.
	 */
	const refreshUserList = useCallback(() => {
		if (!isLoggedIn || !accessToken || isOnboarding) return;

		// Currently only allowed for Admins
		if (!isAdmin) return;

		// Return if already fetching
		if (loading) return;

		// If the cached data is present & valid (no older than one day),
		// don't fetch from the server.
		if (isValid && networkUsers?.userId && networkUsers?.userId === userId)
			return;

		// Fetch the earnings data from the server.
		fetchUsers();
	}, [isLoggedIn, accessToken, isOnboarding, isAdmin]);

	const value = useMemo(() => {
		return {
			networkCount,
			networkUsersList: networkUsers.networkUsersList,
			networkUsersTree,
			userTypeIdList,
			fetchedAt: networkUsers.asof,
			loading,
			refreshUserList,
		};
	}, [
		networkCount,
		networkUsers,
		networkUsersTree,
		userTypeIdList,
		loading,
		refreshUserList,
	]);

	return (
		<NetworkUsersContext.Provider value={value}>
			{children}
		</NetworkUsersContext.Provider>
	);
};

/**
 * Generate a tree structure from the list of users. The users have a parent-child relationship. The parent-child relationship is defined by the `parent_user_code` field in the user object, which equals the user_code of the parent.
 * @param {object[]} list - The list of users.
 * @param {Function} setNetworkUsersTree - The function to set the network users tree.
 * @param {Function} setUserTypeIdList - The function to set the available user-type-id list.
 */
const generateTree = (list, setNetworkUsersTree, setUserTypeIdList) => {
	const tree = {
		root: {
			index: "root",
			isFolder: true,
			children: ["superdists", "dists", "iretailers", "others"],
			// data: "Root item",
		},
		superdists: {
			index: "superdists",
			isFolder: true,
			rootCategory: true,
			children: [],
			data: UserTypeLabel[UserType.SUPER_DISTRIBUTOR],
		},
		dists: {
			index: "dists",
			isFolder: true,
			children: [],
			rootCategory: true,
			data: "Independent " + UserTypeLabel[UserType.DISTRIBUTOR],
		},
		iretailers: {
			index: "iretailers",
			isFolder: true,
			rootCategory: true,
			children: [],
			data: UserTypeLabel[UserType.I_MERCHANT],
		},
		others: {
			index: "others",
			isFolder: true,
			rootCategory: true,
			children: [],
			data: "Others",
		},
	};

	const _children = []; // To keep track of children (users with parents)
	const _userTypeIds = new Set(); // To keep track of available user-type-ids

	// First iteration over the list
	// - Add every user to the new tree structure in a flat manner (hierarchy will be established in next loop)
	// - Add top-level users to the top-level folders
	// - Mark available user-type-ids
	list.forEach((user) => {
		const { user_code, parent_user_code, user_type_id } = user;
		let parent = parent_user_code;

		// Mark available user-type-ids
		_userTypeIds.add(user_type_id);

		if (
			parent &&
			parent !== user_code &&
			user_type_id !== UserType.SUPER_DISTRIBUTOR
		) {
			// Children with a parent user...
			_children.push(user);
		} else {
			// Add to top-level folders based on user-type if parent is not defined
			switch (+user_type_id || 0) {
				case UserType.SUPER_DISTRIBUTOR:
					parent = "superdists";
					break;
				case UserType.DISTRIBUTOR:
					parent = "dists";
					break;
				case UserType.I_MERCHANT:
					parent = "iretailers";
					break;
				default:
					parent = "others";
			}

			// Assign children to the parent
			if (!tree[parent].children.includes(user_code)) {
				tree[parent].children.push(user_code);
				tree[parent].isFolder = true;
				if (tree[parent].count) {
					tree[parent].count += 1;
				} else {
					tree[parent].count = 1;
				}
			}
		}

		// Add user-list to tree
		tree[user_code] = {
			index: user_code,
			isFolder: false,
			children: [],
			meta: {
				...user,
				user_type:
					UserTypeLabel[user_type_id] ||
					"Type-" + (user_type_id || 0),
			},
			data:
				user.name +
				(parent === "others"
					? ` (${UserTypeLabel[user_type_id] || "Type-" + (user_type_id || 0)})`
					: ""),
		};
	});

	// Assign remaining children to parents...
	_children.forEach((user) => {
		const { user_code, parent_user_code } = user;
		if (tree[parent_user_code]) {
			tree[parent_user_code].children.push(user_code);
			tree[parent_user_code].isFolder = true;
			if (tree[parent_user_code].count) {
				tree[parent_user_code].count += 1;
			} else {
				tree[parent_user_code].count = 1;
			}
		}
	});

	// Remove top-level empty folders
	["superdists", "dists", "iretailers", "others"].forEach((key) => {
		if (tree[key].children.length === 0) {
			delete tree[key];
			// Remove from root.children
			tree.root.children = tree.root.children.filter(
				(item) => item !== key
			);
		}
	});

	// Save the network tree
	setNetworkUsersTree(tree);

	// Save available user-type-ids
	setUserTypeIdList([..._userTypeIds]);
};
