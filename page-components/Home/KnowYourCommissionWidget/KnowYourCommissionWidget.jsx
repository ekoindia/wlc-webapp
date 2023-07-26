import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useCommissionSummary } from "contexts";
import { useRouter } from "next/router";
import { WidgetBase } from "..";
/**
 * A <KnowYourCommission> component
 * TODO: Write more description here
 * @param 	{object}	prop	Properties passed to the component
 * @param	{string}	prop.prop1	TODO: Property description.
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<KnowYourCommission></KnowYourCommission>` TODO: Fix example
 */
const KnowYourCommission = () => {
	const router = useRouter();

	const commissionData = useCommissionSummary();

	const commissionProductIds = Object.keys(commissionData?.data || {});

	if (!commissionProductIds.length) return null;

	// const uniqueCommissionData = commissionData?.data.filter(
	// 	(value, index, self) =>
	// 		index === self.findIndex((item) => item.product === value.product)
	// );

	const handleShowDetail = (id) => {
		if (id) {
			router.push(`/commissions/${id}`);
		}
	};

	return (
		<WidgetBase title="Know Your Commissions">
			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", md: "scroll" }}
			>
				{commissionProductIds?.map((id) => {
					const prod = commissionData?.data?.[id];
					return (
						<Flex
							key={id}
							p="6px 6px 6px 0px"
							pr={{ base: "8px", md: "4px" }}
							align="center"
							justify="center"
							borderBottom="1px solid #F5F6F8"
						>
							<Avatar
								size={{ base: "sm", md: "md" }}
								border={prod.icon ? null : "2px solid #D2D2D2"}
								name={prod.icon ? null : prod.label}
								bg={prod.icon ? "gray.200" : null}
								icon={
									<Icon
										size={{ base: "sm", md: "md" }}
										name={prod.icon}
										color="primary.DEFAULT"
									/>
								}
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
										{prod.label}
									</Text>
								</Flex>
								<Flex
									justifyContent="space-between"
									alignItems="center"
									ml={2}
									onClick={() => handleShowDetail(id)}
									cursor="pointer"
								>
									<Text
										color="accent.DEFAULT"
										pr="6px"
										display={{ base: "none", md: "block" }}
										fontSize="sm"
									>
										Details
									</Text>
									<Icon
										size="12px"
										name="arrow-forward"
										color="accent.DEFAULT"
									/>
								</Flex>
							</Flex>
						</Flex>
					);
				})}
			</Flex>
		</WidgetBase>
	);
};

export default KnowYourCommission;
