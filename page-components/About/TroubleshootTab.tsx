import {
	Box,
	Fade,
	Flex,
	Heading,
	SimpleGrid,
	Text,
	VStack,
} from "@chakra-ui/react";
import { CopyButton, IcoButton } from "components";
import { useAppSource, useMenuContext, useOrgDetailContext } from "contexts";
import { useNetworkState, usePlatform } from "hooks";
import { useEffect, useState } from "react";
import packageJson from "../../package.json";
import { parseBrowserInfo } from "./utils";

interface TroubleshootTabProps {
	/**
	 * Callback to go back to about view
	 */
	onBack: () => void;
}

/**
 * App, Device or browser diagnostic information (name/value pairs)
 */
interface DiagnosticCategory {
	[key: string]: string | number | null;
}

interface DiagnosticInfo {
	[category: string]: DiagnosticCategory;
}

/**
 * Diagnostic tile with integrated copy button
 * MARK: Tile
 * @param root0
 * @param root0.label
 * @param root0.desc
 */
const DiagnosticTile = ({
	label,
	desc,
}: {
	label: string;
	desc: string;
}): JSX.Element => (
	<Flex
		direction="row"
		gap="2"
		w="100%"
		bg="white"
		p="4"
		borderRadius="8"
		align="center"
		justify="space-between"
		transition="background 0.3s ease-out"
		boxShadow="sh-button"
	>
		<Flex direction="column" gap="2">
			<Box fontSize="sm" fontWeight="medium" userSelect="none">
				{label.charAt(0).toUpperCase() + label.slice(1)}
			</Box>
			<Box fontSize="xxs" userSelect="none" noOfLines={3}>
				{desc}
			</Box>
		</Flex>
		<Box>
			<CopyButton text={desc} size="sm" />
		</Box>
	</Flex>
);

/**
 * Test if localStorage or sessionStorage is available and usable
 * @param storage
 */
