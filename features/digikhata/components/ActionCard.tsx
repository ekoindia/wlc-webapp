import { Box, Icon as ChakraIcon, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";
import { IconNameType } from "constants/IconLibrary";
import { fadeSlideInBottom12 } from "libs/chakraKeyframes";
import { IconType } from "react-icons";

interface ActionCardProps {
	label: string;
	description?: string;
	icon: IconNameType | IconType;
	gradient: string;
	onClick: () => void;
	isDisabled?: boolean;
	animationDelay?: string;
}

/**
 * Full-width gradient clickable card used for primary product actions:
 * "Load Wallet" and "Transfer Fund". Lifts on hover.
 * @param root0
 * @param root0.label
 * @param root0.description
 * @param root0.icon
 * @param root0.gradient
 * @param root0.onClick
 * @param root0.isDisabled
 * @param root0.animationDelay
 */
export const ActionCard = ({
	label,
	description,
	icon,
	gradient,
	onClick,
	isDisabled = false,
	animationDelay = "0s",
}: ActionCardProps): JSX.Element => {
	const isInternalIcon = typeof icon === "string";

	return (
		<Box
			as="button"
			w="full"
			bgGradient={gradient}
			borderRadius="10"
			p={5}
			boxShadow="sh-button"
			onClick={isDisabled ? undefined : onClick}
			cursor={isDisabled ? "not-allowed" : "pointer"}
			opacity={isDisabled ? 0.5 : 1}
			textAlign="left"
			sx={{
				animation: `${fadeSlideInBottom12} 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
				animationDelay,
			}}
			transition="all 0.2s ease-out"
			_hover={
				isDisabled
					? {}
					: { transform: "translateY(-2px)", boxShadow: "basic" }
			}
			_active={isDisabled ? {} : { transform: "translateY(0)" }}
		>
			<Flex align="center" gap={4}>
				<Flex
					align="center"
					justify="center"
					w={12}
					h={12}
					borderRadius="full"
					bg="whiteAlpha.200"
					flexShrink={0}
				>
					{isInternalIcon ? (
						<Icon name={icon} color="white" size="md" />
					) : (
						<ChakraIcon
							as={icon}
							boxSize={6}
							color="white"
							data-testid="action-card-external-icon"
						/>
					)}
				</Flex>
				<Flex direction="column" gap={0.5}>
					<Text
						fontWeight="bold"
						fontSize="lg"
						color="white"
						userSelect="none"
					>
						{label}
					</Text>
					{description ? (
						<Text
							fontSize="xs"
							color="whiteAlpha.800"
							userSelect="none"
						>
							{description}
						</Text>
					) : null}
				</Flex>
			</Flex>
		</Box>
	);
};
