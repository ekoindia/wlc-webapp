import { Box, Flex, Text /* Checkbox, Stack */ } from "@chakra-ui/react";
import { UserType /*, UserTypeLabel */ } from "constants";
import { useNetworkUsers } from "contexts";
import { useEffect, useMemo, useState } from "react";
import {
	UncontrolledTreeEnvironment,
	Tree,
	StaticTreeDataProvider,
} from "react-complex-tree";
import useHslColor from "hooks/useHslColor";
import { FaRegUser } from "react-icons/fa6";
import { FcBusinessman, FcManager } from "react-icons/fc";
import { MdFolderShared } from "react-icons/md";
import { RiEBike2Fill } from "react-icons/ri";
import { getInitials } from "utils/textFormat";
import { NetworkMenuWrapper } from "./NetworkMenuWrapper";
import "react-complex-tree/lib/style-modern.css";
// import { useSet } from "hooks";

/**
 * Show network users in an expandable tree view.
 * TODO: Add caching mechanism for the network users data in the NetworkUserContext.
 * TODO: Move logic for list to tree conversion from NetworkUsersContext to here so that data filtering can be done effectively, and the tree can be updated on the fly.
 */
const NetworkTreeView = () => {
	const [selectedItem, setSelectedItem] = useState(null);
	// const [userTypeFilterList, setUserTypeFilterList] = useState([]);
	// const filteredUserSet = useSet([]); // filteredUserTypes, setFilteredUserTypes

	const {
		networkCount,
		networkUsersTree,
		refreshUserList,
		// userTypeIdList,
		fetchedAt,
		loading,
	} = useNetworkUsers();

	// Fetch Network User List as a tree when tree-view is visible
	useEffect(() => {
		if (fetchedAt === null && !loading) {
			refreshUserList();
		}
	}, [fetchedAt]);

	// Prepare the Tree View Data for react-complex-tree component
	const dataProvider = useMemo(
		() =>
			new StaticTreeDataProvider(networkUsersTree, (item, data) => ({
				...item,
				data,
			})),
		[networkUsersTree]
	);

	// Prepare the User-Type Filter
	// useEffect(() => {
	// 	if (userTypeIdList.length > 0) {
	// 		// Set all user types as selected by default
	// 		filteredUserSet.set([...userTypeIdList]);

	// 		// Create list of options for the filter checkboxes
	// 		const _userTypeFilterList = userTypeIdList.map((userTypeId) => ({
	// 			value: userTypeId,
	// 			label: UserTypeLabel[userTypeId] || "Type " + userTypeId,
	// 		}));
	// 		setUserTypeFilterList(_userTypeFilterList);
	// 	}
	// }, [userTypeIdList]);

	return (
		<>
			<Flex
				className="test"
				direction={{ base: "column", lg: "row" }}
				w="100%"
				gap={5}
			>
				{/* MARK: Tree Box */}
				<Box
					flex="3"
					maxW="100%"
					maxH={{ base: "400px", md: "100%" }}
					overflowY="auto"
					bg="white"
					p={2}
					borderRadius={6}
					sx={{
						"--rct-item-height": "42px",
						"--rct-arrow-size": "14px",
						"--rct-arrow-container-size": "20px",
						// "--rct-bar-color": "red",
						".rct-tree-item-button": {
							fontSize: "14px",
						},
					}}
				>
					<UncontrolledTreeEnvironment
						dataProvider={dataProvider}
						getItemTitle={(item) => item.data}
						// 	(item.data || item.meta.mobile) +
						// 	(item.isFolder && item.count ? ` [${item.count}]` : "")
						// }
						viewState={{}}
						renderItemTitle={({ item }) => (
							<NetworkTreeItem {...item} />
						)}
						canDragAndDrop={false}
						disableMultiselect={true}
						onSelectItems={(items) =>
							items &&
							items[0] &&
							items[0] in networkUsersTree &&
							setSelectedItem &&
							setSelectedItem(networkUsersTree[items[0]])
						}
					>
						<Tree
							treeId="tree-network"
							rootItem="root"
							treeLabel="Network Tree"
						/>
					</UncontrolledTreeEnvironment>
				</Box>

				<Box
					flex="2"
					order={{ base: -1, lg: 1 }}
					maxW="100%"
					boxSizing="border-box"
					color="light"
				>
					<Flex
						direction="column"
						gap={3}
						position={{ lg: "fixed" }}
						top={{ lg: "268px" }}
					>
						{/* MARK: Filters */}
						{/* <Box
						w={{ base: "100%", lg: "unset" }}
						minW="280px"
						bg="white"
						p={{ base: 3, md: 6 }}
						borderRadius={6}
						shadow="md"
					>
						<Stack spacing={2} direction="column">
							{userTypeFilterList.map((userType, i) => (
								<Checkbox
									key={userType.value || i}
									value={userType.value}
									isChecked={filteredUserSet.has(
										userType.value
									)}
									onChange={(e) => {
										e.target.checked
											? filteredUserSet.add(
													+userType.value
												)
											: filteredUserSet.delete(
													+userType.value
												);
									}}
								>
									{userType.label}
								</Checkbox>
							))}
						</Stack>
					</Box> */}

						{/* MARK: Info */}
						<Box
							w={{ base: "100%", lg: "unset" }}
							minW="280px"
							bg="white"
							p={{ base: 3, md: 6 }}
							borderRadius={6}
							shadow="md"
						>
							{selectedItem ? (
								selectedItem.rootCategory ? (
									<Text>
										Expand the category and select a user to
										view details
									</Text>
								) : (
									<Flex
										direction="column"
										gap={2}
										fontSize="14px"
									>
										<Flex direction="row" gap="15px">
											<Text
												flex={1}
												fontWeight="bold"
												fontSize="1.2em"
												mb={2}
											>
												{selectedItem?.meta?.name}
											</Text>
											{selectedItem?.meta?.mobile &&
											selectedItem?.meta?.user_code ? (
												<NetworkMenuWrapper
													mobile_number={
														selectedItem?.meta
															?.mobile
													}
													eko_code={
														selectedItem?.meta
															?.user_code
													}
													// account_status_id
													agent_type={
														selectedItem?.meta
															?.user_type
													} // TODO: use user-type-id in NetworkMenuWrapper
												/>
											) : null}
										</Flex>
										<Box>
											<strong>Type: </strong>
											{selectedItem?.meta?.user_type}
										</Box>
										<Box>
											<strong>Mobile: </strong>
											{selectedItem?.meta?.mobile}
										</Box>
										<Box>
											<strong>User Code: </strong>
											{selectedItem?.meta?.user_code}
										</Box>
									</Flex>
								)
							) : (
								<Text textStyle="italics">
									You have{" "}
									<strong>{networkCount} users</strong> in
									your network.
									<br />
									<br />
									Expand/select an item for details.
								</Text>
							)}
						</Box>
					</Flex>
				</Box>
			</Flex>

			<Text
				fontSize="xxs"
				color="light"
				mt="2em"
				width="100%"
				textAlign="center"
			>
				<strong>Last Updated:</strong>{" "}
				{new Date(fetchedAt).toLocaleString()}
			</Text>
		</>
	);
};

