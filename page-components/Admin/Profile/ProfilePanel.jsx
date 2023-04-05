import { Box, Button, Grid, GridItem } from "@chakra-ui/react";
import { Menus } from "components";
import { ChangeRoleMenu } from "constants";
import { useEffect } from "react";
import {
	AddressPane,
	CompanyPane,
	ContactPane,
	DocPane,
	PersonalPane,
} from ".";

const changeRoleButton = () => {
	return (
		<Box>
			<Menus
				as={Button}
				type="everted"
				title="Change Role"
				menulist={ChangeRoleMenu}
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
				listStyles={{
					height: "150px",
					width: "250px",
				}}
			/>
		</Box>
	);
};

const ProfilePanel = (props) => {
	const storedData = localStorage.getItem("rowData");
	const rowData = storedData ? JSON.parse(storedData) : null;
	// console.log(rowData, "rowData");
	const companypane = rowData.profile;
	const addresspane = rowData.address_details;
	const documentpane = rowData.document_details;
	const personalpane = rowData.personal_information;
	const contactpane = rowData.contact_information;

	// console.log(companypane, "companyPane");
	// console.log(addresspane, "addresspane");
	// console.log(documentpane, "documentpane");
	// console.log(personalpane, "personalpane");
	// console.log(contactpane, "contactpane");
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
				<CompanyPane rowdata={companypane} />
			</GridItem>
			<GridItem>
				<AddressPane rowdata={addresspane} />
			</GridItem>
			<GridItem>
				<DocPane rowdata={documentpane} />
			</GridItem>
			<GridItem>
				<PersonalPane rowdata={personalpane} />
			</GridItem>
			<GridItem>
				<ContactPane rowdata={contactpane} />
			</GridItem>
		</Grid>
	);
};

export default ProfilePanel;
