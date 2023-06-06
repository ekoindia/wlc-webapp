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
import { useState } from "react";
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
	let { interaction_list } = interactions;
	const [showAll, setShowAll] = useState(false);

	// Remove "other..." entries from the list
	interaction_list = interaction_list.filter(
		(tx) => OtherMenuItems.indexOf(tx.id) === -1
	);

	const breakpointValue = useBreakpointValue({
		base: 3,
		md: interaction_list.length,
	});

	const showAllButton = useBreakpointValue({
		base: interaction_list.length > 3 /* && !showAll */,
		md: false,
	});

	const showTransactions = showAll
		? interaction_list
		: interaction_list.slice(0, breakpointValue);

	const handleIconClick = (id) => {
		router.push(`transaction/${id}`);
	};

	if (!showTransactions.length) {
		return null;
	}

	return (
		<WidgetBase title="Most common transactions">
			<SimpleGrid
				columns="3"
				rowGap={{ base: "4", md: "10", "2xl": "16" }}
				justifyContent="center"
				textAlign="center"
				alignItems="flex-start"
			>
				{showTransactions.slice(0, 6).map((transaction) => (
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
							// size={{
							// 	base: "sm",
							// 	// md: "md",
							// 	// xl: "lg",
							// }}
							// iconStyle={{
							// 	width: {
							// 		base: "20px",
							// 		md: "24px",
							// 		xl: "30px",
							// 	},
							// 	height: {
							// 		base: "20px",
							// 		md: "24px",
							// 		xl: "30px",
							// 	},
							// }}
							// size={{
							// 	base: "48px",
							// 	xl: "56px",
							// 	"2xl": "64px",
							// }}
							theme="light"
							shape="circle"
							onClick={() => handleIconClick(transaction.id)}
							alignContent="center"
							alignItems="center"
						></IcoButton>
						<Text
							fontSize={{
								base: "xs",
								"2xl": "sm",
							}}
							color="accent.DEFAULT"
							pt="10px"
							noOfLines={2}
						>
							{transaction.label}
						</Text>
						{/*commision data not there*/}
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
