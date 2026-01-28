import { Flex, Grid, Text } from "@chakra-ui/react";
import { Icon } from "components";
import Link from "next/link";
import {
	AccountSummary,
	AppDetails,
	EarningSummary,
	ManageMyAccountCard,
	PersonalDetailCard,
	ProfileWidget,
	ShopCard,
} from ".";

/**
 * A <Profile> component
 * TODO: Write more description here
 * @example	`<Profile></Profile>` TODO: Fix example
 */
const Profile = () => {
	const widgets = [
		{ id: 10, component: ProfileWidget },
		{ id: 20, component: AppDetails },
		{ id: 30, component: ManageMyAccountCard },
		{ id: 40, component: EarningSummary },
		{ id: 50, component: ShopCard },
		{ id: 60, component: PersonalDetailCard },
		{ id: 70, component: AccountSummary },
	];

	return (
		<div>
			<Grid
				templateColumns={{
					base: "repeat(auto-fill,minmax(280px,1fr))",
					md: "repeat(auto-fill,minmax(340px,1fr))",
					// xl: "repeat(auto-fill,minmax(440px,1fr))",
				}}
				justifyContent="center"
				py={{ base: "20px", md: "0px" }}
				gap={{ base: (2, 2), md: (4, 2), lg: (4, 6) }}
				width={"100%"}
			>
				{widgets.map(({ id, component: Component }) => (
					<Component key={id} />
				))}
			</Grid>

			<Flex
				pos="absolute"
				bottom="6px"
				right="6px"
				fontWeight="medium"
				fontSize="xs"
				color="dark"
				opacity="0.5"
			>
				<Link href="/privacy" prefetch={false}>
					<Flex gap="1" align="center">
						<Text display="inline" lineHeight="1">
							Privacy Policy
						</Text>
						<Icon name="open-in-new" size="xs" />
					</Flex>
				</Link>
			</Flex>
		</div>
	);
};
//TODO user type id 2,3 --> Retailer -- shop details

export default Profile;
