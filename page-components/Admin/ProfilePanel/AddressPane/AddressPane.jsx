import { Divider, Flex, Text } from "@chakra-ui/react";
import { Button, Card, IcoButton } from "components";
import { openGoogleMap } from "helpers";
import { MapView } from "libs";
import { useRouter } from "next/router";

const AddressPane = ({ data }) => {
	const router = useRouter();
	return (
		<Card h={{ base: "auto", md: "560px" }}>
			<Flex
				direction="column"
				gap={{ base: "8", lg: "10" }}
				fontSize="sm"
				h="100%"
			>
				<Flex direction="column" gap="4">
					<Text as="b" color="light">
						Address Details
					</Text>

					<Text fontSize="md">{data?.address}</Text>

					<Divider />

					<Flex direction="column" color="light">
						Ownership type
						<Text fontWeight="medium" color="dark">
							{data?.ownership_type}
						</Text>
					</Flex>
				</Flex>

				<Flex justify="center" w="100%" h="180px">
					<MapView
						h="180"
						w="560"
						lat={data?.lattitude}
						lng={data?.longitude}
					/>
				</Flex>

				<Flex
					direction={{ base: "column", lg: "row" }}
					justify="space-between"
					align="center"
					gap="6"
				>
					<Button
						onClick={() =>
							router.push("/admin/my-network/profile/up-sell-add")
						}
						w={{ base: "100%", lg: "240px" }}
						h="60px"
					>
						Update Address
					</Button>
					<Flex
						gap="2"
						align="center"
						color="primary.DEFAULT"
						onClick={() =>
							openGoogleMap(data?.lattitude, data?.longitude)
						}
						cursor="pointer"
					>
						<IcoButton
							title="View on Google Maps"
							theme="primary"
							iconName="near-me"
							cursor="pointer"
							size="sm"
						/>
						<Text fontWeight="semibold" whiteSpace="nowrap">
							View on Google Maps
						</Text>
					</Flex>
				</Flex>
			</Flex>
		</Card>
	);
};

export default AddressPane;
