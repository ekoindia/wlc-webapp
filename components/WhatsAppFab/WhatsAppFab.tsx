import { Box, Tooltip } from "@chakra-ui/react";
import { Icon } from "components";
import { useOrgDetailContext } from "contexts";

const WHATSAPP_PREFILL_MESSAGE = "Hi";

/**
 * Floating WhatsApp support button.
 * Rendered by the caller only when the WHATSAPP_WIDGET_SBIKIOSK feature flag is enabled.
 * The WhatsApp number is read from org metadata (support_contacts.whatsapp)
 * with a fallback to NEXT_PUBLIC_SBIKIOSK_WHATSAPP_NUMBER env var.
 */
const WhatsAppFab = () => {
	const { orgDetail } = useOrgDetailContext();
	const { support_contacts } = orgDetail?.metadata || {};

	const whatsappNumber: string | null =
		support_contacts?.whatsapp ||
		process.env.NEXT_PUBLIC_SBIKIOSK_WHATSAPP_NUMBER ||
		null;

	if (!whatsappNumber) return null;

	const openWhatsApp = () => {
		const text = encodeURIComponent(WHATSAPP_PREFILL_MESSAGE);
		window.open(
			`https://wa.me/${whatsappNumber}?text=${text}`,
			"_blank",
			"noopener,noreferrer"
		);
	};

	return (
		<Tooltip label="Chat on WhatsApp" placement="left" hasArrow>
			<Box
				position="fixed"
				bottom={{ base: "80px", md: "24px" }}
				right="24px"
				w="56px"
				h="56px"
				bg="#25D366"
				borderRadius="full"
				display="flex"
				alignItems="center"
				justifyContent="center"
				cursor="pointer"
				boxShadow="0px 4px 16px rgba(0,0,0,0.25)"
				zIndex={999}
				onClick={openWhatsApp}
				transition="transform 0.2s ease, background 0.2s ease"
				_hover={{ transform: "scale(1.1)", bg: "#128C7E" }}
				aria-label="Chat on WhatsApp"
			>
				<Icon name="whatsapp" size="28px" color="white" />
			</Box>
		</Tooltip>
	);
};

export { WhatsAppFab };
