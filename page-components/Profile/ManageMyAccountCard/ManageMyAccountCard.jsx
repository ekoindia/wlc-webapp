import { Flex, Text } from "@chakra-ui/react";
import { TransactionIds } from "constants/EpsTransactions";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

/**
 * A <ManageMyAccountCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<ManageMyAccountCard></ManageMyAccountCard>` TODO: Fix example
 */
const ManageMyAccountCard = () => {
	const { interactions } = useMenuContext();
	const router = useRouter();
	const [data, setData] = useState([]);
	console.log("data", data);
	const { role_tx_list } = interactions;
	console.log("role_tx_list", role_tx_list[TransactionIds.MANAGE_MY_ACCOUNT]);

	useEffect(() => {
		if (!role_tx_list[TransactionIds.MANAGE_MY_ACCOUNT]) {
			return;
		}
		//getting group_interaction_ids from recharge & bill payment
		let group_interaction_ids =
			role_tx_list[TransactionIds.MANAGE_MY_ACCOUNT]
				.group_interaction_ids;
		// str to array
		group_interaction_ids = group_interaction_ids.split(",").map(Number);

		const temp = []; // create a new array to store the new data

		group_interaction_ids.forEach((id) => {
			if (id in role_tx_list) {
				temp.push(role_tx_list[id]); // push each new element to the new array
			}
		});

		setData(temp); // set the new array to the data state
	}, [role_tx_list]);

	const OnClick = (id) => {
		router.push(`transaction/${TransactionIds.MANAGE_MY_ACCOUNT}/${id}`);
	};

	return (
		<Flex
			w="100%"
			h={{ base: "240px", sm: "350px", md: "387px", lg: "400px" }}
			bg="white"
			direction="column"
			borderRadius="10px"
			border="1px solid #D2D2D2"
			boxShadow="0px 5px 15px #0000000D"
			p="5"
		>
			<Text fontWeight="semibold" fontSize={{ base: "18px" }}>
				Manage My Account
			</Text>
		</Flex>
	);
};

export default ManageMyAccountCard;
