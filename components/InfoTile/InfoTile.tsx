import { Avatar, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import useHslColor from "hooks/useHslColor";
import { useRouter } from "next/router";
import { useState } from "react";

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
	/** Function to call when the tile is clicked */
	onClick?: () => void;
	/** URL to navigate to when the tile is clicked. This is used if the `onClick` function is not provided */
	url?: string;
}

/**
 * A small tile component that displays an icon, label, and description. It can be used as a card-style button to navigate to a different page or perform an action.
 * @param root0
 * @param root0.label
 * @param root0.desc
 * @param root0.icon
 * @param root0.onClick
 * @param root0.url
 */
const InfoTile = ({
	label,
	desc,
	icon,
	onClick,
	url,
}: InfoTileProps): JSX.Element => {
	const { h } = useHslColor(label);
	const [onHover, setOnHover] = useState<boolean>(false);
	const router = useRouter();

	const handleClick = (): void => {
		if (onClick && typeof onClick === "function") {
			onClick();
		} else if (url) {
			router.push(url);
		}
	};

	return (
		<Flex
			key={label}
			w="100%"
			bg="white"
			p="4"
			borderRadius="8"
			align="center"
			justify="space-between"
			gap="1"
			transition="background 0.3s ease-out"
			cursor={onClick || url ? "pointer" : "default"}
			_hover={{
				bg: `hsl(${h},80%,98%)`,
			}}
			boxShadow="buttonShadow"
			onMouseEnter={() => setOnHover(true)}
			onMouseLeave={() => setOnHover(false)}
			onClick={handleClick}
		>
			<Flex align="center" gap="4" w="100%">
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
				<Flex direction="column" w="80%" gap="1">
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
						<Text fontSize="xxs" userSelect="none" noOfLines={3}>
							{desc}
						</Text>
					) : null}
				</Flex>
			</Flex>
			<Icon
				name="arrow-forward"
				size={{ base: "xs", sm: "sm" }}
				color={onHover ? `hsl(${h},80%,30%)` : "transparent"}
			/>
		</Flex>
	);
};

export default InfoTile;
