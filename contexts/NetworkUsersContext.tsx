import { useCopilotReadable } from "@copilotkit/react-core";
import { Endpoints } from "constants/EndPoints";
import { UserType, UserTypeLabel } from "constants/UserTypes";
import { useSession } from "contexts/UserContext";
import { useApiFetch, useDailyCacheState } from "hooks";
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

/**
 * Interface for a single network user.
 */
export interface NetworkUser {
	user_code: string;
	parent_user_code?: string;
	user_type_id: number;
	name: string;
	[key: string]: any;
}

/**
 * Interface for the structure of the context value.
 */
interface NetworkUsersContextValue {
	networkCount: number;
	networkUsersList: NetworkUser[];
	networkUsersTree: Record<string, TreeNode>;
	userTypeIdList: number[];
	fetchedAt: string | null;
	loading: boolean;
	refreshUserList: () => void;
}

/**
 * Interface for a tree node.
 */
interface TreeNode {
	index: string;
	isFolder: boolean;
	children: string[];
	rootCategory?: boolean;
	count?: number;
	data?: string;
	meta?: Record<string, any>;
}

const NetworkUsersContext = createContext<NetworkUsersContextValue | undefined>(
	undefined
);

/**
 * Custom hook to use the NetworkUsers context.
 */
export const useNetworkUsers = (): NetworkUsersContextValue => {
	const context = useContext(NetworkUsersContext);
	if (!context) {
		throw new Error(
			"useNetworkUsers must be used within a NetworkUsersProvider"
		);
	}
	return context;
};

/**
 * Provider component for the NetworkUsers context.
 * This component fetches and provides the network users data to its children.
 * It also generates a tree structure from the list of users and provides various utility functions.
 * MARK: Context
 * @param {ReactNode} children - The child components that will have access to the NetworkUsers context.
 * @returns {JSX.Element} The NetworkUsersProvider component that wraps its children
 */
