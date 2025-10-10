import {
	Box,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
} from "@chakra-ui/react";
import {
	CopilotKit,
	useCopilotAction as useCopilotActionHook,
	useCopilotReadable,
} from "@copilotkit/react-core";
import { CopilotPopup, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { UserTypeLabel } from "constants/UserTypes";
import { useOrgDetailContext, useUser } from "contexts";
import { useFeatureFlag, useUserTypes } from "hooks";
import { ReactNode } from "react";

interface CopilotProviderProps {
	children: ReactNode;
	runtimeUrl?: string;
	showPopup?: boolean;
}

/**
 * Default system instructions for the CopilotKit AI assistant.
 * This provides context and guidance for the AI's interactions with the user.
 * MARK: System Prompt
 */
export const CopilotSystemInstructions = `You are assisting the user with this application. You can help them navigate, perform financial transactions, and manage their business operations (based on the user's role and permissions, i.e., the menu items available to them).
- Address the user by their first name (if available) and always respond in a friendly and helpful manner.
- If you don't know the answer to a question, politely inform the user that you are unable to assist with that request.
- Only respond to questions that are relevant to the application and its features. Do not provide any personal opinions or advice outside the scope of the application. If the user asks about a feature that is not available in the application, inform them that you are not aware of such a feature and suggest they contact support for further assistance.
- Use markdown formatting for your responses, such as headings, lists, **bold**, *italics*, and tables, to enhance readability. Always highlight important information in bold.
- If the user asks in Urdu, assume it to be Hindi, otherwise respond in their language.`;

/**
 * Sample prompts for the CopilotKit AI assistant.
 * These prompts can be used to demonstrate the AI's capabilities or as examples for users.
 */
// const SAMPLE_PROMPTS_COLLECTION = [
// 	"What can I do with this app?",
// 	"How can I manage my business?",
// 	"How was my business yesterday?",
// 	"Who are my top users?",
// 	"मेरा व्यवसाय कैसा चल रहा है?",
// ];

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
	const [isAiCopilotAllowed] = useFeatureFlag("AI_COPILOT");

	if (!isAiCopilotAllowed) {
		return <>{children}</>;
	}

	return (
		<CopilotKit
			runtimeUrl={runtimeUrl}
			showDevConsole={process.env.NEXT_PUBLIC_COPILOT_DEBUG === "true"}
			// transcribeAudioUrl="/spt"
			// textToSpeechUrl="/tts"
		>
			{children}
			<CopilotHydrate showPopup={showPopup} />
		</CopilotKit>
	);
};

/**
 * Safely adds the given information to the AI Copilot context.
 * It safely calls the `useCopilotReadable` hook by handling ContextProvider not available error.
 * @param {any} config - The configuration object for the Copilot readable state
 */
export const useCopilotInfo = (config: any) => {
	try {
		return useCopilotReadable(config);
	} catch (error) {
		console.error("Error occurred while using Copilot:", error);
		return null;
	}
};

/**
 * Safely setup frontend actions (tools) that the AI Copilot can call.
 * It safely calls the actual `useCopilotAction` hook by handling ContextProvider not available error.
 * @param {any} config - The configuration object for the Copilot action
 */
export const useCopilotAction = (config: any) => {
	try {
		return useCopilotActionHook(config);
	} catch (error) {
		console.error("Error occurred while using Copilot:", error);
		return null;
	}
};

/**
 * Component to hidrate Copilot context and show Chat Popup
 * MARK: <Hydrate>
 * @param {object} props - The component props
 * @param {boolean} props.showPopup - Whether to show the Copilot popup
 * @returns {JSX.Element | null} The CopilotHydrate component or null
 */
const CopilotHydrate = ({ showPopup }: { showPopup: boolean }) => {
	const { orgDetail } = useOrgDetailContext();
	const { isAdmin, userData, userType } = useUser();
	const [isAiCopilotAllowed] = useFeatureFlag("AI_COPILOT");

	const { getUserTypeLabel } = useUserTypes();

	const _role = isAdmin ? "Admin" : UserTypeLabel[userType || 0] || "User";
	const _roleLabel = isAdmin ? "Admin" : getUserTypeLabel(userType) || "User";

	// Define AI Copilot readable state for the organization details
	// MARK: Org Details
	useCopilotInfo({
		description: "Name of this application",
		value: JSON.stringify(orgDetail?.app_name),
	});

	// Define AI Copilot readable state for the user details
	// MARK: User Details
	useCopilotInfo({
		description: `Details of this user. If available, call them by their first name. The \`role\` field defines the type of the user.
Role hierarchy:
	- Admin
		- SuperDistributor
		- Distributor
			- Field Executive (or, Field Agent)
		- Agent (or, Retailer, etc.)
			- Sub-Retailer
		- Independent Retailer`,

		value: {
			name: userData?.userDetails?.name || undefined,
			gender: userData?.userDetails?.gender || undefined,
			role: _role,
			role_label: _roleLabel,
		},
	});

	// Define AI Copilot action to show a single stat value. This action can be used to display important statistics like E-value balance or Total GTV.
	// MARK: Show Stat
	useCopilotAction({
		name: "show-stat",
		description:
			"Displays a single numeric value or statistic, such as amount, count, balance, GTV, users, earning, etc. Use this to show all important numeric value to the user (upto 10 at a time).",
		parameters: [
			{
				name: "value",
				type: "string",
				description: "The formatted value to show",
				required: true,
			},
			{
				name: "label",
				type: "string",
				description: "Short label for the value",
				required: true,
			},
			{
				name: "subtitle",
				type: "string",
				description: "Additional help-text or context for the value",
				required: false,
			},
		],
		render: ({ status, args }) => {
			const { value, label, subtitle } = args;
			if (status === "inProgress") {
				return "Fetching..."; // loading state
			}

			return (
				<Stat
					border="1px solid"
					borderColor="gray.200"
					p={4}
					borderRadius="md"
				>
					<StatLabel>{label}</StatLabel>
					<StatNumber>{value}</StatNumber>
					<StatHelpText>{subtitle}</StatHelpText>
				</Stat>
			);
		},
	});

	// Define AI Copilot chat suggestions to provide initial prompts for the user
	// MARK: Suggestions
	useCopilotChatSuggestions({
		instructions: `In the beginning of the chat, suggest user some sample prompts to start with. You can also suggest them to ask about the features of this application, or how to perform a specific task.`,
	});

	if (!(isAiCopilotAllowed && showPopup)) {
		// If AI_COPILOT feature flag is not enabled or showPopup is false, return null
		console.log("Copilot not allowed");
		return null;
	}

	// Render the CopilotPopup only if the AI_CHATBOT feature flag is enabled and showPopup is true
	// MARK: Chat Window
	return (
		<Box
			sx={{
				".poweredBy": { display: "none !important" },
				".poweredByContainer": { paddingBottom: "10px" },
			}}
		>
			<CopilotPopup
				onThumbsUp={() => {
					// Handle thumbs up action
				}}
				onThumbsDown={() => {
					// Handle thumbs down action
				}}
				instructions={CopilotSystemInstructions}
				labels={{
					title: `${orgDetail?.app_name} Assistant`,
					initial: "Hi! 👋 How can I help you today?",
				}}
			/>
		</Box>
	);
};

// Re-export commonly used CopilotKit hooks and components
export { useCopilotChat, useCopilotContext } from "@copilotkit/react-core";

export { CopilotPopup, CopilotSidebar } from "@copilotkit/react-ui";
