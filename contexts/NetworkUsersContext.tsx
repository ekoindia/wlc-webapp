import { Endpoints } from "constants/EndPoints";
import { UserType, UserTypeOrder } from "constants/UserTypes";
import { useUser } from "contexts/UserContext";
import { useApiFetch, useDailyCacheState, useUserTypes } from "hooks";
import { useCopilotInfo } from "libs";
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
 * Custom hook to use the `NetworkUsersContext`.
 * Provides a list of all users in the network, including a nested tree view for the same.
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

	const { isLoggedIn, isAdmin, isOnboarding, accessToken, userId, userData } =
		useUser();
	const { userDetails } = userData ?? {};
	const { code } = userDetails ?? {};

	const { userTypeLabels } = useUserTypes();

	// MARK: Fetch Users
	const [fetchUsers, loading] = useApiFetch(Endpoints.TRANSACTION, {
		onSuccess: (res) => {
			if (res?.data?.csp_list) {
				setNetworkUsers({
					networkUsersList: res.data.csp_list,
					asof: Date.now(),
					userId,
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
			userTypeLabels,
			code,
			setNetworkUsersTree,
			setUserTypeIdList,
			setActiveUserTypeCount
		);
	}, [networkUsers.networkUsersList, userTypeLabels, code]);

	/**
	 * Fetch the network users data from the server.
	 */
	const refreshUserList = useCallback(() => {
		if (!isLoggedIn || !accessToken || isOnboarding) return;
		if (loading) return;
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

	/**
	 * Return a list of (grand) parents for any user. Used in UserProfile to show the hierarchy.
	 * @param userCode - The user code of the user whose parents are to be found.
	 * @returns An array of NetworkUser objects representing the (grand) parents of the user.
	 */
	const getParents = useCallback(
		(userCode: string): NetworkUser[] => {
			// Get parents from the networkUsersTree data
			if (!networkUsers?.networkUsersList?.length || !userCode) return [];

			const parents: NetworkUser[] = [];
			let user = networkUsersTree[userCode];

			while (
				user &&
				user?.meta?.parent_user_code &&
				user?.meta?.parent_user_code !== userCode &&
				user?.meta?.parent_user_code !== "root"
			) {
				const parent = networkUsersTree[user.meta.parent_user_code];
				if (parent && parent?.rootCategory !== true) {
					parents.push(parent.meta as NetworkUser);
					user = parent;
				} else {
					break;
				}
			}

			return parents;
		},
		[networkUsers, networkUsersTree]
	);

	// MARK: Copilot...

	// Define AI Copilot readable state for the total user count
	const copilotReadableUserCountId = useCopilotInfo({
		description: "Total number of users in this network.",
		value: networkCount,
	});

	// Define AI Copilot readable state for the network users count based on user type
	useCopilotInfo({
		description: "Count of active users by user-type.",
		parentId: copilotReadableUserCountId,
		value: Object.keys(activeUserTypeCount)
			?.map((key) => ({
				userType: userTypeLabels[key] || `Type-${key}`,
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
			getParents,
		}),
		[
			networkCount,
			networkUsers,
			networkUsersTree,
			userTypeIdList,
			activeUserTypeCount,
			loading,
			refreshUserList,
			getParents,
		]
	);

	return (
		<NetworkUsersContext.Provider value={value}>
			{children}
		</NetworkUsersContext.Provider>
	);
};

/**
 * Convert user-type-id to a slug for the tree node.
 * @param id
 */
const userTypeIdToSlug = (id: number): string => `type-${id}`;

/**
 * Generate a tree structure from the list of users.
 * MARK: Get Tree
 * @param list - The list of users.
 * @param userTypeLabels
 * @param code - The UserCode of the current user (to determine root nodes).
 * @param setNetworkUsersTree - The function to set the network users tree.
 * @param setUserTypeIdList - The function to set the available user-type-id list.
 * @param setActiveUserTypeCount
 */
const generateTree = (
	list: NetworkUser[],
	userTypeLabels: Record<number, string>,
	code: string,
	setNetworkUsersTree: (_tree: Record<string, TreeNode>) => void,
	setUserTypeIdList: (_ids: number[]) => void,
	setActiveUserTypeCount: (_count: Record<number, number>) => void
): void => {
	const activeUserTypeCount = {};

	// Array of top-level user-type node slugs (for the Tree view) for all available UserTypes (eg: type-1, type-2, etc.)
	const topUserTypeNodeIds = UserTypeOrder.map((type) =>
		userTypeIdToSlug(type)
	);

	// Object of top-level user-type nodes (for the Tree view) for all available UserTypes
	const topUserTypeNodes = UserTypeOrder.reduce(
		(acc, type) => {
			acc[userTypeIdToSlug(type)] = {
				index: userTypeIdToSlug(type),
				isFolder: true,
				rootCategory: true,
				children: [],
				data: userTypeLabels[type],
			};
			return acc;
		},
		{} as Record<string, TreeNode>
	);

	// TODO: Ordering can be done based on the depth in the hierarchy (eg: Super-Distributor at top, as it will have max depth of children - distributors, FOS, Merchants, etc.)
	const tree: Record<string, TreeNode> = {
		root: {
			index: "root",
			isFolder: true,
			children: [...topUserTypeNodeIds, "others"],
		},
		...topUserTypeNodes,
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

	// Generate tree from list...
	list.forEach((user) => {
		const {
			user_code,
			parent_user_code,
			user_type_id,
			name,
			fos_user_code,
		} = user;
		let parent = parent_user_code;
		_userTypeIds.add(user_type_id);

		if (
			(user_type_id == UserType.MERCHANT ||
				user_type_id == UserType.I_MERCHANT) &&
			fos_user_code
		) {
			// If the user is a Merchant and has a FOS assigned, set the parent to FOS
			parent = fos_user_code;
		} else if (parent === code) {
			// If the parent is the current user, set parent to "root"
			parent = "";
		}

		// Add user-type-wise count of active users
		activeUserTypeCount[user_type_id] =
			(activeUserTypeCount[user_type_id] || 0) + 1;

		if (
			parent &&
			parent !== user_code &&
			user_type_id !== UserType.SUPER_DISTRIBUTOR
		) {
			// This is a child node. Store it temporarily to link later
			_children.push({
				...user,
				parent_user_code: parent,
			});
		} else {
			// This is a root node. Determine its category based on user_type_id
			parent = userTypeIdToSlug(user_type_id);
			if (!topUserTypeNodeIds.includes(parent)) {
				parent = "others";
			}

			// Add this user as a child of the parent node
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
				parent_user_code: parent,
				user_type:
					userTypeLabels[user_type_id] || `Type-${user_type_id || 0}`,
			},
			data: name, // +
			// (parent === "others"
			// 	? ` (${userTypeLabels[user_type_id] || `Type-${user_type_id || 0}`})`
			// 	: ""),
		};
	});

	// Now, link children to their parents
	_children.forEach((user) => {
		const { user_code, parent_user_code } = user;
		if (tree[parent_user_code]) {
			tree[parent_user_code].children.push(user_code);
			tree[parent_user_code].isFolder = true;
			tree[parent_user_code].count =
				(tree[parent_user_code].count || 0) + 1;
		}
	});

	// Clean up any empty root categories
	[...topUserTypeNodeIds, "others"].forEach((key) => {
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
