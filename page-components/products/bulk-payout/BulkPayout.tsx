import {
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
} from "@chakra-ui/react";
import BatchHistory from "./components/BatchHistory";
import CustomerSearch from "./components/CustomerSearch";
import OtpVerification from "./components/OtpVerification";
import UploadRecipients from "./components/UploadRecipients";
import { BulkPayoutProvider, useBulkPayout } from "./context/BulkPayoutContext";

/**
 * Main content component handling step-based navigation
 */
const BulkPayoutContent = () => {
	const { currentStep, activeTab, setTab } = useBulkPayout();

	// Step 1: Customer Search
	if (currentStep === "customer-search") {
		return (
			<Flex justify="center" align="center" minH="400px">
				<CustomerSearch />
			</Flex>
		);
	}

	// Step 2: OTP Verification
	if (currentStep === "otp-verification") {
		return (
			<Flex justify="center" align="center" minH="400px">
				<OtpVerification />
			</Flex>
		);
	}

	// Step 3: Main View with Tabs
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
