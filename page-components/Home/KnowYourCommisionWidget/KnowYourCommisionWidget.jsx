import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useCommisionSummary } from "contexts";
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

	const commisionData = useCommisionSummary();

	const uniqueCommisionData = commisionData?.pricing_commission_data.filter(
		(value, index, self) =>
			index === self.findIndex((item) => item.product === value.product)
	);

	const handleShowDetail = (id) => {
		if (id) {
			router.push(`/commissions/${id.toLowerCase()}`);
		}
	};

	return (
		<WidgetBase title="Know Your Commissions">
			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", md: "scroll" }}
				rowGap={{ base: "19px", md: "10px" }}
			>
				{uniqueCommisionData?.map((tx) => (
					<Flex
						key={tx.id}
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
								onClick={() => handleShowDetail(tx.product)}
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
