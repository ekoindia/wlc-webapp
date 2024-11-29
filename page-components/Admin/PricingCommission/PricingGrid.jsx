import { Avatar, Flex, Grid, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { business_config_slug_map } from "constants";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useState } from "react";

/**
 * Grid component to display the list of products for configuring their pricing.
 * @param {*} props
 * @param {Array} props.product_list List of product-slugs to display
 * @param {boolean} [props.sub_page] Flag to identify if the grid is being used in a sub-page.
 */
const PricingGrid = ({ product_list, sub_page = false }) => {
	return (
		<Grid
			templateColumns={{
				base: "repeat(auto-fill,minmax(250px,1fr))",
				md: "repeat(auto-fill,minmax(300px,1fr))",
			}}
			justifyContent="center"
			py={{ base: "4", md: "0px" }}
			gap={{
				base: (2, 4),
				md: (4, 2),
				lg: (4, 6),
			}}
		>
			{product_list?.map((product) => {
				const { label, desc, icon, hide } =
					business_config_slug_map[product] ?? {};

				if (hide) return null;
				if (!label) return null;

				return (
					<Card
						key={product}
						slug={product}
						sub_page={sub_page}
						{...{
							label,
							desc,
							icon,
						}}
					/>
				);
			})}
		</Grid>
	);
};

export { PricingGrid };

/**
 * Pricing & Commission: Card Component.
 * @param {*} props
 * @param {string} props.label Label for the card
 * @param {string} props.desc Description for the card
 * @param {string} props.icon Icon for the card
 * @param {string} props.slug Slug for the card. This will be used to navigate to the pricing page.
 * @param {boolean} [props.sub_page] Flag to identify if the card is being used in a sub-page.
 */
const Card = ({ label, desc, icon, slug, sub_page = false }) => {
	const { h } = useHslColor(label);
	const [onHover, setOnHover] = useState(false);
	const router = useRouter();

	const handleClick = (slug) => {
		if (slug) {
			router.push((sub_page ? "" : "pricing/") + slug);
		}
	};

	return (
		<Flex
			key={label}
			w="100%"
			bg="white"
			p="4"
			borderRadius="8"
			align="center"
			justify="space-between"
			gap="1"
			_hover={{
				bg: `hsl(${h},80%,98%)`,
				transition: "background 0.3s ease-out",
				cursor: "pointer",
			}}
			boxShadow="buttonShadow"
			onMouseEnter={() => setOnHover(true)}
			onMouseLeave={() => setOnHover(false)}
			onClick={() => handleClick(slug)}
		>
			<Flex align="center" gap="4" w="100%">
				<Avatar
					size={{ base: "sm", md: "md" }}
					name={icon ? null : label}
					border={`2px solid hsl(${h},80%,90%)`}
					bg={`hsl(${h},80%,95%)`}
					color={`hsl(${h},80%,30%)`}
					icon={
						<Icon
							size={{ base: "sm", md: "md" }}
							name={icon}
							color={`hsl(${h},80%,30%)`}
						/>
					}
				/>
				<Flex direction="column" w="80%" gap="1">
					{label?.length > 0 ? (
						<Text
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="medium"
							userSelect="none"
						>
							{label}
						</Text>
					) : null}
					{desc?.length > 0 ? (
						<Text fontSize="xxs" userSelect="none" noOfLines={3}>
							{desc}
						</Text>
					) : null}
				</Flex>
			</Flex>
			<Icon
				name="arrow-forward"
				size={{ base: "xs", sm: "sm" }}
				color={onHover ? `hsl(${h},80%,30%)` : "transparent"}
			/>
		</Flex>
	);
};
