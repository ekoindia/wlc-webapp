import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Button, Headings, Icon, Menus } from "components";
import { ChangeRoleMenu } from "constants/ChangeRoleMenu";
import useRequest from "hooks/useRequest";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";

const ChangeRoleDesktop = ({ menuHandler }) => {
	return (
		<Box>
			<Box display={{ base: "none", md: "block" }}>
				<Menus
					as={Button}
					type="everted"
					title="Change Role"
					menulist={ChangeRoleMenu}
					iconPos="right"
					iconName="caret-down"
					iconStyles={{ height: "10px", width: "14px" }}
					buttonStyle={{
						height: { md: "48px", lg: "64px" },
						width: { md: "180px", lg: "250px" },
						border: "1px solid #FE9F00",
						boxShadow: "0px 3px 10px #FE9F0040",
						fontSize: { md: "16px", lg: "20px" },
						textAlign: "left",
						borderRadius: "10px",
					}}
					listStyles={{
						height: "150px",
						width: "250px",
					}}
				/>
			</Box>
			<Button
				display={{ base: "block", md: "none" }}
				onClick={menuHandler}
				variant="ghost"
				color="primary.DEFAULT"
				px="none"
			>
				Change Role
			</Button>
		</Box>
	);
};
const ChangeRoleMobile = () => {
	return (
		<Box bg="shade" w="100%" h="100vh" px="4" pt="12px">
			{ChangeRoleMenu.map((ele, idx) => (
				<Link href={ele.path} key={ele.item}>
					<Flex
						w="100%"
						justify="space-between"
						py="6"
						borderBottom={
							idx === ChangeRoleMenu.length - 1 ? null : "card"
						}
					>
						<Text fontSize="1rem">{ele.item}</Text>
						<Icon name="chevron-right" color="light" />
					</Flex>
				</Link>
			))}
		</Box>
	);
};

const ProfilePanel = () => {
	const router = useRouter();
	const [rowData, setRowData] = useState([]);
	const { cellnumber } = router.query;
	// let rowData;
	// const agent_name = rowData?.agent_name || "";
	window.addEventListener("beforeunload", () => {
		localStorage.removeItem("rowData");
	});
	const headers = {
		"tf-req-uri-root-path": "/ekoicici/v1",
		"tf-req-uri": `/network/agents?record_count=10&search_value=${cellnumber}`,
		"tf-req-method": "GET",
	};
	const { data, mutate } = useRequest({
		method: "POST",
		baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do",
		headers: { ...headers },
	});

	// useEffect(() => {
	// 	mutate();
	// }, [cellnumber]);

	useEffect(() => {
		const storedData = localStorage.getItem("rowData");
		console.log("storedData", storedData);
		if (storedData) {
			setRowData(JSON.parse(storedData));
		} else {
			mutate();
		}
	}, []);

	useEffect(() => {
		setRowData(data?.data?.agent_details[0]);
	}, [data]);

	console.log("rowData", rowData);
	const panes = {
		0: (
			<CompanyPane
				rowData={rowData?.profile || {}}
				// agent_name={agent_name}
			/>
		),
		1: <AddressPane rowData={rowData?.address_details || {}} />,
		2: <DocPane rowData={rowData?.document_details || {}} />,
		3: <PersonalPane rowData={rowData?.personal_information || {}} />,
		4: <ContactPane rowData={rowData?.contact_information || {}} />,
	};
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	const menuHandler = () => {
		setIsMenuVisible((prev) => !prev);
	};

	return (
		<>
			<Headings
				title={isMenuVisible ? "Change Role" : "Seller Details"}
				propComp={<ChangeRoleDesktop menuHandler={menuHandler} />}
				redirectHandler={isMenuVisible ? menuHandler : null}
				isCompVisible={!isMenuVisible}
			/>
			{isMenuVisible ? (
				<ChangeRoleMobile />
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
					{Object.entries(panes).map(([key, value]) => (
						<GridItem key={key}>{value}</GridItem>
					))}
				</Grid>
			)}
		</>
	);
};

export default ProfilePanel;
