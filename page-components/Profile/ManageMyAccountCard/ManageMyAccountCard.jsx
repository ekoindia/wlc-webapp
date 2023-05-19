import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";
import { TransactionIds } from "constants/EpsTransactions";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { WidgetBase } from "page-components/Home";
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

		group_interaction_ids = group_interaction_ids.split(",").map(Number);

		const mma_tx_list = [];

		group_interaction_ids.forEach((id) => {
			if (id in role_tx_list) {
				mma_tx_list.push({ id: id, ...role_tx_list[id] });
			}
		});

		setData(mma_tx_list);
	}, [role_tx_list]);

	const onClick = (id) => {
		router.push(
			`transaction/${TransactionIds.MANAGE_MY_ACCOUNT}/` +
				(id ? `${id}` : "")
		);
	};

	return (
		<WidgetBase title="Manage My Account" noPadding>
			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", md: "scroll" }}
			>
				{data.map((tx) => (
					<Fragment key={tx.id}>
						<Flex
							align="center"
							justify="space-between"
							p="8px 16px"
							cursor="pointer"
							_hover={{ bg: "darkShade" }}
							borderBottom="1px solid #F5F6F8"
							onClick={() => onClick(tx.id)}
						>
							<Text fontSize={{ base: "14px" }}>{tx.label}</Text>
							<Icon name="chevron-right" size="8px" />
						</Flex>
					</Fragment>
				))}
			</Flex>
		</WidgetBase>
	);
};

export default ManageMyAccountCard;
