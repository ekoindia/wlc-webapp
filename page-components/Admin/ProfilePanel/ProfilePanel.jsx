import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Button, Icon, Menus, PageTitle } from "components";
import { ChangeRoleMenuList, Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";

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
	const router = useRouter();
	const [agentData, setAgentData] = useState({});
	const [agentDocuments, setAgentDocuments] = useState({});
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [changeRoleMenuList, setChangeRoleMenuList] = useState([]);
	const [fetchingData, setFetchingData] = useState(false); // Busy fetching data from server

	const { accessToken, isAdmin } = useSession();
	const { mobile } = router.query;

	// console.log("[ProfilePanel] agentData:", agentData);

	/**
	 * Helper function to fetch agent details from server
	 */
	const fetchAgentDetails = () => {
		setFetchingData(true);
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-req-uri-root-path": "/ekoicici/v1",
				"tf-req-uri": `/network/agents?record_count=1&search_value=${mobile}`,
				"tf-req-method": "GET",
			},
			token: accessToken,
		})
			.then((data) => {
				setAgentData(data?.data?.agent_details[0]);
			})
			.catch((error) => {
				// Handle any errors that occurred during the fetch
				console.error("[ProfilePanel] Get Agent Detail Error:", error);
			})
			.finally(() => {
				setFetchingData(false);
			});
	};

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
		ChangeRoleMenuList.map(({ label, path, visible }) => {
			if (visible.includes(+agentData?.user_type_id)) {
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
	}, [agentData?.agent_type, mobile]);

	/**
	 * Fetch agent details (agentData & agentDocuments) on component mount or when agent's mobile changes.
	 * If the details are cached in localStorage, use them instead of fetching from server.
	 * TODO: Instead of localStorage, use a Context to pass cached agent data from table to this page.
	 * MARK: Fetch Data
	 */
	useEffect(() => {
		const storedData = JSON.parse(
			localStorage.getItem("oth_last_selected_agent")
		);
		if (storedData?.agent_mobile === mobile) {
			setAgentData(storedData);
		} else {
			fetchAgentDetails();
		}

		if (agentDocuments && Object.keys(agentDocuments).length === 0) {
			fetchAgentDocuments();
		}
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
				<Flex direction="column" align="center" gap="2" mt="10">
					<Text color="light">Fetching Details...</Text>
				</Flex>
			) : null}

			{isAdmin && isMenuVisible ? (
				<ChangeRoleMobile changeRoleMenuList={changeRoleMenuList} />
			) : (
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
					{agentData
						? panes.map(({ id, comp }) => {
								const GridComponent = () => comp;
								return <GridComponent key={id} />;
							})
						: null}
				</Grid>
			)}
		</>
	);
};

export default ProfilePanel;
