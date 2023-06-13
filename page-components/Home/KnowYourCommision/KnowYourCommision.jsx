import { Avatar, Flex, Text, useBreakpointValue } from "@chakra-ui/react";
import { Icon } from "components";
import { useCommisionSummary, useSession } from "contexts";
import { useRouter } from "next/router";
import { WidgetBase } from "..";
/**
 * A <KnowYourCommision> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<KnowYourCommision></KnowYourCommision>` TODO: Fix example
 */
const KnowYourCommision = () => {
	const router = useRouter();
	const { accessToken } = useSession();
	// const [data, setData] = useState([]);
	const limit = useBreakpointValue({
		base: 5,
		md: 10,
	});

	const commisionData = useCommisionSummary();
	console.log("DATAAtCOMM", commisionData);
	// {
	// 	commisionData.map = (userData) => {
	// 		console.log("DataATCommision", userData);
	// 	};
	// }

	// useEffect(() => {
	// fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + "/transactions/do", {
	// 	body: {
	// 		interaction_type_id: TransactionTypes.GET_TRANSACTION_HISTORY,
	// 		start_index: 0,
	// 		limit: limit,
	// 	},
	// 	token: accessToken,
	// }).then((data) => {
	// 	const tx_list = (data?.data?.transaction_list ?? []).map((tx) => {
	// 		const amt = tx.amount_dr || tx.amount_cr || 0;
	// 		return {
	// 			tid: tx.tid,
	// 			name: tx.tx_name,
	// 			desc:
	// 				tx.tx_name +
	// 				(amt ? ` of ₹${amt}` : "") +
	// 				(tx.customer_mobile
	// 					? ` for ${tx.customer_mobile}`
	// 					: ""),
	// 		};
	// 	});
	// 	setData(tx_list);
	// });

	// }, []);

	const handleShowHistory = (id) => {
		// router.push("/commissions/" + id);
		// router.push("/commissions/[id]", `/commissions/${id}`);
		router.push(`/commissions/${id}`);
		console.log("valueATCommisoin", id);
	};

	// if (!data.length) {
	// 	return null;
	// }

	return (
		<WidgetBase title="Know Your Commissions">
			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", md: "scroll" }}
				rowGap={{ base: "19px", md: "10px" }}
			>
				{commisionData?.data?.pricing_commission_data.map((tx) => (
					<Flex
						key={tx.tid}
						p="8px 8px 8px 0px"
						pr={{ base: "8px", md: "4px" }}
						align="center"
						justify="center"
						borderBottom="1px solid #F5F6F8"
					>
						<Avatar
							size={{ base: "sm", md: "md" }}
							border="2px solid #D2D2D2"
							name={tx.product}
						/>
						<Flex
							alignItems="center"
							justifyContent="space-between"
							w="100%"
							ml="10px"
						>
							<Flex direction="column">
								<Text
									fontSize={{
										base: "xs",
										md: "sm",
									}}
									fontWeight="medium"
									noOfLines={1}
								>
									{tx.product}
								</Text>
							</Flex>
							<Flex
								justifyContent="space-between"
								alignItems="center"
								ml={2}
								onClick={() => handleShowHistory(tx.product)}
								cursor="pointer"
							>
								<Icon
									size="12px"
									name="arrow-forward"
									color="primary.DEFAULT"
								/>
							</Flex>
						</Flex>
					</Flex>
				))}
			</Flex>
		</WidgetBase>
	);
};

export default KnowYourCommision;
