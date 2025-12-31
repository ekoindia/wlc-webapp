import {
	Avatar,
	Badge,
	Circle,
	Flex,
	HStack,
	Spinner,
	Switch,
	Text,
} from "@chakra-ui/react";
import { Icon } from "components";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import { FiCheck, FiPlus } from "react-icons/fi";

/**
 * Props for the InfoTile component
 */
interface InfoTileProps {
	/** Label for the tile */
	label: string;
	/** Description for the tile */
	desc: string;
	/** Icon for the tile */
	icon?: string;
	/** Style of the icon - avatar (default) or square */
	iconStyle?: "avatar" | "square";
	/** Function to call when the tile is clicked */
	onClick?: () => void;
	/** URL to navigate to when the tile is clicked. This is used if the `onClick` function is not provided */
	url?: string;
	/** Unique name identifier for the tile. When provided, enables event delegation via data-card-name attribute */
	name?: string;
	/** Enable selection mode - shows +/checkmark toggle */
	selectable?: boolean;
	/** Current selection state (only used when selectable=true) */
	selected?: boolean;
	/** Callback when selection is toggled (only used when selectable=true) */
	onSelect?: () => void;
	/** Category tags to display below the description */
	tags?: string[];
	/** Whether to show tags (default: true if tags are provided) */
	showTags?: boolean;
	/** Enable toggle mode - shows a switch to toggle enabled/disabled state */
	toggleMode?: boolean;
	/** Whether the item is enabled (only used when toggleMode=true) */
	isEnabled?: boolean;
	/** Callback when toggle is switched (only used when toggleMode=true) */
	onToggle?: () => void;
	/** Whether toggle is in loading state (only used when toggleMode=true) */
	isToggling?: boolean;
	/** Enable double-click/tap to toggle (only used when toggleMode=true) */
	enableDoubleClickToggle?: boolean;
}

/**
 * A minimal tile component that displays an icon, label, and description.
 * Supports selection mode with a simple plus→checkmark toggle.
 * Supports toggle mode with a switch and optional double-click/tap.
 * When selected, shows primary-colored border and checkmark in circle.
 * @param {InfoTileProps} props - Component props
 * @returns {JSX.Element} Rendered tile component
 */
