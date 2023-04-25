import {
	Accordion,
	AccordionButton,
	AccordionItem,
	AccordionPanel,
	Box,
	Flex,
	Text,
} from "@chakra-ui/react";
import { Button } from "components";
import { getNameStyle, getStatusStyle } from "helpers/TableHelpers";

/**
 * A <HistoryCard> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<HistoryCard></HistoryCard>` TODO: Fix example
 */
const HistoryCard = ({ item, rendererExpandedRow }) => {
	return (
		<>
			<Flex justifyContent="space-between">
				<Box color="accent.DEFAULT" fontSize={{ base: "md " }}>
					{getNameStyle(item.trx_name)}
				</Box>
				<Box color="accent.DEFAULT" fontSize={{ base: "md " }}>
					{getStatusStyle(item.status)}
				</Box>
			</Flex>
			<Flex direction="column" fontSize={{ base: "sm" }} pl="42px">
				<Flex gap="2">
					<Box as="span" color="light">
						Transaction ID:
					</Box>
					<Box as="span" color="dark">
						{item.trx_id}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Date:
					</Box>
					<Box as="span" color="dark">
						{item.date}
					</Box>
				</Flex>
				<Flex gap="2">
					<Box as="span" color="light">
						Time:
					</Box>
					<Box as="span" color="dark">
						{item.time}
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
