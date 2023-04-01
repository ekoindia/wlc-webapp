import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	HStack,
	StackDivider,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Buttons, Divider, Headings, Icon, Menus } from "components";
import { ChangeRoleMenu } from "constants/ChangeRoleMenu";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";
import { useState } from "react";
import Link from "next/link";

const ChangeRoleDesktop = ({ menuHandler, ...rest }) => {
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
			<Buttons
				title="Change Role"
				display={{ base: "block", md: "none" }}
				onClick={menuHandler}
				variant=""
				color="primary.DEFAULT"
				px="none"
			/>
		</Box>
	);
};
const ChangeRoleMobile = ({ menuHandler, ...rest }) => {
	return (
		<Box bg="shade" w="100%" h="100vh" px="4" mt="12px">
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

const ProfilePanel = (props) => {
	const [isMenuVisible, setIsMenuVisible] = useState(false);
	function menuHandler() {
		setIsMenuVisible((prev) => !prev);
	}

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
						lg: "repeat(auto-fit,minmax(490px,1fr))",
					}}
					justifyContent="center"
					py={{ base: "20px", md: "0px" }}
					gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
				>
					<GridItem>
						<CompanyPane />
					</GridItem>
					<GridItem>
						<AddressPane />
					</GridItem>
					<GridItem>
						<DocPane />
					</GridItem>
					<GridItem>
						<PersonalPane />
					</GridItem>
					<GridItem>
						<ContactPane />
					</GridItem>
				</Grid>
			)}
		</>
	);
};

export default ProfilePanel;
