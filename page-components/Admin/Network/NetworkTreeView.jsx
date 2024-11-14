import { Box, Flex, Text, Avatar, Checkbox, Stack } from "@chakra-ui/react";
import { Icon } from "components";
import { UserTypeLabel } from "constants";
import { useNetworkUsers } from "contexts";
import { useSet } from "hooks";
import { useEffect, useMemo, useState } from "react";
import {
	UncontrolledTreeEnvironment,
	Tree,
	StaticTreeDataProvider,
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";

/**
 * Show network users in an expandable tree view.
 */
const NetworkTreeView = () => {
	const [selectedItem, setSelectedItem] = useState(null);
	const [userTypeFilterList, setUserTypeFilterList] = useState([]);
	const filteredUserSet = useSet([]); // filteredUserTypes, setFilteredUserTypes

	const {
		networkCount,
		networkUsersTree,
		refreshUserList,
		userTypeIdList,
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
	useEffect(() => {
		if (userTypeIdList.length > 0) {
			// Set all user types as selected by default
			filteredUserSet.set([...userTypeIdList]);

			// Create list of options for the filter checkboxes
			const _userTypeFilterList = userTypeIdList.map((userTypeId) => ({
				value: userTypeId,
				label: UserTypeLabel[userTypeId] || "Type " + userTypeId,
			}));
			setUserTypeFilterList(_userTypeFilterList);
		}
	}, [userTypeIdList]);

	return (
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
			>
				<Flex
					direction="column"
					gap={3}
					position={{ lg: "fixed" }}
					top={{ lg: "268px" }}
				>
					{/* MARK: Filters */}
					<Box
						w={{ base: "100%", lg: "unset" }}
						minW="280px"
						bg="white"
						p={{ base: 3, md: 6 }}
						borderRadius={6}
						opacity={0.6}
						shadow="md"
					>
						{/* <CheckboxGroup
						// defaultValue={[...userTypeIdList]}
						// value={[...filteredUserTypes]}
						// onChange={(values) => {
						// 	console.log("Selected values::: ", values);

						// 	// setFilteredUserTypes([...values]);
						// }}
						> */}
						<Stack spacing={2} direction="column">
							{userTypeFilterList.map((userType) => (
								<Checkbox
									key={userType.value}
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
						{/* </CheckboxGroup> */}
					</Box>

					{/* MARK: Info */}
					<Box
						w={{ base: "100%", lg: "unset" }}
						minW="280px"
						bg="white"
						p={{ base: 3, md: 6 }}
						borderRadius={6}
						opacity={0.6}
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
									<Text
										fontWeight="bold"
										fontSize="1.2em"
										mb={2}
									>
										{selectedItem?.meta?.name}
									</Text>
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
								You have <strong>{networkCount} users</strong>{" "}
								in your network.
								<br />
								<br />
								Expand/select an item for details.
							</Text>
						)}
					</Box>
				</Flex>
			</Box>
		</Flex>
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
			<NetworkTreeItemLogo
				rootCategory={rootCategory}
				user_type={meta?.user_type || "Others"}
			/>
			<Text>{data || meta.mobile}</Text>
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
 * Network Tree Item Logo component
 * @param {object} props
 * @param {boolean} props.rootCategory - Whether the item is a root category
 * @param {string} props.user_type - Type of the user
 */
const NetworkTreeItemLogo = ({ rootCategory, user_type }) => {
	// const userTypeAvatarMap = {
	// 	[UserType.DISTRIBUTOR]: "distributor",
	// 	2: "retailer",
	// 	3: "independent-retailer",
	// };

	return rootCategory ? (
		<Icon name="folder-open" size="md" color="light" />
	) : (
		<Avatar
			size="xs"
			name={user_type}
			// icon={<Icon size="16px" name={icon} color="white" />}
			// {...avatarTheme}
		/>
	);
};

export default NetworkTreeView;
