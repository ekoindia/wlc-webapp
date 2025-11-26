import { Box } from "@chakra-ui/react";
import { IcoButton } from "components";
import { useState } from "react";
import { MdClose } from "react-icons/md";
import AboutTab from "./AboutTab";
import TroubleshootTab from "./TroubleshootTab";

/**
 * Props for About component
 */
interface AboutProps {
	/**
	 * Optional callback when popup is closed (for DynamicPopupModuleLoader integration)
	 * @param {any} [_result] - Optional result data to pass back
	 * @returns {void}
	 */
	onClose?: (_result?: any) => void;
}

type ViewType = "about" | "troubleshoot";

/**
 * About component displaying app information with navigation to troubleshooting diagnostics
 * @param {AboutProps} _props - Component props (onClose is for DynamicPopupModuleLoader integration)
 * @returns {JSX.Element} About component
 */
const About = ({ onClose }: AboutProps): JSX.Element => {
	const [currentView, setCurrentView] = useState<ViewType>("about");

	const handleNavigate = (view: ViewType): void => {
		setCurrentView(view);
	};

	return (
		<Box
			position="relative"
			bg="white"
			borderRadius="10px"
			border="card"
			boxShadow="basic"
			mx={{ base: "4", md: "0" }}
			mb={{ base: "16", md: "0" }}
			maxH="80vh"
			overflowY="auto"
		>
			{currentView === "about" ? (
				<AboutTab onNavigate={handleNavigate} />
			) : (
				<TroubleshootTab onBack={() => handleNavigate("about")} />
			)}
			<IcoButton
				icon={MdClose}
				aria-label="Close About"
				title="Close"
				onClick={onClose}
				borderRadius="full"
				position="absolute"
				top="2px"
				right="2px"
				p="4px"
				size="32px"
				alignItems="center"
				justifyContent="center"
				_hover={{ filter: "brightness(0.9)" }}
			/>
		</Box>
	);
};

export default About;
