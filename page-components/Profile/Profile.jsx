import { Grid, GridItem } from "@chakra-ui/react";
import {
	ManageMyAccountCard,
	PersonalDetailCard,
	ProfileWidget,
	ShopCard,
} from ".";

/**
 * A <Profile> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<Profile></Profile>` TODO: Fix example
 */
const Profile = ({ prop1, ...rest }) => {
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fit,minmax(280px,0.90fr))",
				sm: "repeat(auto-fit,minmax(380px,0.90fr))",
				md: "repeat(auto-fit,minmax(360px,1fr))",
				xl: "repeat(auto-fit,minmax(440px,1fr))",
			}}
			justifyContent="center"
			py={{ base: "20px", md: "0px" }}
			gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
			{...rest}
		>
			<GridItem>
				<ProfileWidget />
			</GridItem>
			<GridItem>
				<ManageMyAccountCard />
			</GridItem>
			<GridItem>
				<ShopCard />
			</GridItem>
			<GridItem>
				<PersonalDetailCard />
			</GridItem>
		</Grid>
	);
};
//TODO user type id 2,3 --> seller -- shop details

export default Profile;