/**
 * Network Tree Item (Title) component
 * @param {object} props
 * @param {object} props.user User object (tree item)
 * @param props.data
 * @param props.count
 * @param props.isFolder
 * @param props.rootCategory
 * @param props.meta
 */
const NetworkTreeItem = ({
	data,
	count,
	isFolder = false,
	rootCategory = false,
	meta = {},
}) => {
	if (!(data || meta)) return null;

	return (
		<Flex direction="row" align="center" gap="10px">
			<UserTypeIcon
				rootCategory={rootCategory}
				user_type={meta?.user_type || data || "Others"}
				user_type_id={meta?.user_type_id || 0}
			/>
			<Text textTransform="capitalize">
				{(data || meta.mobile || "").toString().toLowerCase()}
			</Text>
			{isFolder && count ? (
				<Flex
					align="center"
					justify="center"
					borderRadius="full"
					bg="#DDD"
					color="#666"
					fontSize="0.7em"
					px="0.4em"
					minW="15px"
					minH="15px"
				>
					{count}
				</Flex>
			) : null}
		</Flex>
	);
};

/**
 * Tree item logo: show a folder icon for root folders or an avatar based on the user-type
 * @param {object} props
 * @param {boolean} props.rootCategory - Whether the item is a root category folder
 * @param {string} props.user_type - Type of the user
 * @param {number} props.user_type_id - ID of the user type
 */
function UserTypeIcon({ rootCategory, user_type, user_type_id }) {
	const { h } = useHslColor(user_type);

	if (rootCategory) {
		return (
			<MdFolderShared
				size="28px"
				color={`hsl(${h},80%,30%)`}
				title={`${user_type} Folder`}
			/>
		);
	}

	let IconComponent = null;
	let size = "20px";

	switch (user_type_id) {
		case UserType.SUPER_DISTRIBUTOR:
			IconComponent = FcBusinessman;
			break;
		case UserType.DISTRIBUTOR:
			IconComponent = FcManager;
			break;
		case UserType.FOS:
			IconComponent = RiEBike2Fill;
			size = "18px";
			break;
		default:
			IconComponent = FaRegUser; // Default icon
			size = "14px";
	}

	const initials = getInitials(user_type, 2);

	return (
		<Flex
			rounded="full"
			align="center"
			justify="center"
			width="28px"
			height="28px"
			border={`2px solid hsl(${h},80%,90%)`}
			bg={`hsl(${h},80%,95%)`}
			color={`hsl(${h},80%,30%)`}
			position="relative"
		>
			<IconComponent size={size} title={user_type} />
			<Flex
				align="center"
				justify="center"
				position="absolute"
				bottom="-4px"
				right="-4px"
				rounded="full"
				bg={`hsl(${h},80%,30%)`}
				color="white"
				fontSize="0.5em"
				fontWeight="700"
				minW="14px"
				minH="14px"
			>
				{initials}
			</Flex>
		</Flex>
	);
}

export default NetworkTreeView;
