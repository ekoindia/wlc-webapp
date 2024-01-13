import { Avatar, Box, Flex, Grid, Text } from "@chakra-ui/react";
import { Headings, Icon, Tabs } from "components";
import { product_slug_map } from "constants/ProductDetails";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useState } from "react";
import {
	AadhaarPay,
	AccountVerification,
	Aeps,
	AirtelCms,
	CardPayment,
	CommissionFrequency,
	CreditCardBillPayment,
	Dmt,
	IndoNepal,
} from ".";
/**
 * A PricingCommission page-component
 * @example	`<PricingCommission></PricingCommission>`
 */
const PricingCommission = () => {
	const tabList = [
		{
			label: "Commission Frequency",
			comp: <CommissionFrequency />,
			icon: "money-deposit",
			// disabled: true,
		},
		{ label: "Money Transfer", comp: <Dmt />, icon: "cash" },
		{ label: "AePS", comp: <Aeps />, icon: "cashout" },
		{ label: "Payment Gateway", comp: <CardPayment /> },
		{
			label: "Account Verification",
			comp: <AccountVerification />,
			icon: "money-note",
		},
		{
			label: "Credit Card Bill Payment",
			comp: <CreditCardBillPayment />,
			icon: "creditcard",
		},
		{ label: "Aadhaar Pay", comp: <AadhaarPay />, icon: "wallet" },
		{
			label: "Indo-Nepal Fund Transfer",
			comp: <IndoNepal />,
			icon: "nepal",
		},
		{ label: "Airtel CMS", comp: <AirtelCms /> },
	];

	return (
		<>
			<Headings title="Pricing & Commissions" hasIcon={false} />
			<Box
				px={{ base: "16px", md: "initial" }}
				mb={{ base: "16", md: "0" }}
			>
				{tabList?.length > 5 ? (
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
							({ label, icon, comp, slug }) => (
								<Card
									key={label}
									{...{ label, icon, comp, slug }}
								/>
							)
						)}
					</Grid>
				) : (
					<>
						<Text mb="20px" fontSize={{ base: "xs", sm: "sm" }}>
							<span
								style={{
									backgroundColor: "#FFD93B",
									fontWeight: "700",
								}}
							>
								Note:
							</span>
							&nbsp; The revised cost structure will come into
							effect from tomorrow (12:00 AM midnight).
						</Text>
						<Box
							bg="white"
							border="card"
							boxShadow="basic"
							borderRadius="10px"
						>
							<Tabs>
								{tabList.map(
									(
										{ label, comp, disabled = false },
										index
									) => (
										<div
											key={`${index}-${label}`}
											label={label}
											disabled={disabled}
										>
											{comp}
										</div>
									)
								)}
							</Tabs>
						</Box>
					</>
				)}
			</Box>
		</>
	);
};

export { PricingCommission };

const Card = ({ label, icon, slug }) => {
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
					<Text
						fontSize={{ base: "sm", md: "md" }}
						fontWeight="medium"
					>
						{label}
					</Text>
					<Text fontSize="xs">{label}</Text>
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
