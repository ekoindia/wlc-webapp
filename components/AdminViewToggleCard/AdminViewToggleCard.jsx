import { Box, Flex, Switch, Text } from "@chakra-ui/react";
import { useUser } from "contexts";

/**
 * A <AdminViewToggleCard> component
 * TODO: Write more description here
 * @param	{...*}	rest	Rest of the props passed to this component.
 * @example	`<AdminViewToggleCard></AdminViewToggleCard>` TODO: Fix example
 */
const AdminViewToggleCard = ({ minimal = false, ...rest }) => {
	const {
		isLoggedIn,
		isAdminAgentMode,
		setAdminAgentMode,
		isOnboarding,
		isAdmin,
	} = useUser();

	if (isOnboarding || !(isLoggedIn && isAdmin)) return null;

	return (
		<Flex
			direction="row"
			w="100%"
			padding={minimal ? "16px 2px" : "16px 15px"}
			mb="4px"
			align="center"
			bg={minimal ? null : "status.bgLight"}
			borderTop={minimal ? "1px solid #FFFFFF20" : null}
			gap={{ base: "14px", lg: "10px", "2xl": "14px" }}
			{...rest}
		>
			<Text fontSize="12px" color="hint">
				VIEW AS:
			</Text>

			<Box flex="1" />

			<Text
				color={isAdminAgentMode ? "white" : "status.title"}
				fontSize="15px"
				fontWeight={isAdminAgentMode ? null : "bold"}
				cursor={isAdminAgentMode ? "pointer" : "default"}
				onClick={() => setAdminAgentMode(false)}
			>
				Admin
			</Text>

			<Switch
				size="md"
				colorScheme="whiteAlpha"
				isChecked={isAdminAgentMode}
				onChange={(e) => setAdminAgentMode(e.target.checked)}
			/>

			<Text
				color={isAdminAgentMode ? "status.title" : "white"}
				fontSize="15px"
				fontWeight={isAdminAgentMode ? "bold" : null}
				cursor={isAdminAgentMode ? "default" : "pointer"}
				onClick={() => setAdminAgentMode(true)}
			>
				Agent
			</Text>
		</Flex>
	);
};

export default AdminViewToggleCard;