export const NetworkUsersProvider = ({
	children,
}: {
	children: ReactNode;
}): JSX.Element => {
	const [networkUsers, setNetworkUsers, isValid] = useDailyCacheState(
		"inf-netusrs",
		{
			networkUsersList: [],
			asof: null,
			userId: "",
		}
	);
	const [networkCount, setNetworkCount] = useState<number>(0);
	const [networkUsersTree, setNetworkUsersTree] = useState<
		Record<string, TreeNode>
	>({});
	const [userTypeIdList, setUserTypeIdList] = useState<number[]>([]);
	const [activeUserTypeCount, setActiveUserTypeCount] = useState<
		Record<number, number>
	>({});

	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId } =
		useSession();

	// MARK: Fetch Users
	const [fetchUsers, loading] = useApiFetch(Endpoints.TRANSACTION, {
		onSuccess: (res) => {
			if (res?.data?.csp_list) {
				setNetworkUsers({
					networkUsersList: res.data.csp_list,
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
			setUserTypeIdList,
			setActiveUserTypeCount
		);
	}, [networkUsers.networkUsersList]);

	/**
	 * Fetch the network users data from the server.
	 */
	const refreshUserList = useCallback(() => {
		if (!isLoggedIn || !accessToken || isOnboarding) return;
		if (!isAdmin || loading) return;
		if (isValid && networkUsers?.userId === userId) return;
		fetchUsers({
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": "/network/agent-list",
				"tf-req-method": "GET",
			},
		});
	}, [
		isLoggedIn,
		accessToken,
		isOnboarding,
		isAdmin,
		loading,
		isValid,
		userId,
	]);

	// MARK: Copilot...

	// Define AI Copilot readable state for the total user count
	const copilotReadableUserCountId = useCopilotReadable({
		description: "Total number of users in this network.",
		value: networkCount,
	});

	const test = Object.keys(activeUserTypeCount).map((key) => ({
		label: UserTypeLabel[key] || `UserType-${key}`,
		count: activeUserTypeCount[key],
	}));

	console.log("Active User Type Count:", test);

	// Define AI Copilot readable state for the network users count based on user type
	useCopilotReadable({
		description: "Count of active users by user type.",
		parentId: copilotReadableUserCountId,
		value: Object.keys(activeUserTypeCount)
			?.map((key) => ({
				userType: UserTypeLabel[key] || `Type-${key}`,
				count: activeUserTypeCount[key],
			}))
			?.reduce((acc, curr) => {
				acc[curr.userType] = curr.count;
				return acc;
			}, {}),
	});

	// MARK: Value
	const value = useMemo<NetworkUsersContextValue>(
		() => ({
			networkCount,
			networkUsersList: networkUsers.networkUsersList,
			networkUsersTree,
			userTypeIdList,
			activeUserTypeCount,
			fetchedAt: networkUsers.asof,
			loading,
			refreshUserList,
		}),
		[
			networkCount,
			networkUsers,
			networkUsersTree,
			userTypeIdList,
			activeUserTypeCount,
			loading,
			refreshUserList,
		]
	);

	return (
		<NetworkUsersContext.Provider value={value}>
			{children}
		</NetworkUsersContext.Provider>
	);
};

/**
 * Generate a tree structure from the list of users.
 * MARK: Get Tree
 * @param list - The list of users.
 * @param setNetworkUsersTree - The function to set the network users tree.
 * @param setUserTypeIdList - The function to set the available user-type-id list.
 * @param setActiveUserTypeCount
 */
const generateTree = (
	list: NetworkUser[],
	setNetworkUsersTree: (_tree: Record<string, TreeNode>) => void,
	setUserTypeIdList: (_ids: number[]) => void,
	setActiveUserTypeCount: (_count: Record<number, number>) => void
): void => {
	const activeUserTypeCount = {};

	const tree: Record<string, TreeNode> = {
		root: {
			index: "root",
			isFolder: true,
			children: ["superdists", "dists", "iretailers", "others"],
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
			rootCategory: true,
			children: [],
			data: `Independent ${UserTypeLabel[UserType.DISTRIBUTOR]}`,
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

	const _children: NetworkUser[] = [];
	const _userTypeIds = new Set<number>();

	list.forEach((user) => {
		const { user_code, parent_user_code, user_type_id, name } = user;
		let parent = parent_user_code;
		_userTypeIds.add(user_type_id);

		// Add user-type-wise count of active users
		activeUserTypeCount[user_type_id] =
			(activeUserTypeCount[user_type_id] || 0) + 1;

		if (
			parent &&
			parent !== user_code &&
			user_type_id !== UserType.SUPER_DISTRIBUTOR
		) {
			_children.push(user);
		} else {
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

			if (!tree[parent].children.includes(user_code)) {
				tree[parent].children.push(user_code);
				tree[parent].isFolder = true;
				tree[parent].count = (tree[parent].count || 0) + 1;
			}
		}

		tree[user_code] = {
			index: user_code,
			isFolder: false,
			children: [],
			meta: {
				...user,
				user_type:
					UserTypeLabel[user_type_id] || `Type-${user_type_id || 0}`,
			},
			data:
				name +
				(parent === "others"
					? ` (${UserTypeLabel[user_type_id] || `Type-${user_type_id || 0}`})`
					: ""),
		};
	});

	_children.forEach((user) => {
		const { user_code, parent_user_code } = user;
		if (tree[parent_user_code]) {
			tree[parent_user_code].children.push(user_code);
			tree[parent_user_code].isFolder = true;
			tree[parent_user_code].count =
				(tree[parent_user_code].count || 0) + 1;
		}
	});

	["superdists", "dists", "iretailers", "others"].forEach((key) => {
		if (tree[key]?.children.length === 0) {
			delete tree[key];
			tree.root.children = tree.root.children.filter(
				(item) => item !== key
			);
		}
	});

	setNetworkUsersTree(tree);
	setUserTypeIdList(Array.from(_userTypeIds));
	setActiveUserTypeCount(activeUserTypeCount);
};
