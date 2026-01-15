import {
	Box,
	Card,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@chakra-ui/react";
import { EkoConnectWidget } from "components/EkoConnectWidget";
import { useEffect, useState } from "react";
import BatchHistory from "./components/BatchHistory";
import UploadRecipients from "./components/UploadRecipients";
import { BulkPayoutProvider, useBulkPayout } from "./context/BulkPayoutContext";

/**
 * Main content component with Upload and History tabs.
 * Reads customer params from URL query params on mount.
 */
const BulkPayoutContent = () => {
	const { activeTab, setTab, setCustomerParams } = useBulkPayout();

	const [ekoResponseTypeId, setEkoResponseTypeId] = useState<number | null>(
		null
	);

	useEffect(() => {
		const onEkoResponse = (event: Event) => {
			const detail = (event as CustomEvent)?.detail;
			console.log(
				"EkoConnect response detail:",
				detail?.response?.data?.customer_profile?.name,
				detail?.response?.data?.customer_profile?.mobile
			);

			const customerName = detail?.response?.data?.customer_profile?.name;
			const customerNumber =
				detail?.response?.data?.customer_profile?.mobile;

			if (customerName && customerNumber) {
				setCustomerParams({
					customerName,
					customerNumber,
				});
			}

			const responseTypeId = detail?.response?.response_type_id;
			const parsedResponseId =
				typeof responseTypeId === "string"
					? Number(responseTypeId)
					: responseTypeId;

			if (Number.isFinite(parsedResponseId)) {
				setEkoResponseTypeId(parsedResponseId as number);
			}
		};

		window.addEventListener(
			"eko-response",
			onEkoResponse as unknown as EventListener
		);

		return () =>
			window.removeEventListener(
				"eko-response",
				onEkoResponse as unknown as EventListener
			);
	}, []);

	return (
		<Flex direction="column" gap="6" w="100%">
			<Tabs
				index={activeTab === "upload" ? 0 : 1}
				onChange={(index) => setTab(index === 0 ? "upload" : "history")}
				variant="soft-rounded"
				colorScheme="primary"
			>
				<TabList
					bg="gray.50"
					p="1"
					borderRadius="full"
					w="fit-content"
					mb="6"
				>
					<Tab
						_selected={{ bg: "primary.DEFAULT", color: "white" }}
						borderRadius="full"
						px="6"
						fontSize="sm"
						fontWeight="medium"
					>
						Upload Recipients
					</Tab>
					<Tab
						_selected={{ bg: "primary.DEFAULT", color: "white" }}
						borderRadius="full"
						px="6"
						fontSize="sm"
						fontWeight="medium"
					>
						Batch History
					</Tab>
				</TabList>

				<TabPanels p={1}>
					<TabPanel p="0">
						<Card
							maxW="100%"
							w="100%"
							h="auto"
							p={{ base: 2, md: 0 }}
						>
							<EkoConnectWidget start_id={10035} paths={[]} />
						</Card>

						{/* Only show UploadRecipients  when response is 309 */}
						{ekoResponseTypeId === 309 && (
							<Box mt="6" mb={{ base: "30%", md: 0 }}>
								<UploadRecipients />
							</Box>
						)}
					</TabPanel>
					<TabPanel p="0">
						<BatchHistory />
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
};

/**
 * BulkPayout - Main container component for Bulk Payout feature
 * Wraps content with context provider
 */
const BulkPayout = () => {
	return (
		<BulkPayoutProvider>
			<Flex
				direction="column"
				w="100%"
				py={{ base: 2, md: 6 }}
				px={{ base: 3, md: 2.5 }}
			>
				<BulkPayoutContent />
			</Flex>
		</BulkPayoutProvider>
	);
};

export default BulkPayout;
