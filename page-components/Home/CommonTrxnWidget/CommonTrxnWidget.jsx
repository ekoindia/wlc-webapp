import {
	Box,
	Flex,
	SimpleGrid,
	Text,
	useBreakpointValue,
} from "@chakra-ui/react";
import { Button, IcoButton } from "components";
import { useMenuContext } from "contexts/MenuContext";
import { useRouter } from "next/router";
import { useState } from "react";
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
	const { interaction_list } = interactions;
	const [showAll, setShowAll] = useState(false);

	const breakpointValue = useBreakpointValue({
		base: 3,
		md: interaction_list.length,
	});

	const showTransactions = showAll
		? interaction_list
		: interaction_list.slice(0, breakpointValue);

	const handleIconClick = (id) => {
		router.push(`transaction/${id}`);
	};
	return (
		<>
			{interaction_list.length > 0 ? (
				<Flex
					w={{ base: "90%", md: "100%" }}
					h={{
						base: "auto",
						md: "387px",
					}}
					direction="column"
					background="white"
					p="5"
					borderRadius="10px"
					m={{ base: "16px", md: "auto" }}
				>
					<Box>
						<Text as="b" fontSize={{ base: "sm", md: "md" }}>
							Most common transactions
						</Text>
					</Box>
					<SimpleGrid
						columns={3}
						spacingX={{ base: "auto", md: "'100px'" }}
						spacingY="20px"
						justifyContent="center"
						textAlign="center"
						alignItems="flex-start"
					>
						{showTransactions
							.slice(0, 6)
							.map((transaction, index) => (
								<>
									<Box
										key={index}
										display="flex"
										flexDirection="column"
										alignItems="center"
										justifyContent="center"
										pt={{ base: "22px" }}
										// borderRight={
										// 	index !== 2 && (index + 1) % 3
										// 		? "1px solid #E9EDF1"
										// 		: "none"
										// }
									>
										<IcoButton
											title={transaction.label}
											iconName={transaction.icon}
											iconStyle={{
												width: { base: "30px" },
												height: "30px",
											}}
											size={{
												base: "48px",
												lg: "56px",
												xl: "64px",
											}}
											theme="light"
											rounded="full"
											onClick={() =>
												handleIconClick(transaction.id)
											}
											alignContent="center"
											alignItems="center"
										></IcoButton>
										<Text
											fontSize={{
												base: "11px",
												md: "sm",
												"2xl": "md",
											}}
											color="accent.DEFAULT"
											pt={{ base: "10px" }}
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
								</>
							))}
					</SimpleGrid>
					{interaction_list.length > 3 ? (
						<Flex
							justifyContent="center"
							alignItems="center"
							textAlign="center"
							pt={{ base: "24px", md: "0px" }}
							display={{ base: "block", md: "none" }}
						>
							<Button
								onClick={() => setShowAll(!showAll)}
								justifyContent="center"
							>
								{showAll ? "- Show Less" : "+ Show All"}
							</Button>
						</Flex>
					) : null}
				</Flex>
			) : null}
		</>
	);
};

export default CommonTrxnWidget;
