import { Box, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components/Icon";

interface StepHeaderProps {
	title: string;
	subtitle?: string;
	onBack?: () => void;
	toolComponent?: React.ReactNode;
}

/**
 * Consistent header for DigiKhata step screens.
 * Mirrors the layout of the app-level PageTitle component.
 * @param {object} root0 - Component props
 * @param {string} root0.title - Step title
 * @param {string} [root0.subtitle] - Optional subtitle line
 * @param {() => void} [root0.onBack] - If provided, renders a back icon on the left
 * @param {React.ReactNode} [root0.toolComponent] - Optional right-side action slot
 * @returns {JSX.Element} Step header row
 */
export const StepHeader = ({
	title,
	subtitle,
	onBack,
	toolComponent,
}: StepHeaderProps): JSX.Element => (
	<Flex
		justify="space-between"
		align={{ base: "flex-start", md: "center" }}
		direction={{ base: "column", md: "row" }}
		gap={4}
	>
		<Flex align="center" gap={3}>
			{onBack ? (
				<Box onClick={onBack} cursor="pointer" flexShrink={0}>
					<Icon
						name="arrow-back"
						size={{ base: "16px", "2xl": "18px" }}
					/>
				</Box>
			) : null}
			<Flex
				direction="column"
				gap={0.5}
				cursor="default"
				userSelect="none"
			>
				<Text
					fontWeight="semibold"
					fontSize={{ base: "lg", md: "xl" }}
					color="dark"
				>
					{title}
				</Text>
				{subtitle ? (
					<Text fontSize="sm" color="light">
						{subtitle}
					</Text>
				) : null}
			</Flex>
		</Flex>
		{toolComponent ?? null}
	</Flex>
);
