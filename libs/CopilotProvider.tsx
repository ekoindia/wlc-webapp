import { CopilotKit, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { useOrgDetailContext, useUser } from "contexts";
import { useFeatureFlag } from "hooks";
import { ReactNode } from "react";

interface CopilotProviderProps {
	children: ReactNode;
	runtimeUrl?: string;
	showPopup?: boolean;
}

/**
 * Default system instructions for the CopilotKit AI assistant.
 * This provides context and guidance for the AI's interactions with the user.
 */
export const CopilotSystemInstructions =
	"You are assisting the user with this application. You can help them navigate, perform financial transactions, and manage their business operations (based on the user's role and permissions, i.e., the menu items available to them). Address the user by their first name (if available) and always respond in a friendly and helpful manner. If you don't know the answer to a question, politely inform the user that you are unable to assist with that request. Only respond to questions that are relevant to the application and its features. Do not provide any personal opinions or advice outside the scope of the application. If the user asks about a feature that is not available in the application, inform them that you are not aware of such a feature and suggest they contact support for further assistance.";

/**
 * Wrapper context provider for CopilotKit functionality.
 * Provides AI assistant capabilities throughout the application.
 *
 * Note: This component checks the "AI_CHATBOT" feature flag. If the feature flag
 * is not enabled for the current user, the children are returned without being
 * wrapped in the CopilotKit context, effectively disabling all AI functionality.
 * @param {ReactNode} children - The child components to be rendered within the provider
 * @param {string} [runtimeUrl] - The runtime URL for the CopilotKit service
 * @param {boolean} [showPopup] - Whether to show the CopilotKit popup interface
 * @returns {JSX.Element} The CopilotKit provider component with optional popup, or just children if AI_CHATBOT feature flag is disabled
 */
export const CopilotProvider = ({
	children,
	runtimeUrl = "/api/copilotkit",
	showPopup = true,
}: CopilotProviderProps) => {
	const [isAiChatBotAllowed] = useFeatureFlag("AI_CHATBOT");

	return (
		<CopilotKit
			runtimeUrl={runtimeUrl}
			// transcribeAudioUrl="/spt"
			// textToSpeechUrl="/tts"
		>
			{children}
			<CopilotHydrate />
			{/* Render the CopilotPopup only if the AI_CHATBOT feature flag is enabled and showPopup is true */}
			{isAiChatBotAllowed && showPopup ? (
				<CopilotPopup
					instructions={CopilotSystemInstructions}
					labels={{
						title: "Eloka Assistant",
						initial:
							"Hi! 👋 Ask me anything about this application, and I will do my best to assist you.",
					}}
				/>
			) : null}
		</CopilotKit>
	);
};

/**
 * Component to hidrate Copilot context
 */
const CopilotHydrate = () => {
	const { orgDetail } = useOrgDetailContext();
	const { isAdmin, userData } = useUser();

	// Define AI Copilot readable state for the organization details
	useCopilotReadable({
		description: "Name of this application",
		value: JSON.stringify(orgDetail?.app_name),
	});

	// Define AI Copilot readable state for the user details
	useCopilotReadable({
		description: "Details of this user.",
		value: {
			name: userData?.userDetails?.name || undefined,
			gender: userData?.userDetails?.gender || undefined,
			isAdmin: isAdmin,
		},
	});
	return <></>;
};

// Re-export commonly used CopilotKit hooks and components
export {
	useCopilotAction,
	useCopilotChat,
	useCopilotContext,
	useCopilotReadable,
} from "@copilotkit/react-core";

export { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