const InfoTile = ({
	label,
	desc,
	icon,
	iconStyle = "avatar",
	onClick,
	url,
	name,
	selectable = false,
	selected = false,
	onSelect,
	tags,
	showTags = true,
	toggleMode = false,
	isEnabled = true,
	onToggle,
	isToggling = false,
	enableDoubleClickToggle = true,
}: InfoTileProps): JSX.Element => {
	const { h } = useHslColor(label);
	const [onHover, setOnHover] = useState<boolean>(false);
	const router = useRouter();

	// Track double-click timing
	const lastClickTime = useRef<number>(0);
	const DOUBLE_CLICK_DELAY = 300; // ms

	const handleClick = useCallback((): void => {
		// In toggle mode, handle double-click
		if (toggleMode && enableDoubleClickToggle && onToggle) {
			const now = Date.now();
			if (now - lastClickTime.current < DOUBLE_CLICK_DELAY) {
				// Double-click detected
				onToggle();
				lastClickTime.current = 0; // Reset
				return;
			}
			lastClickTime.current = now;
			return;
		}

		// In selectable mode, toggle selection instead of navigation
		if (selectable && onSelect) {
			onSelect();
			return;
		}

		if (onClick && typeof onClick === "function") {
			onClick();
		} else if (url) {
			router.push(url);
		}
	}, [
		toggleMode,
		enableDoubleClickToggle,
		onToggle,
		selectable,
		onSelect,
		onClick,
		url,
		router,
	]);

	const handleToggleClick = useCallback(
		(e: React.MouseEvent): void => {
			e.stopPropagation();
			if (onToggle && !isToggling) {
				onToggle();
			}
		},
		[onToggle, isToggling]
	);

	// Determine if the tile is interactive (not in toggleMode - only toggle switch is interactive)
	const isInteractive = selectable || onClick || url;

	// Selection toggle - checkmark in circle when selected, plus icon when not
	const SelectionToggle = () => {
		if (!selectable) return null;

		if (selected) {
			return (
				<Circle
					size="28px"
					bg="primary.DEFAULT"
					color="white"
					flexShrink={0}
				>
					<FiCheck size={16} strokeWidth={3} />
				</Circle>
			);
		}

		return (
			<Flex
				w="28px"
				h="28px"
				align="center"
				justify="center"
				color="gray.400"
				flexShrink={0}
			>
				<FiPlus size={18} strokeWidth={2} />
			</Flex>
		);
	};

	// Toggle switch component
	const ToggleSwitch = () => {
		if (!toggleMode) return null;

		return (
			<Flex
				align="center"
				justify="center"
				flexShrink={0}
				onClick={handleToggleClick}
				cursor={isToggling ? "wait" : "pointer"}
			>
				{isToggling ? (
					<Spinner size="sm" color="primary.DEFAULT" />
				) : (
					<Switch
						isChecked={isEnabled}
						variant="primary"
						size="md"
						isDisabled={isToggling}
						onChange={() => {}}
						pointerEvents="none"
					/>
				)}
			</Flex>
		);
	};

	const tileContent = (
		<Flex
			key={label}
			w="100%"
			h="100%"
			bg={selected ? `hsl(${h},80%,96%)` : "white"}
			p="4"
			borderRadius="8"
			align={selectable || toggleMode ? "flex-start" : "center"}
			justify="space-between"
			gap="3"
			transition="all 0.2s ease-out"
			cursor={isInteractive ? "pointer" : "default"}
			border="2px solid"
			borderColor="transparent"
			_hover={
				toggleMode
					? {} // No hover effect in toggle mode
					: {
							bg: `hsl(${h},80%,96%)`,
							borderColor: `hsl(${h},70%,70%)`,
						}
			}
			boxShadow="sh-button"
			onMouseEnter={() => setOnHover(true)}
			onMouseLeave={() => setOnHover(false)}
			onClick={handleClick}
		>
			<Flex align="center" gap="4" w="100%">
				{iconStyle === "avatar" ? (
					<Avatar
						size={{ base: "sm", md: "md" }}
						name={icon ? null : label}
						border={`2px solid hsl(${h},80%,90%)`}
						bg={`hsl(${h},80%,95%)`}
						color={`hsl(${h},80%,30%)`}
						icon={
							<Icon
								size={{ base: "sm", md: "md" }}
								name={icon}
								color={`hsl(${h},80%,30%)`}
							/>
						}
					/>
				) : iconStyle === "square" ? (
					<Flex
						w="32px"
						h="32px"
						bg={
							toggleMode && !isEnabled
								? "gray.400"
								: `hsl(${h},80%,60%)`
						}
						borderRadius="6px"
						align="center"
						justify="center"
						flexShrink={0}
					>
						<Icon size="sm" name={icon} color="#FFF" />
					</Flex>
				) : null}
				<Flex direction="column" w="100%" gap="1">
					{label?.length > 0 ? (
						<Text
							fontSize={{ base: "sm", md: "md" }}
							fontWeight="medium"
							userSelect="none"
						>
							{label}
						</Text>
					) : null}
					{desc?.length > 0 ? (
						<Text
							fontSize="xxs"
							userSelect="none"
							noOfLines={2}
							color="gray.600"
						>
							{desc}
						</Text>
					) : null}
					{/* Tags - pill style with border */}
					{showTags && tags && tags.length > 0 ? (
						<HStack spacing="2" mt="2" flexWrap="wrap">
							{tags.map((tag) => (
								<Badge
									key={tag}
									fontSize="xxs"
									px="2"
									py="0.5"
									borderRadius="full"
									fontWeight="normal"
									textTransform="uppercase"
									letterSpacing="0.02em"
									borderWidth="1px"
									borderColor="gray.300"
									color="gray.600"
									bg="white"
									userSelect="none"
								>
									{tag}
								</Badge>
							))}
						</HStack>
					) : null}
				</Flex>
			</Flex>
			{/* Right side: Toggle switch, Selection toggle, or arrow */}
			{toggleMode ? (
				<ToggleSwitch />
			) : selectable ? (
				<SelectionToggle />
			) : (
				<Icon
					name="arrow-forward"
					size={{ base: "xs", sm: "sm" }}
					color={onHover ? `hsl(${h},80%,30%)` : "transparent"}
				/>
			)}
		</Flex>
	);

	// Wrap with data-card-name div when name is provided for event delegation
	if (name) {
		return (
			<div
				data-card-name={name}
				style={{ width: "100%", height: "100%" }}
			>
				{tileContent}
			</div>
		);
	}

	return tileContent;
};

export default InfoTile;
