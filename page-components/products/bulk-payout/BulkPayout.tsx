import {
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import BatchHistory from "./components/BatchHistory";
import UploadRecipients from "./components/UploadRecipients";
import { BulkPayoutProvider, useBulkPayout } from "./context/BulkPayoutContext";

/**
 * Main content component with Upload and History tabs.
 * Reads customer params from URL query params on mount.
 */
const BulkPayoutContent = () => {
	const { activeTab, setTab, setCustomerParams, customerParams } =
		useBulkPayout();
	const searchParams = useSearchParams();

	// Read customer params from URL on mount
	useEffect(() => {
		const customerId = searchParams.get("customer_id");
		const customerName = searchParams.get("customer_name");
		const userCode = searchParams.get("user_code");

		if (customerId && customerName && userCode) {
			setCustomerParams({
				customerId,
				customerName: decodeURIComponent(customerName),
				userCode,
			});
		}
	}, [searchParams, setCustomerParams]);

	return (
		<Flex direction="column" gap="6" w="100%">
			{/* Show customer info if available */}
			{customerParams && (
				<Flex
					bg="primary.50"
					p="4"
					borderRadius="12px"
					justify="space-between"
					align="center"
				>
					<Flex direction="column" gap="1">
						<Flex fontSize="sm" color="gray.600">
							Customer
						</Flex>
						<Flex fontWeight="semibold" color="dark">
							{customerParams.customerName} (
							{customerParams.customerId})
						</Flex>
					</Flex>
				</Flex>
			)}

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

				<TabPanels>
					<TabPanel p="0">
						<UploadRecipients />
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
			<Flex direction="column" w="100%" p={{ base: 4, md: 6 }}>
				<BulkPayoutContent />
			</Flex>
		</BulkPayoutProvider>
	);
};

export default BulkPayout;
