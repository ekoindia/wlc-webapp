import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import { Menus } from "components";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";

const changeRoleButton = () => {
	const router = useRouter();
	const menuList = [
		{
			item: "Transfer Merchants",
			onClick: function () {
				router.push("/admin/my-network/profile/change-role?tab=0");
			},
		},
		{
			item: "Promote Csp To Scsp",
			onClick: function () {
				router.push("/admin/my-network/profile/change-role?tab=1");
			},
		},
		{
			item: "Demote Distributor",
			onClick: function () {
				router.push("/admin/my-network/profile/change-role?tab=2");
			},
		},
		{
			item: "Upgrade Merchant To I-Merchant",
			onClick: function () {
				router.push("/admin/my-network/profile/change-role?tab=3");
			},
		},
	];
	return (
		<Box>
			<Menus
				as={Button}
				type="everted"
				title="Change Role"
				menulist={menuList}
				iconPos="right"
				iconName="arrow-down"
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
				listStyles={{ height: "150px", width: "250px" }}
			/>
		</Box>
	);
};

const ProfilePanel = (props) => {
	const { setComp } = props;

	useEffect(() => {
		setComp(changeRoleButton);
	}, []);

	return (
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
	);
};

export default ProfilePanel;
