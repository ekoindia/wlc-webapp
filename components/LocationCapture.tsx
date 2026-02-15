import {
	Alert,
	AlertIcon,
	Badge,
	Box,
	Button,
	Fade,
	Flex,
	HStack,
	Icon,
	Text,
	Tooltip,
	useClipboard,
	VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import useGeolocation from "hooks/useGeolocation";
import { useEffect, useMemo, useState } from "react";
import { MdCheck, MdCopyAll, MdGpsFixed, MdRefresh } from "react-icons/md";

interface LocationCaptureProps {
	onCaptured?: (_latLong: string) => void;
	requiredAccuracy?: number; // in meters (e.g., 50)
}

// --- Animations ---
const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
`;
const radar = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LocationCapture = ({
	onCaptured,
	requiredAccuracy = 100, // Default requirement: 100m
}: LocationCaptureProps) => {
	const {
		latitude,
		longitude,
		accuracy,
		timestamp,
		error,
		permissionState,
		isLoading,
		requestLocation,
	} = useGeolocation();

	const [isStale, setIsStale] = useState(false);
	const { hasCopied, onCopy } = useClipboard(
		`${latitude},${longitude} (Acc: ${accuracy}m)`
	);

	// --- Computed State ---
	const isAccurateEnough = useMemo(() => {
		if (!accuracy) return false;
		return accuracy <= requiredAccuracy;
	}, [accuracy, requiredAccuracy]);

	const locationData = useMemo(() => {
		if (!latitude || !longitude) return null;
		return {
			lat: latitude,
			long: longitude,
			acc: accuracy,
			time: timestamp,
		};
	}, [latitude, longitude, accuracy, timestamp]);

	// --- Effects ---
	useEffect(() => {
		if (locationData && onCaptured) {
			onCaptured(
				`${locationData.lat},${locationData.long},${locationData.acc || 0}`
			);
		}
	}, [locationData, onCaptured]);

	// Check for stale data (every 30s)
	useEffect(() => {
		const interval = setInterval(() => {
			if (timestamp) {
				const secondsOld = (Date.now() - timestamp) / 1000;
				setIsStale(secondsOld > 120); // Mark stale after 2 mins
			}
		}, 30000);
		return () => clearInterval(interval);
	}, [timestamp]);

	// --- Sub-Components ---

	const RadarLoader = () => (
		<VStack spacing={4} py={6}>
			<Box position="relative" w="80px" h="80px">
				{/* Pulse Rings */}
				<Box
					position="absolute"
					top="0"
					left="0"
					w="100%"
					h="100%"
					borderRadius="full"
					border="2px solid"
					borderColor="blue.300"
					animation={`${pulse} 2s infinite`}
				/>
				{/* Radar Sweep */}
				<Box
					position="absolute"
					top="0"
					left="0"
					w="100%"
					h="100%"
					borderRadius="full"
					background="conic-gradient(from 0deg, transparent 0deg, rgba(66, 153, 225, 0.4) 30deg, transparent 60deg)"
					animation={`${radar} 2s linear infinite`}
				/>
				{/* Center Icon */}
				<Flex
					position="absolute"
					top="50%"
					left="50%"
					transform="translate(-50%, -50%)"
					bg="blue.500"
					borderRadius="full"
					p={3}
					boxShadow="0 0 15px rgba(66, 153, 225, 0.6)"
				>
					<Icon as={MdGpsFixed} color="white" boxSize={6} />
				</Flex>
			</Box>
			<Text color="blue.600" fontSize="sm" fontWeight="medium">
				Acquiring Satellite Signal...
			</Text>
		</VStack>
	);

	const SuccessView = () => (
		<VStack spacing={3} w="100%">
			{/* Status Header */}
			<HStack w="100%" justify="space-between">
				<HStack>
					<Icon
						as={MdCheck}
						color={isAccurateEnough ? "green.500" : "orange.500"}
						boxSize={5}
					/>
					<Text fontWeight="bold" fontSize="sm">
						Location Captured
					</Text>
				</HStack>
				{isStale && (
					<Badge colorScheme="red" variant="subtle">
						Stale Data
					</Badge>
				)}
			</HStack>

			{/* Data Card */}
			<Box
				w="100%"
				bg="gray.50"
				p={3}
				borderRadius="md"
				borderWidth="1px"
				borderColor="gray.100"
			>
				<HStack justify="space-between" mb={1}>
					<Badge
						colorScheme={isAccurateEnough ? "green" : "orange"}
						variant="outline"
					>
						{accuracy ? `${Math.round(accuracy)}m Accuracy` : "N/A"}
					</Badge>
					<Tooltip label="Copy Coordinates">
						<Icon
							as={hasCopied ? MdCheck : MdCopyAll}
							onClick={onCopy}
							color="gray.500"
							cursor="pointer"
							_hover={{ color: "blue.500" }}
						/>
					</Tooltip>
				</HStack>
				<Text fontFamily="monospace" fontSize="sm" color="gray.700">
					{latitude}, {longitude}
				</Text>
				{!isAccurateEnough && (
					<Text fontSize="xs" color="orange.600" mt={2}>
						⚠️ Low accuracy. For better results, move to an open
						area.
					</Text>
				)}
			</Box>
		</VStack>
	);

	const ErrorView = () => (
		<Alert status="error" borderRadius="md" size="sm">
			<AlertIcon />
			<VStack align="start" spacing={0} flex={1}>
				<Text fontWeight="bold" fontSize="xs">
					{permissionState === "denied"
						? "Permission Denied"
						: "Location Error"}
				</Text>
				<Text fontSize="xs">
					{permissionState === "denied"
						? "Enable location in browser settings."
						: error || "Unknown error"}
				</Text>
			</VStack>
		</Alert>
	);

	return (
		<Box
			p={5}
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor="gray.200"
			boxShadow="sm"
			transition="all 0.2s"
		>
			<VStack spacing={4} align="stretch">
				{/* Header */}
				<HStack>
					<Text fontSize="md" fontWeight="bold" color="gray.700">
						📍 Verify Location
					</Text>
				</HStack>

				{/* Dynamic Content Area */}
				<Box
					minH="120px"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					{isLoading ? (
						<RadarLoader />
					) : latitude && !error ? (
						<Fade in>
							<SuccessView />
						</Fade>
					) : error || permissionState === "denied" ? (
						<ErrorView />
					) : (
						<Text color="gray.500" fontSize="sm" textAlign="center">
							We need your location to verify your identity.
						</Text>
					)}
				</Box>

				{/* Footer Action */}
				{permissionState !== "unsupported" && (
					<Button
						size="md"
						colorScheme={latitude ? "gray" : "blue"}
						variant={latitude ? "outline" : "solid"}
						onClick={requestLocation}
						isLoading={isLoading}
						leftIcon={
							<Icon as={latitude ? MdRefresh : MdGpsFixed} />
						}
						_active={{ transform: "scale(0.98)" }}
					>
						{isLoading
							? "Listening..."
							: latitude
								? "Refresh Location"
								: "Capture Location"}
					</Button>
				)}
			</VStack>
		</Box>
	);
};

export default LocationCapture;
