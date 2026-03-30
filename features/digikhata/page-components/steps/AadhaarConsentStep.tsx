import {
	Box,
	Button,
	Select as ChakraSelect,
	Switch as ChakraSwitch,
	Collapse,
	Flex,
	FormControl,
	FormLabel,
	Skeleton,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { useEffect, useState } from "react";
import { ANIMATION } from "../../constants";
import { useDigiKhata } from "../../context/DigiKhataContext";
import { ConsentDetails, ConsentLanguage } from "../../context/types";
import { useDigiKhataApi } from "../../hooks/useDigiKhataApi";

interface AadhaarConsentStepProps {
	mobile: string;
}

/**
 * Step 1 of wallet-opening KYC.
 * Fetches consent languages → shows consent text (summary + expandable full text)
 * + audio player + "I Agree" toggle.
 * On proceed: saves consentId and navigates to Aadhaar verification.
 * @param root0
 * @param root0.mobile
 */
export const AadhaarConsentStep = ({
	mobile,
}: AadhaarConsentStepProps): JSX.Element => {
	const { dispatch } = useDigiKhata();
	const {
		getConsentLanguages,
		isGettingConsentLanguages,
		getConsentDetails,
		isGettingConsentDetails,
	} = useDigiKhataApi(mobile);

	const toast = useToast();

	const [languages, setLanguages] = useState<ConsentLanguage[]>([]);
	const [selectedLangId, setSelectedLangId] = useState("");
	const [consentDetails, setConsentDetails] = useState<ConsentDetails | null>(
		null
	);
	const [showFull, setShowFull] = useState(false);
	const [agreed, setAgreed] = useState(false);

	// Audio playback with react-sounds
	// const {
	// 	play: playAudio,
	// 	stop: stopAudio,
	// 	isPlaying,
	// } = useSound(consentDetails?.audioUrl ?? "", { volume: 0.8 });

	// const handleAudioToggle = () => {
	// 	if (isPlaying) {
	// 		stopAudio();
	// 	} else {
	// 		playAudio();
	// 	}
	// };

	// Fetch languages on mount
	useEffect(() => {
		const load = async () => {
			const res = await getConsentLanguages();
			if (res?.data?.status === 0) {
				const langs: ConsentLanguage[] =
					res.data.data?.consentlanguage ??
					res.data.data?.consent_language_list ??
					[];
				setLanguages(langs);
				if (langs.length > 0) setSelectedLangId(langs[0].pkid);
			} else {
				toast({
					title: "Failed to load consent languages",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Re-fetch consent details when language changes
	useEffect(() => {
		if (!selectedLangId) return;
		const load = async () => {
			setConsentDetails(null);
			setShowFull(false);
			setAgreed(false);
			const res = await getConsentDetails(selectedLangId);
			if (res?.data?.status === 0) {
				setConsentDetails(res.data.data?.consent_detail);
			} else {
				toast({
					title: "Failed to load consent details",
					status: "error",
					duration: 4000,
					isClosable: true,
				});
			}
		};
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedLangId]);

	const handleProceed = () => {
		if (!consentDetails?.consentId) return;
		dispatch({ type: "SET_CONSENT_ID", payload: consentDetails.consentId });
		dispatch({ type: "SET_CONSENT_LANG_ID", payload: selectedLangId });
		dispatch({ type: "SET_STEP", step: "aadhaar-verify" });
	};

	return (
		<Flex
			direction="column"
			gap={5}
			sx={{
				animation: `${fadeSlideInBottom12} ${ANIMATION.STEP_IN} ${ANIMATION.EASING} both`,
				animationDelay: ANIMATION.STEP_IN_DELAY,
			}}
		>
			<Flex direction="column" gap={1}>
				<Text fontWeight="semibold" fontSize="md" color="dark">
					Aadhaar KYC Consent
				</Text>
				<Text fontSize="sm" color="light">
					To open your Digi Khata wallet, your Aadhaar must be
					verified. Please read the consent below.
				</Text>
			</Flex>

			{/* Language selector */}
			<FormControl>
				<FormLabel>Consent Language</FormLabel>
				{isGettingConsentLanguages ? (
					<Skeleton h="40px" borderRadius="md" />
				) : (
					<ChakraSelect
						value={selectedLangId}
						onChange={(e) => setSelectedLangId(e.target.value)}
						borderRadius="md"
					>
						{languages.map((lang) => (
							<option key={lang.pkid} value={lang.pkid}>
								{lang.consentLanguage}
							</option>
						))}
					</ChakraSelect>
				)}
			</FormControl>

			{/* Consent content */}
			{isGettingConsentDetails ? (
				<Flex align="center" gap={2}>
					<Spinner size="sm" color="primary.DEFAULT" />
					<Text fontSize="sm" color="light">
						Loading consent details…
					</Text>
				</Flex>
			) : consentDetails ? (
				<Flex direction="column" gap={3}>
					{/* Summary */}
					<Box
						bg="shade"
						borderRadius="10"
						p={4}
						border="1px solid"
						borderColor="divider"
					>
						<Text fontSize="sm" color="dark" lineHeight="tall">
							{consentDetails.consent}
						</Text>
					</Box>

					{/* Show More toggle */}
					<Text
						fontSize="sm"
						color="primary.light"
						fontWeight="medium"
						cursor="pointer"
						onClick={() => setShowFull((v) => !v)}
						userSelect="none"
					>
						{showFull ? "Show Less" : "Show More…"}
					</Text>

					<Collapse in={showFull} animateOpacity>
						<Box
							bg="shade"
							borderRadius="10"
							p={4}
							maxH="220px"
							overflowY="auto"
							border="1px solid"
							borderColor="divider"
						>
							<Text
								fontSize="xs"
								color="dark"
								lineHeight="tall"
								whiteSpace="pre-wrap"
							>
								{consentDetails?.consentContent}
							</Text>
						</Box>
					</Collapse>

					{/* Audio player */}
					{consentDetails.audioUrl ? (
						<Box>
							<Text fontSize="xs" color="light" mb={1}>
								Listen to consent:
							</Text>
							{/* Audio consent: captions not required for short auto-generated clips */}
							<audio
								controls
								src={consentDetails.audioUrl}
								style={{ width: "100%" }}
							/>
						</Box>
					) : null}

					{/* I Agree toggle */}
					<Flex
						align="center"
						justify="space-between"
						bg={agreed ? "green.50" : "shade"}
						borderRadius="10"
						p={4}
						border="1px solid"
						borderColor={agreed ? "success" : "divider"}
						transition="all 0.2s ease-out"
					>
						<Text fontSize="sm" fontWeight="medium" color="dark">
							I agree to the Aadhaar KYC consent
						</Text>
						<ChakraSwitch
							colorScheme="green"
							isChecked={agreed}
							onChange={(e) => setAgreed(e.target.checked)}
							size="lg"
						/>
					</Flex>

					<Button
						w="full"
						bg="primary.DEFAULT"
						color="white"
						borderRadius="10"
						size="lg"
						isDisabled={!agreed}
						onClick={handleProceed}
						sx={{
							animation: `${fadeSlideInBottom12} 0.18s ${ANIMATION.EASING} both`,
							animationDelay: ANIMATION.CTA_DELAY,
						}}
						_hover={{ bg: "primary.dark" }}
					>
						Proceed to Aadhaar Verification
					</Button>
				</Flex>
			) : null}
		</Flex>
	);
};
