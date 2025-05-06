import { InfoTileGrid } from "components";

/**
 * List of GSTIN Verification Sub-Products
 */
const GstinSubProducts: {
	label: string;
	desc: string;
	icon?: string;
	url: string;
}[] = [
	{
		label: "Verify GSTIN",
		desc: "Verify a GSTIN and view business details",
		icon: "search",
		url: "gstin/verify",
	},
	{
		label: "Get GSTINs by PAN",
		desc: "Fetch all GSTINs linked to a PAN",
		icon: "credit-card",
		url: "gstin/pan",
	},
];

export const GstinVerification = (): JSX.Element => {
	return <InfoTileGrid list={GstinSubProducts} />;

	// const router = useRouter();
	// return (
	// 	<Flex
	// 		direction={{ base: "column", md: "row" }}
	// 		gap={8}
	// 		justify="center"
	// 		align="center"
	// 		mt={8}
	// 	>
	// 		<Card
	// 			as="button"
	// 			w={{ base: "100%", md: "320px" }}
	// 			h="180px"
	// 			p={6}
	// 			boxShadow="md"
	// 			_hover={{ boxShadow: "lg", bg: "gray.50" }}
	// 			onClick={() => router.push("/products/gstin/verify")}
	// 		>
	// 			<Flex
	// 				direction="column"
	// 				align="center"
	// 				justify="center"
	// 				h="100%"
	// 			>
	// 				<Icon
	// 					name="search"
	// 					size="2xl"
	// 					color="primary.DEFAULT"
	// 					mb={3}
	// 				/>
	// 				<Text fontWeight="bold" fontSize="lg" mb={1}>
	// 					GSTIN Verification
	// 				</Text>
	// 				<Text fontSize="sm" color="gray.600" textAlign="center">
	// 					Verify a GSTIN and view business details
	// 				</Text>
	// 			</Flex>
	// 		</Card>
	// 		<Card
	// 			as="button"
	// 			w={{ base: "100%", md: "320px" }}
	// 			h="180px"
	// 			p={6}
	// 			boxShadow="md"
	// 			_hover={{ boxShadow: "lg", bg: "gray.50" }}
	// 			onClick={() => router.push("/products/gstin/pan")}
	// 		>
	// 			<Flex
	// 				direction="column"
	// 				align="center"
	// 				justify="center"
	// 				h="100%"
	// 			>
	// 				<Icon
	// 					name="credit-card"
	// 					size="2xl"
	// 					color="primary.DEFAULT"
	// 					mb={3}
	// 				/>
	// 				<Text fontWeight="bold" fontSize="lg" mb={1}>
	// 					GSTINs by PAN
	// 				</Text>
	// 				<Text fontSize="sm" color="gray.600" textAlign="center">
	// 					Fetch all GST INs linked to a PAN
	// 				</Text>
	// 			</Flex>
	// 		</Card>
	// 	</Flex>
	// );
};
