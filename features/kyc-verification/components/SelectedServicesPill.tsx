/**
 * SelectedServicesPill component for displaying selected services as removable pills.
 */

import { Badge, Flex, HStack, Text } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import type { VerificationService } from "../types";

interface SelectedServicesPillProps {
	/** Selected services to display */
	services: VerificationService[];
	/** Callback when a service pill is removed */
	onRemove?: (_serviceCode: string) => void;
	/** Whether pills are removable */
	removable?: boolean;
	/** Maximum number of pills to show before collapsing */
	maxVisible?: number;
}

/**
 * Displays selected KYC verification services as removable pills with accent color.
 * Shows placeholder badge when empty to prevent UI shift.
 * @param {SelectedServicesPillProps} props - Component props
 * @param {VerificationService[]} props.services - Array of selected services to display as pills
 * @param {Function} [props.onRemove] - Callback invoked when a service pill is removed
 * @param {boolean} [props.removable] - Whether pills can be removed (default: true)
 * @param {number} [props.maxVisible] - Maximum number of pills to show before collapsing (default: 5)
 * @returns {JSX.Element} Rendered pill badges with optional overflow indicator
 */
export const SelectedServicesPill = ({
	services,
	onRemove,
	removable = true,
	maxVisible = 5,
}: SelectedServicesPillProps): JSX.Element => {
	const visibleServices = services?.slice(0, maxVisible) || [];
	const hiddenCount = (services?.length || 0) - maxVisible;
	const isEmpty = services.length === 0;

	return (
		<Flex align="center" gap="2" flexWrap="wrap">
			<Text fontSize="xs" fontWeight="medium" color="gray.500">
				Selected:
			</Text>
			<HStack spacing="2" flexWrap="wrap">
				{isEmpty ? (
					<Badge
						display="flex"
						alignItems="center"
						px="2"
						py="0.5"
						borderRadius="md"
						bg="gray.100"
						color="gray.400"
						fontWeight="medium"
						fontSize="xs"
						fontStyle="italic"
					>
						None
					</Badge>
				) : (
					<>
						{visibleServices.map((service) => (
							<Badge
								key={service.serviceCode}
								role="group"
								display="flex"
								alignItems="center"
								gap="1.5"
								px="2"
								py="0.5"
								borderRadius="md"
								bg="primary.DEFAULT"
								color="white"
								fontWeight="medium"
								fontSize="xs"
								letterSpacing="0.02em"
								cursor={
									removable && onRemove
										? "pointer"
										: "default"
								}
								onClick={
									removable && onRemove
										? () => onRemove(service.serviceCode)
										: undefined
								}
								_hover={
									removable && onRemove
										? { bg: "primary.200", opacity: 0.9 }
										: undefined
								}
								transition="all 0.15s ease"
								sx={{
									"& .close-icon": {
										color: "white",
										transition: "color 0.15s ease",
									},
									"&:hover .close-icon": {
										color: "var(--chakra-colors-error)",
									},
								}}
							>
								<Text as="span">{service.name}</Text>
								{removable && onRemove && (
									<FiX size={12} className="close-icon" />
								)}
							</Badge>
						))}
						{hiddenCount > 0 && (
							<Badge
								px="2"
								py="0.5"
								borderRadius="md"
								bg="gray.100"
								color="gray.600"
								fontSize="xs"
								fontWeight="medium"
							>
								+{hiddenCount} more
							</Badge>
						)}
					</>
				)}
			</HStack>
		</Flex>
	);
};

export default SelectedServicesPill;
