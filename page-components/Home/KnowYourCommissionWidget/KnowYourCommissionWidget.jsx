import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useCommissionSummary, useUser } from "contexts";
import useHslColor from "hooks/useHslColor";
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

	const { isLoggedIn, isAdminAgentMode, isAdmin } = useUser();

	const commissionProductIds = Object.keys(commissionData?.data || {});

	if (!commissionProductIds.length) return null;

	// const uniqueCommissionData = commissionData?.data.filter(
	// 	(value, index, self) =>
	// 		index === self.findIndex((item) => item.product === value.product)
	// );

	const handleShowDetail = (id) => {
		if (id) {
			const prefix = isAdmin && isAdminAgentMode ? "/admin" : "";
			router.push(`${prefix}/commissions/${id}`);
		}
	};

	if (!isLoggedIn) return null;

	return (
		<WidgetBase title="Know Your Commissions" noPadding>
			<Flex
				direction="column"
				className="customScrollbars"
				overflowY={{ base: "none", md: "scroll" }}
			>
				{commissionProductIds?.map((id, index) => {
					const prod = commissionData?.data?.[id];
					return (
						<>
							<Tr
								key={id}
								id={id}
								prod={prod}
								handleShowDetail={handleShowDetail}
							/>
							{commissionProductIds?.length - 1 !== index ? (
								<Divider />
							) : null}
						</>
					);
				})}
			</Flex>
		</WidgetBase>
	);
};

/**
 * Internal table-row component
 * @param root0
 * @param root0.id
 * @param root0.prod
 * @param root0.handleShowDetail
 */
const Tr = ({ id, prod, handleShowDetail }) => {
	const { h } = useHslColor(prod.label);

	return (
		<Flex
			p="8px 4px 8px 16px"
			pr={{ base: "8px", md: "4px" }}
			align="center"
			justify="center"
			// borderBottom="1px solid #F5F6F8"
		>
			<Avatar
				size={{ base: "sm", md: "md" }}
				name={prod.icon ? null : prod.label}
				border={`2px solid hsl(${h},80%,85%)`}
				bg={`hsl(${h},80%,95%)`}
				color={`hsl(${h},80%,30%)`}
				icon={
					<Icon
						size={{ base: "sm", md: "md" }}
						name={prod.icon}
						color={`hsl(${h},80%,30%)`}
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
};

export default KnowYourCommission;
