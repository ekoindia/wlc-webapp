import {
	Box,
	Flex,
	SimpleGrid,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button, IcoButton } from "components";
import { OtherMenuItems } from "constants";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WidgetBase } from "..";

/**
 * A CommonTransaction component
 * Is a set of icon which have most common transaction done on platform
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<CommonTrxnWidget></CommonTrxnWidget>` TODO: Fix example
 */
const CommonTrxnWidget = () => {
	const router = useRouter();
	const { interactions } = useMenuContext();
	let { interaction_list } = interactions || {};
	let [finalList, setFinalList] = useState([]);
	const [showAll, setShowAll] = useState(false);

	// Max transaction to show by-default on the widget.
	// On small-screen, a "Show All" button is displayed.
	const limit = useBreakpointValue(
		{
			base: 3,
			md: 6, // interaction_list.length,
		},
		{ fallback: 3 }
	);

	// Max transactions to show when "Show All" is clicked
	const SHOW_ALL_LIMIT = 18;

	// Calculate final list to show...
	useEffect(() => {
		let trxnList = [],
			impOtherList = [];

		interaction_list.forEach((tx) => {
			if (OtherMenuItems?.indexOf(tx.id) === -1) {
				// Remove "Others..." category entries to get only the main transactions
				trxnList.push(tx);
			} else if (tx.imp === "1") {
				// Important "Others..." category items
				impOtherList.push(tx);
			}
		});

		if (trxnList.length && trxnList.length <= 2) {
			// If only 1 or 2 main transactions are available, they must be important (such as, complete onboarding)
			setFinalList(trxnList);
			return;
		}

		const trxnsToShow = [
			...trxnList,
			// TODO: Add "Transaction History" here (but it should not be the only option!)
			...impOtherList,
		];

		setFinalList(trxnsToShow);
	}, [interaction_list, OtherMenuItems]);

	const showAllButton = useBreakpointValue(
		{
			base: finalList?.length > 3 /* && !showAll */,
			md: false,
		},
		{ fallback: false }
	);

	const handleIconClick = (id) => {
		router.push(`transaction/${id}`);
	};

	if (!finalList?.length) {
		return null;
	}

	const title =
		finalList?.length <= 2
			? "Start Here"
			: finalList.length > limit
				? "Top Transactions"
				: "Transactions";

	return (
		<WidgetBase title={title}>
			<SimpleGrid
				columns="3"
				rowGap={{ base: "4", md: "10", "2xl": "16" }}
				justifyContent="center"
				textAlign="center"
				alignItems="flex-start"
			>
				{finalList
					.slice(0, showAll ? SHOW_ALL_LIMIT : limit)
					.map((transaction) => (
						<Box
							key={transaction.id}
							display="flex"
							flexDirection="column"
							alignItems="center"
							justifyContent="center"
							// pt={{ base: "22px" }}
							// borderRight={
							// 	index !== 2 && (index + 1) % 3
							// 		? "1px solid #E9EDF1"
							// 		: "none"
							// }
						>
							<IcoButton
								title={transaction.label}
								iconName={transaction.icon}
								size="md"
								theme="light"
								onClick={() => handleIconClick(transaction.id)}
								alignContent="center"
								alignItems="center"
							></IcoButton>
							<Text
								fontSize={{
									base: "xs",
									"2xl": "sm",
								}}
								color="primary.DEFAULT"
								pt="10px"
								noOfLines={2}
							>
								{transaction.label}
							</Text>
							{/*commission data not there*/}
							{/* <Text
									fontSize={{
										base: "11px",
										lg: "xs",
										xl: "xs",
										"2xl": "sm",
									}}
									color="shadow.dark"
									pt={{ base: "3px" }}
								>
									{transaction.commission}% Commission
								</Text> */}
						</Box>
					))}
			</SimpleGrid>
			{showAllButton && (
				<Flex
					justifyContent="center"
					alignItems="center"
					textAlign="center"
					pt={{ base: "24px", md: "0px" }}
				>
					<Button
						onClick={() => setShowAll((showAll) => !showAll)}
						justifyContent="center"
					>
						{showAll ? "- Show Less" : "+ Show All"}
					</Button>
				</Flex>
			)}
		</WidgetBase>
	);
};

export default CommonTrxnWidget;
