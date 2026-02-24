import {
	Box,
	Flex,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useToast,
} from "@chakra-ui/react";
import { Endpoints } from "constants/EndPoints";
import {
	KycServicesResponse,
	normalizeServices,
} from "features/kyc-verification";
import { MOCK_KYC_SERVICES } from "features/kyc-verification/mocks/mockServices";
import useApiFetch from "hooks/useApiFetch";
import BatchHistory from "page-components/products/bulk-payout/components/BatchHistory";
import { BulkUploadUI } from "page-components/products/bulk-payout/components/BulkUpload";
import { BulkPayoutProvider } from "page-components/products/bulk-payout/context/BulkPayoutContext";
import { useEffect, useMemo, useState } from "react";

export interface ServiceOption {
	label: string;
	value: string;
	category: string;
	serviceCode: string;
}

export interface VerificationService {
	/** Unique service code identifier */
	serviceCode: string;
	/** Service name (e.g., "PAN Lite") */
	name: string;
	/** Provider label (e.g., "Cashfree - Pan Lite") */
	label: string;
	/** Category for filtering (e.g., "Identity", "Financial") */
	category?: string;
	/** Short description of the service */
	description?: string;
	/** Icon name from the icon library */
	icon?: string;
	/** API endpoint path for verification (e.g., "/tools/kyc/pan-lite") */
	endpointPath: string;
	/** Whether this service supports bulk verification uploads */
	supports_bulk_verification?: boolean;
	/** Whether this service is enabled for the agent */
	is_enabled: boolean;
}

/** Base URL for sample file downloads */
const SAMPLE_FILE_BASE_URL =
	"https://files.eko.co.in/docs/sample_files/bulk-upload";

const SERVICES_INTERACTION_ID = 1041;

const USE_MOCK_DATA = false;

/**
 * Main content component with Upload and History tabs.
 */
const BulkVerificationContent = () => {
	const [activeTab, setActiveTab] = useState<string>("upload");
	const [services, setServices] = useState<VerificationService[]>([]);
	const [selectedService, setSelectedService] =
		useState<ServiceOption | null>(null);
	const [batchCount, setBatchCount] = useState(0); // For externalBatchCount

	const toast = useToast();

	// 1. Fetch Services Logic
	const [fetchServices] = useApiFetch(Endpoints.TRANSACTION, {
		method: "POST",
		onError: (err) => {
			const errorMessage =
				err?.data?.message || "Failed to fetch services";
			toast({
				title: "Error",
				description: errorMessage,
				status: "error",
				duration: 5000,
				isClosable: true,
			});
		},
	});

	useEffect(() => {
		const getServices = async () => {
			console.log(
				"[KycServicesContext] Loading services, USE_MOCK_DATA:",
				USE_MOCK_DATA
			);
			if (USE_MOCK_DATA) {
				// Use mock data
				console.log(
					"[KycServicesContext] Using mock data, services count:",
					MOCK_KYC_SERVICES.length
				);
				setServices(normalizeServices(MOCK_KYC_SERVICES));
			} else {
				try {
					const response = await fetchServices({
						body: {
							interaction_type_id: SERVICES_INTERACTION_ID,
						},
					});

					console.log("[KycServicesContext] API response:", response);

					if (
						response?.data?.status === 0 &&
						response.data.data?.verification_service_list
					) {
						const normalizedServices = normalizeServices(
							(response.data as KycServicesResponse).data
								.verification_service_list
						);
						console.log(
							"[KycServicesContext] Loaded services:",
							normalizedServices.length
						);
						setServices(normalizedServices);
					} else {
						const errorMessage =
							response?.data?.message ||
							"Failed to fetch services";
						toast({
							title: "Error",
							description: errorMessage,
							status: "error",
							duration: 5000,
							isClosable: true,
						});
					}
				} catch (err) {
					console.error(
						"[KycServicesContext] Error fetching services:",
						err
					);
					const errorMessage = "Failed to fetch services";
					toast({
						title: "Error",
						description: errorMessage,
						status: "error",
						duration: 5000,
						isClosable: true,
					});
				}
			}
		};
		getServices();
	}, []);

	// 2. Memoized Service Options
	const bulkEnabledOptions = useMemo(() => {
		return services
			.filter((s) => s?.supports_bulk_verification === true)
			.map((s) => ({
				label: s?.name,
				value: s.serviceCode,
				category: s.category,
				serviceCode: s.serviceCode,
			}));
	}, [services]);

	// 3. Memoized Configuration Object
	const BulkUploadProps = useMemo(
		() => ({
			sampleDownloadLink: selectedService
				? `${SAMPLE_FILE_BASE_URL}/${selectedService.serviceCode}.xlsx`
				: null,
			serviceCode: selectedService?.serviceCode || "",
			sampleFileName: selectedService
				? `${selectedService.label} Sample.xlsx`
				: "Select a service to view sample",
			showPinInput: false,
			showServiceSelect: true,
			serviceOptions: bulkEnabledOptions,
			selectedService: selectedService,
			onServiceChange: (option: ServiceOption | null) =>
				setSelectedService(option),
			externalSetTab: (tab: string) => setActiveTab(tab),
			activeTab: activeTab,
			externalBatchCount: batchCount,
			setBatchCount: (count: number) => setBatchCount(count),
			buttonLabel: "Verify Batch",
			tfUri: "/bulk/upload",
		}),
		[selectedService, bulkEnabledOptions, batchCount]
	);

	return (
		<Flex direction="column" gap="6" w="100%">
			<Tabs
				index={activeTab === "upload" ? 0 : 1}
				onChange={(i) => setActiveTab(i === 0 ? "upload" : "history")}
				variant="soft-rounded"
				colorScheme="primary"
			>
				<TabList
					bg="gray.50"
					p="1"
					borderRadius="full"
					w="fit-content"
					mb="2"
				>
					<Tab
						_selected={{ bg: "primary.DEFAULT", color: "white" }}
						borderRadius="full"
						fontSize="sm"
						fontWeight="medium"
					>
						Bulk Upload
					</Tab>
					<Tab
						_selected={{ bg: "primary.DEFAULT", color: "white" }}
						borderRadius="full"
						fontSize="sm"
						fontWeight="medium"
					>
						Status History
					</Tab>
				</TabList>

				<TabPanels p={1}>
					<TabPanel p="0">
						<Box mt="6">
							{/* Passing the memoized object using spread operator */}
							<BulkUploadUI {...BulkUploadProps} />
						</Box>
					</TabPanel>
					<TabPanel p="0">
						<BulkPayoutProvider>
							<BatchHistory
								isVerification={true}
								setBatchCount={(count) => setBatchCount(count)}
								activeTab={activeTab}
							/>
						</BulkPayoutProvider>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Flex>
	);
};

/**
 * Bulk Verification - Main container component for Bulk Verification feature
 */
const BulkVerification = () => {
	return (
		<Box
			p={{
				base: "10px",
				md: "30px",
			}}
			pb={{ base: "20px", md: "30px" }}
		>
			<BulkVerificationContent />
		</Box>
	);
};

export default BulkVerification;
