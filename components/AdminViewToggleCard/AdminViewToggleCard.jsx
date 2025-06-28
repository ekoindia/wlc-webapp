import { Box, Flex, Text } from "@chakra-ui/react";
import { useUser } from "contexts";
import { Icon } from "..";

/**
 * A beautiful segmented toggle component for switching between Admin and Agent views.
 * Features a modern glassmorphism design with smooth animations and sliding indicator.
 * @param {boolean} [minimal] - Whether to use minimal styling (for profile card)
 * @param {...*} rest - Rest of the props passed to this component
 * @returns {JSX.Element|null} - The toggle component or null if user doesn't have access
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
			direction={{ base: "row", md: "column" }}
			w="100%"
			padding={minimal ? "16px 8px" : "16px 15px"}
			mb="4px"
			align="center"
			bg={minimal ? null : "status.bgLight"}
			borderTop={minimal ? "1px solid rgba(255, 255, 255, 0.15)" : null}
			gap="3"
			{...rest}
		>
			{/* Label */}
			<Text
				fontSize="11px"
				color="rgba(255, 255, 255, 0.7)"
				fontWeight="medium"
				letterSpacing="0.5px"
				textTransform="uppercase"
			>
				VIEW AS
			</Text>

			{/* Beautiful Segmented Toggle */}
			<Box position="relative">
				{/* Background pill */}
				<Flex
					bg="rgba(255, 255, 255, 0.15)"
					borderRadius="full"
					p="4px"
					border="1px solid rgba(255, 255, 255, 0.2)"
					backdropFilter="blur(10px)"
					boxShadow="0 8px 20px rgba(0, 0, 0, 0.15)"
					position="relative"
					w="200px"
					h="44px"
					align="center"
				>
					{/* Sliding active indicator */}
					<Box
						position="absolute"
						top="50%"
						transform="translateY(-50%)"
						left={isAdminAgentMode ? "102px" : "4px"}
						w="94px"
						h="36px"
						bg="rgba(255, 255, 255, 0.9)"
						borderRadius="full"
						transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
						boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
						backdropFilter="blur(20px)"
						zIndex="1"
					/>

					{/* Admin Option */}
					<Flex
						flex="1"
						align="center"
						justify="center"
						gap="2"
						cursor="pointer"
						borderRadius="full"
						transition="all 0.2s ease"
						position="relative"
						zIndex="2"
						h="100%"
						onClick={() => setAdminAgentMode(false)}
						_hover={{
							transform: "scale(1.02)",
						}}
					>
						<Icon
							name="settings" // supervisor-account
							size="14px"
							color={
								isAdminAgentMode
									? "rgba(255, 255, 255, 0.7)"
									: "primary.DEFAULT"
							}
							transition="all 0.3s ease"
						/>
						<Text
							fontSize="13px"
							fontWeight="semibold"
							color={
								isAdminAgentMode
									? "rgba(255, 255, 255, 0.7)"
									: "primary.DEFAULT"
							}
							transition="all 0.3s ease"
							whiteSpace="nowrap"
						>
							Admin
						</Text>
					</Flex>

					{/* Agent Option */}
					<Flex
						flex="1"
						align="center"
						justify="center"
						gap="2"
						cursor="pointer"
						borderRadius="full"
						transition="all 0.2s ease"
						position="relative"
						zIndex="2"
						h="100%"
						onClick={() => setAdminAgentMode(true)}
						_hover={{
							transform: "scale(1.02)",
						}}
					>
						<Icon
							name="person"
							size="14px"
							color={
								isAdminAgentMode
									? "primary.DEFAULT"
									: "rgba(255, 255, 255, 0.7)"
							}
							transition="all 0.3s ease"
						/>
						<Text
							fontSize="13px"
							fontWeight="semibold"
							color={
								isAdminAgentMode
									? "primary.DEFAULT"
									: "rgba(255, 255, 255, 0.7)"
							}
							transition="all 0.3s ease"
							whiteSpace="nowrap"
						>
							Agent
						</Text>
					</Flex>
				</Flex>
			</Box>
		</Flex>
	);
};

export default AdminViewToggleCard;
