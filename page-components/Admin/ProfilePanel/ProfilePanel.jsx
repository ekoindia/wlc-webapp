import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Button, Headings, Icon, Menus } from "components";
import { ChangeRoleMenuList, Endpoints } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddressPane, CompanyPane, ContactPane, PersonalPane } from ".";

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
						border: "1px solid #FE9F00",
						boxShadow: "0px 3px 10px #FE9F0040",
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
				variant="ghost"
				color="accent.DEFAULT"
				px="none"
			>
				Change Role
			</Button>
		</Box>
	);
};

const ChangeRoleMobile = ({ changeRoleMenuList }) => {
	return (
		<Box bg="shade" w="100%" h="100vh" px="4" pt="12px">
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

const ProfilePanel = () => {
	const router = useRouter();
	const [agentData, setAgentData] = useState([]);
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const [changeRoleMenuList, setChangeRoleMenuList] = useState([]);
	const { accessToken } = useSession();
	const { mobile } = router.query;

	const hitQuery = () => {
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
			});
	};

	useEffect(() => {
		let _changeRoleMenuList = [];
		let tabIndex = 0;
		ChangeRoleMenuList.map(({ label, path, visibleString }) => {
			if (visibleString.includes(agentData?.agent_type)) {
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

	useEffect(() => {
		const storedData = JSON.parse(
			localStorage.getItem("network_seller_details")
		);
		if (storedData?.agent_mobile === mobile) {
			setAgentData(storedData);
		} else {
			hitQuery();
		}
	}, [mobile]);

	const panes = [
		{
			id: 1,
			comp: (
				<CompanyPane
					rowData={agentData?.profile}
					agent_name={agentData?.agent_name}
				/>
			),
		},
		{
			id: 2,
			comp: <AddressPane rowData={agentData?.address_details} />,
		},
		// {
		// 	id: 3,
		// 	comp: <DocPane rowData={agentData?.document_details} />,
		// },
		{
			id: 4,
			comp: <PersonalPane rowData={agentData?.personal_information} />,
		},
		{
			id: 5,
			comp: <ContactPane rowData={agentData?.contact_information} />,
		},
	];

	const menuHandler = () => {
		setIsMenuVisible((prev) => !prev);
	};

	return (
		<>
			<Headings
				title={isMenuVisible ? "Change Role" : "Agent Details"}
				propComp={
					changeRoleMenuList.length > 0 && (
						<ChangeRoleDesktop
							changeRoleMenuList={changeRoleMenuList}
							menuHandler={menuHandler}
						/>
					)
				}
				redirectHandler={isMenuVisible ? menuHandler : null}
				isCompVisible={!isMenuVisible}
			/>
			{isMenuVisible ? (
				<ChangeRoleMobile changeRoleMenuList={changeRoleMenuList} />
			) : (
				<Grid
					templateColumns={{
						base: "repeat(auto-fit,minmax(280px,0.90fr))",
						sm: "repeat(auto-fit,minmax(380px,0.90fr))",
						md: "repeat(auto-fit,minmax(360px,1fr))",
						lg: "repeat(auto-fit,minmax(450px,1fr))",
					}}
					justifyContent="center"
					py={{ base: "20px", md: "0px" }}
					gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
				>
					{panes.map((item) => (
						<GridItem key={item.id}>{item.comp}</GridItem>
					))}
				</Grid>
			)}
		</>
	);
};

export default ProfilePanel;
