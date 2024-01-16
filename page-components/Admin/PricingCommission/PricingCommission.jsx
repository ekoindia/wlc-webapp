import { Avatar, Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Button, Headings, Icon } from "components";
import { Endpoints, product_slug_map, TransactionTypes } from "constants";
import { useSession } from "contexts";
import { fetcher } from "helpers";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useState } from "react";
import { saveDataToFile } from "utils";
/**
 * A PricingCommission page-component
 * @example	`<PricingCommission></PricingCommission>`
 */
const PricingCommission = () => {
	return (
		<>
			<Headings
				title="Pricing & Commissions"
				hasIcon={false}
				propComp={<DownloadPricing />}
			/>
			<Box
				px={{ base: "16px", md: "initial" }}
				mb={{ base: "16", md: "0" }}
			>
				<Grid
					templateColumns={{
						base: "repeat(auto-fit,minmax(250px,1fr))",
						md: "repeat(auto-fit,minmax(300px,1fr))",
					}}
					justifyContent="center"
					py={{ base: "4", md: "0px" }}
					gap={{ base: (2, 4), md: (4, 2), lg: (4, 6) }}
				>
					{Object.values(product_slug_map)?.map(
						({ label, desc, icon, slug }) => (
							<Card key={slug} {...{ label, desc, icon, slug }} />
						)
					)}
				</Grid>
			</Box>
		</>
	);
};

export { PricingCommission };

const Card = ({ label, desc, icon, slug }) => {
	const { h } = useHslColor(label);
	const [onHover, setOnHover] = useState(false);
	const router = useRouter();

	const handleClick = (slug) => {
		if (slug) {
			router.push(`pricing/${slug}`);
		}
	};

	return (
		<Flex
			key={label}
			w="100%"
			bg="white"
			p="4"
			borderRadius="10px"
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
				<Flex direction="column" w="80%">
					{label?.length > 0 ? (
						<Text
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="medium"
						>
							{label}
						</Text>
					) : null}
					{desc?.length > 0 ? (
						<Text fontSize="xxs">{desc}</Text>
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

const DownloadPricing = () => {
	const { accessToken } = useSession();
	const handleClick = () => {
		fetcher(process.env.NEXT_PUBLIC_API_BASE_URL + Endpoints.TRANSACTION, {
			headers: {
				"tf-is-file-download": "1",
			},
			body: {
				interaction_type_id: TransactionTypes.DOWNLOAD_EXISTING_PRICING,
			},
			token: accessToken,
		})
			.then((data) => {
				const _blob = data?.file?.blob;
				const _filename = data?.file?.name || "file";
				const _type = data?.file["content-type"];
				const _b64 = true;
				saveDataToFile(_blob, _filename, _type, _b64);
			})
			.catch((err) => {
				console.error("Error: ", err);
			});
	};
	return (
		<Button fontSize="sm" onClick={handleClick}>
			Existing Pricing
		</Button>
	);
};