const testStorageAvailability = (storage: Storage): boolean => {
	try {
		const testKey = "test";
		storage.setItem(testKey, "test");
		storage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
};

/**
 * Calculate used data for localStorage or sessionStorage
 * @param storage
 */
const calculateStorageUsed = (storage: Storage): number => {
	let used = 0;
	if (!storage) return used;

	for (let i = 0; i < storage.length; i++) {
		const key = storage.key(i);
		const value = storage.getItem(key);
		used += key.length + (value ? value.length : 0);
	}
	return used;
};

/**
 * Troubleshoot tab displaying comprehensive device and browser diagnostics
 * @param {TroubleshootTabProps} props - Component props
 * @returns {JSX.Element} TroubleshootTab component
 */
const TroubleshootTab = ({ onBack }: TroubleshootTabProps): JSX.Element => {
	const { platform } = usePlatform();
	const { orgDetail } = useOrgDetailContext();

	const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { appSource, nativeVersion } = useAppSource();
	const { interactions } = useMenuContext();
	const { role_tx_list } = interactions || {};

	const { online, effectiveType, downlink } = useNetworkState();

	/**
	 * Initialize diagnostic data on mount
	 * MARK: Init Data
	 */
	useEffect(() => {
		try {
			const userAgent = window?.navigator?.userAgent
				? window.navigator.userAgent.replace(
						"ekoconnectandroidwebview",
						""
					)
				: "";
			const browserInfo = parseBrowserInfo(userAgent);

			// Test localStorage availability
			let localStorageAvailable = testStorageAvailability(localStorage);

			// If localStorage is available, add the amount of localStorage used (in KB)
			let localStorageUsed = calculateStorageUsed(localStorage);

			// Test sessionStorage availability
			let sessionStorageAvailable =
				testStorageAvailability(sessionStorage);

			// If sessionStorage is available, add the amount of sessionStorage used (in KB)
			let sessionStorageUsed = calculateStorageUsed(sessionStorage);

			// Get connection type if available
			const connection = (navigator as any).connection;
			const connectionType = connection?.effectiveType ?? "Unknown";

			// Get memory info if available
			const memory =
				navigator && (navigator as any).deviceMemory
					? (navigator as any).deviceMemory + " GB"
					: "Unknown";

			// Get timezone
			const timezone =
				Intl.DateTimeFormat().resolvedOptions().timeZone ?? "Unknown";

			setDiagnostics({
				display: {
					viewportWidth: `${window.innerWidth}px`,
					viewportHeight: `${window.innerHeight}px`,
					screenWidth: `${window.screen.width}px`,
					screenHeight: `${window.screen.height}px`,
					availWidth: `${window.screen.availWidth}px`,
					availHeight: `${window.screen.availHeight}px`,
					colorDepth: `${window.screen.colorDepth}-bit`,
					pixelDepth: `${window.screen.pixelDepth}-bit`,
				},
				browser: {
					name:
						browserInfo.name +
						(browserInfo.version ? ` ${browserInfo.version}` : ""),
					userAgent: userAgent,
					language: navigator.language,
					cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
				},
				network: {
					online: navigator.onLine ? "Yes" : "No",
					connectionType: connectionType,
				},
				storage: {
					localStorage: localStorageAvailable
						? `Available (${(localStorageUsed / 1024).toFixed(2)} KB Used)`
						: "Not Available",
					sessionStorage: sessionStorageAvailable
						? `Available (${(sessionStorageUsed / 1024).toFixed(2)} KB Used)`
						: "Not Available",
				},
				system: {
					platform: platform ?? "Unknown",
					DeviceTime:
						(new Date().toLocaleString() ?? "Unknown") +
						` (${timezone})`,
					memory: memory,
				},
				app: {
					details: `${orgDetail.app_name} by ${orgDetail.org_name} (${orgDetail.org_id} / ${packageJson.version})`,
					server: window?.location?.origin ?? "Unknown",
					source: appSource || "Unknown",
					nativeVersion: nativeVersion || "N/A",
					env: process.env.NEXT_PUBLIC_ENV || "Unknown",
					trxnRoles:
						// comma separated list of all keys of the object `role_tx_list`:
						role_tx_list
							? Object.keys(role_tx_list || {}).join(", ")
							: "N/A",
				},
			});
			setErrorMessage(null);
		} catch (error) {
			console.error("Error capturing diagnostics:", error);
			setErrorMessage(
				"Failed to capture diagnostics: " + (error as Error)?.message
			);
		}
	}, []);

	useEffect(() => {
		// Listen for changes in network state and update diagnostics accordingly
		setDiagnostics((prevDiagnostics) => {
			if (!prevDiagnostics) return prevDiagnostics;

			return {
				...prevDiagnostics,
				network: {
					...prevDiagnostics.network,
					online: online ? "Yes" : "No",
					connectionType: effectiveType,
					downlink: `${downlink} Mb/s`,
				},
			};
		});
	}, [online, effectiveType, downlink]);

	if (errorMessage) {
		return (
			<Fade in>
				<Box p="6">
					<Text color="red.500">{errorMessage}</Text>
				</Box>
			</Fade>
		);
	}

	if (!diagnostics) {
		return (
			<Fade in>
				<Box p="6">
					<Text>Loading diagnostics...</Text>
				</Box>
			</Fade>
		);
	}

	// MARK: JSX
	return (
		<Fade in>
			<VStack spacing="6" align="stretch" p={{ base: "4", md: "6" }}>
				{/* Header with Back Button */}
				<Flex align="center" gap="3">
					<IcoButton
						aria-label="Go back"
						iconName={"chevron-left"}
						variant="ghost"
						size="sm"
						onClick={onBack}
					/>
					<Heading size="md" color="dark">
						Troubleshoot
					</Heading>
				</Flex>

				{/* Iterate over `diagnostics` object to automatically generate sections and tiles */}
				{Object.entries(diagnostics).map(([section, data]) => (
					<Box key={section}>
						<Heading size="sm" mb="4" color="primary.DEFAULT">
							{section.charAt(0).toUpperCase() + section.slice(1)}
						</Heading>
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3 }}
							spacing="4"
						>
							{Object.entries(data).map(([key, value]) => (
								<DiagnosticTile
									key={key}
									label={key}
									desc={value as string}
								/>
							))}
						</SimpleGrid>
					</Box>
				))}
			</VStack>
		</Fade>
	);
};

export default TroubleshootTab;
