import { Divider, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";
import { TransactionIds } from "constants/EpsTransactions";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

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
	const { role_tx_list } = interactions;
	const dataLength = data.length;

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

		const mma_tx_list = []; // storing transaction list

		group_interaction_ids.forEach((id) => {
			if (id in role_tx_list) {
				mma_tx_list.push({ id: id, ...role_tx_list[id] });
			}
		});

		setData(mma_tx_list); // set the new array to the data state
	}, [role_tx_list]);

	const OnClick = (id) => {
		router.push(`transaction/${TransactionIds.MANAGE_MY_ACCOUNT}/${id}`);
	};

	return (
		<Flex
			w="100%"
			h={{ base: "400px" }}
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

			<Flex direction="column" mt="20px" rowGap="10px" overflow="auto">
				{data.map((tx, idx) => (
					<Fragment key={tx.id}>
						<Flex
							align="center"
							justify="space-between"
							onClick={OnClick}
						>
							<Text fontSize={{ base: "16px" }}>{tx.label}</Text>
							<Icon name="chevron-right" w="8px" />
						</Flex>
						{dataLength > idx + 1 ? <Divider /> : null}
					</Fragment>
				))}
			</Flex>
		</Flex>
	);
};

export default ManageMyAccountCard;
