import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Avatar,
	Box,
	Flex,
	Text,
} from "@chakra-ui/react";
import { Button, Icon } from "components";
import { useMenuContext } from "contexts";
import { getPaymentStyle, getStatusStyle } from "helpers/TableHelpers";
import useHslColor from "hooks/useHslColor";
import { formatDateTime } from "libs";

/**
 * A <HistoryCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<HistoryCard></HistoryCard>` TODO: Fix example
 */
const HistoryCard = ({ item, rendererExpandedRow }) => {
	const { interactions } = useMenuContext();
	const { trxn_type_prod_map } = interactions;
	const txicon = trxn_type_prod_map?.[item.tx_typeid]?.icon || null;
	const { h } = useHslColor(item.tx_name);

	return (
		<>
			<Flex align="center">
				<Avatar
					size="sm"
					name={txicon ? null : item.tx_name}
					mr="8px"
					border={`2px solid hsl(${h},80%,90%)`}
					bg={`hsl(${h},80%,95%)`}
					color={`hsl(${h},80%,30%)`}
					icon={
						<Icon
							size="sm"
							name={txicon}
							// color={`hsl(${h},80%,30%)`}
						/>
					}
				/>
				<Flex direction="column" flexGrow={1}>
					<Box fontSize="0.6em" color="light">
						{formatDateTime(item.datetime)}
					</Box>
					<Box
						color="accent.DEFAULT"
						fontWeight="semibold"
						fontSize="sm"
					>
						{item.tx_name}
					</Box>
					<Box fontWeight="medium" fontSize="xs">
						{getPaymentStyle(item.amount, item.trx_type, "right")}
					</Box>
				</Flex>
				<Box color="accent.DEFAULT" fontSize={{ base: "md" }}>
					{getStatusStyle(item.status, "History")}
				</Box>
			</Flex>
			<Flex direction="column" fontSize={{ base: "xs" }} pl="42px">
				<Flex gap="2">
					<Box as="span" color="light">
						TID:
					</Box>
					<Box as="span" color="dark">
						{item.tid}
					</Box>
				</Flex>
			</Flex>
			<Flex w="100%">
				<Accordion allowMultiple w="100%">
					<AccordionItem
						fontSize={{ base: "sm" }}
						border="none"
						pl="42px"
					>
						{({ isExpanded }) => (
							<>
								{!isExpanded && (
									<AccordionButton px="0">
										<Text
											fontWeight="semibold"
											textColor="primary.DEFAULT"
											fontSize={{ base: "sm" }}
										>
											...Show More
										</Text>
									</AccordionButton>
								)}
								<AccordionPanel p="0">
									<Flex direction="column">
										{rendererExpandedRow?.map(
											(ele) =>
												item[ele.name] && (
													<>
														<Flex gap={2}>
															<Text color="light">
																{ele.field}:
															</Text>
															<Text color="dark">
																{item[ele.name]}
															</Text>
														</Flex>
													</>
												)
										)}
									</Flex>
									<Flex justify="space-between">
										{isExpanded && (
											<AccordionButton px="0">
												<Text
													fontWeight="semibold"
													textColor="primary.DEFAULT"
													fontSize={{ base: "sm" }}
												>
													...Show Less
												</Text>
											</AccordionButton>
										)}
										<Button
											w={{
												base: "80px",
											}}
											h={{
												base: "32px",
											}}
											fontSize={{
												base: "sm",
											}}
											disabled
										>
											Repeat
										</Button>
									</Flex>
								</AccordionPanel>
							</>
						)}
					</AccordionItem>
				</Accordion>
			</Flex>
		</>
	);
};

export default HistoryCard;
