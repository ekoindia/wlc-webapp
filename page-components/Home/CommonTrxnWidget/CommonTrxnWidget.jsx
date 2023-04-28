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

	const showAllButton = useBreakpointValue({
		base: interaction_list.length > 3 && !showAll,
		sm: interaction_list.length > 3 && !showAll,
		md: false,
		lg: false,
		xl: false,
	});

	const showTransactions = showAll
		? interaction_list
		: interaction_list.slice(0, breakpointValue);

	const handleIconClick = (id) => {
		router.push(`transaction/${id}`);
	};
	return (
		<div>
			<Flex
				minH={{
					base: "auto",
					sm: "auto",
					md: "387px",
					lg: "300px",
					xl: "387px",
				}}
				maxH={{
					base: "auto",
					sm: "auto",
					md: "387px",
					lg: "400px",
					xl: "387px",
				}}
				minW={{
					base: "auto",
					sm: "auto",
					md: "380px",
					lg: "360px",
					xl: "350px",
				}}
				maxW={{
					base: "auto",
					sm: "auto",
					md: "1000px",
					lg: "400px",
					xl: "580px",
				}}
				borderRadius={{
					base: "10px 10px 10px 10px",
					sm: "10px 10px 10px 10px",
					md: "10px",
				}}
				background={"white"}
				direction={"column"}
				// align={{
				// 	base: "flex-start",
				// }}
				rowGap={{
					base: "20px",
					sm: "30px",
					md: "50px",
					lg: "20px",
					xl: "10px",
				}}
				px={{
					base: "20px",
					sm: "40px",
					md: "18px",
					lg: "15px",
					xl: "15px 10px",
				}}
				py={{
					base: "12px",
					sm: "30px",
					md: "18px",
					lg: "14px",
					xl: "15px",
				}}
				m={{ base: "18px", sm: "10px", md: "0px" }}
			>
				<Box p={{ base: "0px 20px 0px 20px", md: "0px 0px 0px 0px" }}>
					<Text as="b" fontSize={{ base: "sm", md: "md" }}>
						Most common transactions
					</Text>
				</Box>
				<SimpleGrid
					columns={{ base: 3, sm: 3, md: 3 }}
					spacing={{ md: "4", lg: "4", xl: "8" }}
					justifyContent="center"
					alignItems="center"
					textAlign="center"
				>
					{showTransactions.map((transaction, index) => (
						<>
							<Box
								key={index}
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="center"
								// borderRight={
								// 	index !== 2 && (index + 1) % 3
								// 		? "1px solid #E9EDF1"
								// 		: "none"
								// }
							>
								<IcoButton
									title={transaction.label}
									iconName={
										index < 5
											? transaction.icon
											: "more-horiz"
									}
									iconStyle={{
										width: "30px",
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
										lg: "sm",
										xl: "sm",
										"2xl": "md",
									}}
									color="accent.DEFAULT"
									pt={{ base: "10px" }}
								>
									{transaction.label}
								</Text>
								<Text
									fontSize={{
										base: "11px",
										lg: "xs",
										xl: "xs",
										"2xl": "sm",
									}}
									color="shadow.dark"
									pt={{ base: "3px" }}
								>
									2% Commission
								</Text>
							</Box>
						</>
					))}
				</SimpleGrid>
				{showAllButton && (
					<Flex
						justifyContent="center"
						alignItems="center"
						textAlign="center"
					>
						<Button
							onClick={() => setShowAll(true)}
							justifyContent="center"
						>
							+ Show All
						</Button>
					</Flex>
				)}
			</Flex>
		</div>
	);
};

export default CommonTrxnWidget;
