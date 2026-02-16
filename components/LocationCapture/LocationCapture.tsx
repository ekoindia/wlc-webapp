import {
	Alert,
	AlertIcon,
	Box,
	Button,
	Circle,
	Flex,
	HStack,
	Icon,
	Text,
	VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useAppSource } from "contexts/AppSourceContext";
import useGeolocation from "hooks/useGeolocation";
import { useEffect, useMemo } from "react";
import {
	MdCheck,
	MdGpsFixed,
	MdLocationOn,
	MdMyLocation,
	MdRefresh,
	MdWarningAmber,
} from "react-icons/md";

interface LocationCaptureProps {
	onCaptured?: (_latLong: string) => void;
	requiredAccuracy?: number;
}

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.5); }
  70% { transform: scale(1); box-shadow: 0 0 0 20px rgba(66, 153, 225, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const ripple = keyframes`
  0% { width: 0; height: 0; opacity: 0.5; }
  100% { width: 120px; height: 120px; opacity: 0; }
`;

const LocationCapture = ({
	onCaptured,
	requiredAccuracy = 100,
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

	const { isAndroid } = useAppSource();

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

	useEffect(() => {
		if (locationData && onCaptured) {
			onCaptured(
				`${locationData.lat},${locationData.long},${locationData.acc || 0}`
			);
		}
	}, [locationData, onCaptured]);

	const getAccuracyLabel = () => {
		if (!accuracy) return null;
		if (accuracy <= 10) return { text: "Excellent", color: "green.500" };
		if (accuracy <= 30) return { text: "Good", color: "green.500" };
		if (accuracy <= 100) return { text: "Fair", color: "yellow.500" };
		return { text: "Poor", color: "orange.500" };
	};

	// ── Idle State ──
	const IdleView = () => (
		<VStack spacing={4} py={4}>
			<Circle size="64px" bg="blue.50">
				<Icon as={MdMyLocation} boxSize={7} color="primary.DEFAULT" />
			</Circle>
			<VStack spacing={1}>
				<Text fontSize="sm" fontWeight="semibold" color="gray.700">
					Location Required
				</Text>
				<Text
					fontSize="xs"
					color="gray.500"
					textAlign="center"
					maxW="240px"
				>
					Tap the button below to share your current location for
					verification.
				</Text>
			</VStack>
		</VStack>
	);

	// ── Loading State ──
	const LoadingView = () => (
		<VStack spacing={4} py={4}>
			<Flex
				position="relative"
				align="center"
				justify="center"
				w="80px"
				h="80px"
			>
				{[0, 1, 2].map((i) => (
					<Box
						key={i}
						position="absolute"
						borderRadius="full"
						border="2px solid"
						borderColor="blue.200"
						animation={`${ripple} 2s ${i * 0.6}s infinite ease-out`}
					/>
				))}
				<Circle
					size="48px"
					bg="blue.500"
					animation={`${pulse} 2s infinite`}
				>
					<Icon as={MdGpsFixed} boxSize={6} color="white" />
				</Circle>
			</Flex>
			<VStack spacing={0}>
				<Text fontSize="sm" fontWeight="semibold" color="blue.700">
					Acquiring Location…
				</Text>
				<Text fontSize="xs" color="gray.500">
					Stay still for best accuracy
				</Text>
			</VStack>
		</VStack>
	);

	// ── Success State ──
	const SuccessView = () => {
		const accLabel = getAccuracyLabel();
		const bgColor = isAccurateEnough
			? "rgba(0, 195, 65, 0.08)"
			: "orange.50";
		const borderColor = isAccurateEnough
			? "rgba(0, 195, 65, 0.3)"
			: "orange.100";
		const iconBg = isAccurateEnough
			? "rgba(0, 195, 65, 0.1)"
			: "orange.100";
		const iconColor = isAccurateEnough ? "success" : "orange.500";
		const textColor = isAccurateEnough ? "success" : "orange.700";

		return (
			<VStack spacing={3} w="100%">
				<Box
					w="100%"
					bg={bgColor}
					border="1px solid"
					borderColor={borderColor}
					borderRadius="lg"
					p={4}
				>
					<HStack spacing={3}>
						<Circle size="40px" bg={iconBg} flexShrink={0}>
							<Icon
								as={isAccurateEnough ? MdCheck : MdWarningAmber}
								boxSize={5}
								color={iconColor}
							/>
						</Circle>
						<VStack align="start" spacing={0} flex={1}>
							<HStack spacing={2}>
								<Text
									fontSize="sm"
									fontWeight="bold"
									color={textColor}
								>
									{isAccurateEnough
										? "Location Verified"
										: "Location Captured"}
								</Text>
							</HStack>
							<HStack spacing={2} mt={0.5}>
								{accLabel && (
									<HStack spacing={1}>
										<Box
											w="6px"
											h="6px"
											borderRadius="full"
											bg={accLabel.color}
										/>
										<Text fontSize="xs" color="gray.600">
											{accLabel.text} accuracy
											{accuracy
												? ` (${Math.round(accuracy)}m)`
												: ""}
										</Text>
									</HStack>
								)}
							</HStack>
						</VStack>
					</HStack>
				</Box>

				{!isAccurateEnough && (
					<HStack
						w="100%"
						bg="orange.50"
						px={3}
						py={2}
						borderRadius="md"
						spacing={2}
					>
						<Icon
							as={MdWarningAmber}
							color="orange.500"
							boxSize={4}
						/>
						<Text fontSize="xs" color="orange.700">
							Move to an open area and refresh for better
							accuracy.
						</Text>
					</HStack>
				)}
			</VStack>
		);
	};

	// ── Error State ──
	const ErrorView = () => {
		const steps = isAndroid
			? [
					"Open Device Settings",
					"Select Apps → Find this app",
					"Tap Permissions → Enable Location",
				]
			: [
					"Click the lock icon in the address bar",
					"Set Location to Allow",
					"Reload the page",
				];

		return (
			<Alert
				status="error"
				borderRadius="lg"
				flexDirection="column"
				alignItems="flex-start"
				p={4}
				bg="rgba(255, 64, 129, 0.08)"
				border="1px solid"
				borderColor="rgba(255, 64, 129, 0.3)"
			>
				<HStack spacing={2} mb={2}>
					<AlertIcon boxSize={4} color="error" />
					<Text fontWeight="bold" fontSize="sm" color="error">
						{permissionState === "denied"
							? "Location Permission Denied"
							: "Location Error"}
					</Text>
				</HStack>

				{permissionState === "denied" ? (
					<VStack align="start" spacing={2} pl={6} w="full">
						<Text
							fontSize="xs"
							color="gray.600"
							fontWeight="medium"
						>
							To enable location access:
						</Text>
						<VStack align="start" spacing={1} w="full">
							{steps.map((step, i) => (
								<HStack key={i} spacing={2} align="start">
									<Circle
										size="16px"
										bg="rgba(255, 64, 129, 0.1)"
										flexShrink={0}
										mt={0.5}
									>
										<Text
											fontSize="2xs"
											fontWeight="bold"
											color="error"
										>
											{i + 1}
										</Text>
									</Circle>
									<Text fontSize="xs" color="gray.700">
										{step}
									</Text>
								</HStack>
							))}
						</VStack>
					</VStack>
				) : (
					<Text fontSize="xs" color="gray.600" pl={6}>
						{error ||
							"An unknown error occurred. Please try again."}
					</Text>
				)}
			</Alert>
		);
	};

	const hasCaptured = latitude && !error;

	return (
		<Box
			bg="white"
			borderRadius="xl"
			borderWidth="1px"
			borderColor={
				hasCaptured && isAccurateEnough
					? "rgba(0, 195, 65, 0.3)"
					: "gray.200"
			}
			boxShadow="sm"
			overflow="hidden"
			transition="all 0.3s ease"
		>
			{/* Header Bar */}
			<HStack
				px={4}
				py={3}
				bg={
					hasCaptured
						? isAccurateEnough
							? "rgba(0, 195, 65, 0.08)"
							: "orange.50"
						: "gray.50"
				}
				borderBottom="1px solid"
				borderColor={
					hasCaptured
						? isAccurateEnough
							? "rgba(0, 195, 65, 0.3)"
							: "orange.100"
						: "gray.200"
				}
				transition="all 0.3s ease"
			>
				<Icon
					as={MdLocationOn}
					boxSize={5}
					color={
						hasCaptured
							? isAccurateEnough
								? "success"
								: "orange.500"
							: "gray.500"
					}
				/>
				<Text fontSize="sm" fontWeight="bold" color="gray.700" flex={1}>
					Location Verification
				</Text>
				{hasCaptured && (
					<Circle
						size="20px"
						bg={isAccurateEnough ? "success" : "orange.500"}
					>
						<Icon
							as={isAccurateEnough ? MdCheck : MdWarningAmber}
							boxSize={3}
							color="white"
						/>
					</Circle>
				)}
			</HStack>

			{/* Content */}
			<VStack spacing={4} p={4} align="stretch">
				<Box
					minH="100px"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					{isLoading ? (
						<LoadingView />
					) : hasCaptured ? (
						<SuccessView />
					) : error || permissionState === "denied" ? (
						<ErrorView />
					) : (
						<IdleView />
					)}
				</Box>

				{permissionState !== "unsupported" &&
					(!hasCaptured || !isAccurateEnough) && (
						<Button
							size="md"
							// colorScheme={hasCaptured ? "gray" : "blue"}
							variant={hasCaptured ? "outline" : "primary"}
							onClick={requestLocation}
							isLoading={isLoading}
							loadingText="Listening…"
							leftIcon={
								<Icon
									as={hasCaptured ? MdRefresh : MdGpsFixed}
								/>
							}
							borderRadius="lg"
							fontWeight="semibold"
							_active={{ transform: "scale(0.98)" }}
						>
							{hasCaptured
								? "Refresh Location"
								: "Capture Location"}
						</Button>
					)}
			</VStack>
		</Box>
	);
};

export default LocationCapture;
