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
import { useAppSource } from "contexts";
import { usePlatform } from "hooks";
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
 * Troubleshoot tab displaying comprehensive device and browser diagnostics
 * @param {TroubleshootTabProps} props - Component props
 * @returns {JSX.Element} TroubleshootTab component
 */
const TroubleshootTab = ({ onBack }: TroubleshootTabProps): JSX.Element => {
	const { platform } = usePlatform();
	const [diagnostics, setDiagnostics] = useState<DiagnosticInfo | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const { appSource, nativeVersion } = useAppSource();

	/**
	 * Initialize diagnostic data on mount
	 * MARK: Init Data
	 */
	useEffect(() => {
		try {
			const userAgent = window.navigator.userAgent;
			const browserInfo = parseBrowserInfo(userAgent);

			// Test localStorage availability
			let localStorageAvailable = "Not Available";
			try {
				localStorage.setItem("test", "test");
				localStorage.removeItem("test");
				localStorageAvailable = "Available";
			} catch (_e) {
				localStorageAvailable = "Not Available";
			}

			// If localStorage is available, add the amount of localStorage used (in KB)
			let localStorageUsed = 0;
			if (localStorageAvailable === "Available") {
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					const value = localStorage.getItem(key);
					localStorageUsed += key.length + (value ? value.length : 0);
				}
			}

			// Test sessionStorage availability
			let sessionStorageAvailable = "Not Available";
			try {
				sessionStorage.setItem("test", "test");
				sessionStorage.removeItem("test");
				sessionStorageAvailable = "Available";
			} catch (_e) {
				sessionStorageAvailable = "Not Available";
			}
			// If sessionStorage is available, add the amount of sessionStorage used (in KB)
			let sessionStorageUsed = 0;
			if (sessionStorageAvailable === "Available") {
				for (let i = 0; i < sessionStorage.length; i++) {
					const key = sessionStorage.key(i);
					const value = sessionStorage.getItem(key);
					sessionStorageUsed +=
						key.length + (value ? value.length : 0);
				}
			}

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
				app: {
					appVersion: packageJson.version,
					server: window?.location?.origin ?? "Unknown",
					source: appSource || "Unknown",
					nativeVersion: nativeVersion || "N/A",
					env: process.env.NEXT_PUBLIC_ENV || "Unknown",
				},
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
					name: browserInfo.name,
					version: browserInfo.version,
					userAgent: userAgent,
					language: navigator.language,
					cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
				},
				network: {
					online: navigator.onLine ? "Yes" : "No",
					connectionType: connectionType,
				},
				storage: {
					localStorage:
						localStorageAvailable +
						` (${(localStorageUsed / 1024).toFixed(2)} KB Used)`,
					sessionStorage:
						sessionStorageAvailable +
						` (${(sessionStorageUsed / 1024).toFixed(2)} KB Used)`,
				},
				system: {
					platform: platform ?? "Unknown",
					DeviceTime:
						(new Date().toLocaleString() ?? "Unknown") +
						` (${timezone})`,
					memory: memory,
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
