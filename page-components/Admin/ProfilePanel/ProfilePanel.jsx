import { Box, Flex, Grid, Spinner, Text } from "@chakra-ui/react";
import { Button, Icon, Menus, PageTitle } from "components";
import { Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import useChangeRoleOptions from "page-components/Admin/ChangeRole/useChangeRoleOptions";
import { useAgentDetails } from "page-components/Admin/Network/hooks";
import { lazy, Suspense, useEffect, useState } from "react";

// Lazy load pane components for better initial bundle size
const AddressPane = lazy(() =>
	import(".").then((module) => ({ default: module.AddressPane }))
);
const CompanyPane = lazy(() =>
	import(".").then((module) => ({ default: module.CompanyPane }))
);
const ContactPane = lazy(() =>
	import(".").then((module) => ({ default: module.ContactPane }))
);
const DocPane = lazy(() =>
	import(".").then((module) => ({ default: module.DocPane }))
);
const PersonalPane = lazy(() =>
	import(".").then((module) => ({ default: module.PersonalPane }))
);

/**
 * Loading fallback component for lazy-loaded panes
 * @returns {JSX.Element} Loading spinner
 */
const PaneLoadingFallback = () => (
	<Flex justify="center" align="center" p="8">
		<Spinner size="sm" color="primary.DEFAULT" />
	</Flex>
);

/**
 * Change Role Menu for Desktop View
 * @param {*} props - Props object
 * @param {Array} props.changeRoleMenuList - List of menu items for changing roles
 * @param {Function} props.menuHandler - Handler function for menu actions
 * @returns {JSX.Element} - The ChangeRoleDesktop component
 */
const ChangeRoleDesktop = ({ changeRoleMenuList, menuHandler }) => {
	return (
		<Box>
			<Box display={{ base: "none", md: "block" }}>
				<Menus
					as={Button}
					type="everted"
					title="Change Role"
					menulist={changeRoleMenuList}
					iconPos="right"
					iconName="caret-down"
					iconStyles={{ size: "xs" }}
					rounded="10px"
					buttonStyle={{
						height: { base: "48px", lg: "52px" },
						minW: { base: "150px", lg: "220px" },
						// border: "1px solid #FE9F00",
						// boxShadow: "0px 3px 10px #FE9F0040",
						textAlign: "left",
					}}
					listStyles={{
						width: "250px",
					}}
				/>
			</Box>
			<Button
				display={{ base: "block", md: "none" }}
				onClick={menuHandler}
				variant="link"
				color="accent.DEFAULT"
				px="none"
			>
				Change Role
			</Button>
		</Box>
	);
};

/**
 * Change Role Menu for Mobile View
 * @param {*} props - Props object
 * @param {Array} props.changeRoleMenuList - List of menu items for changing roles
 * @returns {JSX.Element} - The ChangeRoleMobile component
 */
const ChangeRoleMobile = ({ changeRoleMenuList }) => {
	return (
		<Box bg="shade" w="100%" h="100vh" px="4" mt="-10px">
			{changeRoleMenuList.map((ele, idx) => (
				<Flex
					w="100%"
					justify="space-between"
					key={ele.label}
					py="6"
					borderBottom={
						idx === changeRoleMenuList.length - 1 ? null : "card"
					}
					onClick={() => ele.onClick()}
				>
					<Text fontSize="1rem">{ele.label}</Text>
					<Icon name="chevron-right" color="light" />
				</Flex>
			))}
		</Box>
	);
};

/**
 * Display user/agent profile panel (page) with multiple data panes.
 * This is intended for Admins or any sub-network owner such as distributor to view the profile of their sub-network users/agents.
 * MARK: ProfilePanel
 * @returns {JSX.Element} - The ProfilePanel component
 */
const ProfilePanel = () => {
	const { AGENT_VIEW_TABS } = useChangeRoleOptions();
	const router = useRouter();
	const [agentDocuments, setAgentDocuments] = useState({});
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [changeRoleMenuList, setChangeRoleMenuList] = useState([]);

	const { accessToken, isAdmin } = useSession();
	const { mobile } = router.query;

	// Use the agent details hook with session caching
	const {
		agent: agentData,
		loading: fetchingData,
		error: agentError,
	} = useAgentDetails(mobile);

	// console.log("[ProfilePanel] agentData:", agentData);

	/**
	 * Helper function to fetch agent documents from server
	 */
	const fetchAgentDocuments = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}&document=1`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((data) => {
				setAgentDocuments(data?.data?.cspDetails);
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[ProfilePanel] Get Agent Detail Error:", error);
			});
	};

	/**
	 * Filter "Change Role" menu list based on agent type
	 * MARK: Filter Change Role
	 */
	useEffect(() => {
		let _changeRoleMenuList = [];
		let tabIndex = 0;
		AGENT_VIEW_TABS.forEach(({ label, path, allowedUserTypes }) => {
			if (allowedUserTypes.includes(+agentData?.user_type_id)) {
				let _listItem = {};
				_listItem.label = label;
				_listItem.onClick = (() => {
					const index = tabIndex;
					return () => {
						router.push(`${path}?mobile=${mobile}&tab=${index}`);
					};
				})();
				_changeRoleMenuList.push(_listItem);
				tabIndex = tabIndex + 1;
			}
		});
		setChangeRoleMenuList(_changeRoleMenuList);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [agentData?.agent_type, agentData?.user_type_id, mobile]);

	/**
	 * Fetch agent documents when mobile changes or when agentDocuments is empty
	 * MARK: Fetch Data
	 */
	useEffect(() => {
		if (mobile && Object.keys(agentDocuments).length === 0) {
			fetchAgentDocuments();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mobile]);

	// MARK: Data Panes
	const panes = [
		{
			id: 1,
			comp: (
				<CompanyPane
					data={{
						...agentData?.profile,
						agent_name: agentData?.agent_name,
						agent_type: agentData?.agent_type,
						user_id: agentData?.user_id,
						user_type_id: agentData?.user_type_id,
						account_status: agentData?.account_status,
						docs: agentDocuments,
					}}
				/>
			),
		},
		{
			id: 2,
			comp: (
				<AddressPane
					data={{
						...agentData?.address_details,
						address: [
							agentData?.line_1,
							agentData?.line_2,
							agentData?.location,
							agentData?.status,
							agentData?.zip,
						]
							.filter((value) => value)
							.join(", "),
					}}
				/>
			),
		},
		{
			id: 3,
			comp: <DocPane documentData={agentDocuments} />,
		},
		{
			id: 4,
			comp: (
				<PersonalPane
					data={{
						...agentData?.profile,
						...agentData?.personal_information,
					}}
				/>
			),
		},
		{
			id: 6,
			comp: (
				<ContactPane
					data={{
						...agentData?.contact_information,
						agent_mobile: agentData?.agent_mobile,
					}}
				/>
			),
		},
	];

	const menuHandler = () => {
		setIsMenuVisible((prev) => !prev);
	};

	// MARK: JSX
	return (
		<>
			<PageTitle
				title={isMenuVisible ? "Change Role" : "Details"}
				toolComponent={
					isAdmin && changeRoleMenuList.length > 0 ? (
						<ChangeRoleDesktop
							changeRoleMenuList={changeRoleMenuList}
							menuHandler={menuHandler}
						/>
					) : null
				}
				onBack={isMenuVisible ? menuHandler : null}
				hideToolComponent={isMenuVisible}
			/>

			{fetchingData ? (
				<Flex
					direction="column"
					align="center"
					justify="center"
					gap="4"
					mt="20"
					minH="400px"
				>
					<Spinner
						size="xl"
						color="primary.DEFAULT"
						thickness="4px"
					/>
					<Text color="light" fontSize="md">
						Fetching Agent Details...
					</Text>
				</Flex>
			) : agentError ? (
				<Flex
					direction="column"
					align="center"
					justify="center"
					gap="4"
					mt="20"
					minH="400px"
				>
					<Icon name="error" size="xl" color="light" />
					<Text color="dark" fontSize="lg" fontWeight="semibold">
						Agent Not Found
					</Text>
					<Text color="light" fontSize="sm">
						The requested agent could not be found.
					</Text>
					<Button size="sm" onClick={() => router.back()}>
						Go Back
					</Button>
				</Flex>
			) : isAdmin && isMenuVisible ? (
				<ChangeRoleMobile changeRoleMenuList={changeRoleMenuList} />
			) : agentData ? (
				<Suspense fallback={<PaneLoadingFallback />}>
					<Grid
						templateColumns={{
							base: "repeat(auto-fit,minmax(300px,0.90fr))",
							// sm: "repeat(auto-fit,minmax(380px,0.90fr))",
							md: "repeat(auto-fit,minmax(360px,1fr))",
							"2xl": "repeat(auto-fit,minmax(450px,1fr))",
						}}
						justifyContent="center"
						py={{ base: "4", md: "0px" }}
						gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
					>
						{panes.map(({ id, comp }) => {
							const GridComponent = () => comp;
							return <GridComponent key={id} />;
						})}
					</Grid>
				</Suspense>
			) : null}
		</>
	);
};

export default ProfilePanel;
