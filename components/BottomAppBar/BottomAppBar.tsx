import { Flex, Text } from "@chakra-ui/react";
import { useUser } from "contexts";
import { useRouter } from "next/router";
import { Icon } from "..";

/**
 * A <BottomAppBar> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<BottomAppBar></BottomAppBar>` TODO: Fix example
 */
const BottomAppBar = () => {
	const { isAdmin } = useUser();
	const router = useRouter();

	const menuList = [
		{
			name: "Home",
			label: "Home",
			icon: "home",
			perform: () => {
				const prefix = isAdmin ? "/admin" : "";
				router.push(`${prefix}/`);
			},
		},
		{
			name: "History",
			label: "History",
			icon: "transaction-history",
			perform: () => {
				const prefix = isAdmin ? "/admin" : "";
				router.push(`${prefix}/history`);
			},
		},
		{
			name: "Search",
			label: "Search",
			icon: "search",
			perform: () => {
				// open global search
			},
		},
		{
			name: "Network",
			label: "Network",
			icon: "refer",
			perform: () => {
				router.push(`/admin/my-network/`);
			},
			showAdmin: true,
		},
		{
			name: "Other",
			label: "Other",
			icon: "supervisor-account",
			perform: () => {
				// open modal here asking admin to change user mode
			},
			showAdmin: true,
		},
	];

	return (
		<Flex
			bg="white"
			w="100%"
			pos="absolute"
			align="center"
			justify="space-between"
			bottom="0"
			left="0"
			right="0"
			p="8px 16px 4px 16px"
			boxShadow="0px 6px 10px #00000033"
		>
			{menuList.map(({ icon, name, label, perform }, index) => {
				return (
					<Flex
						key={`${index}-${name}`}
						direction="column"
						align="center"
						justify="center"
						gap="1"
						onClick={perform}
					>
						<Icon name={icon} key={name} color="primary.dark" />
						<Text fontSize="xs">{label}</Text>
					</Flex>
				);
			})}
		</Flex>
	);
};

export default BottomAppBar;
