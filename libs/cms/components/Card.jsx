import { Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { IconLibrary } from "constants/IconLibrary";

/**
 * Defaults for new feature items
 */
const DEFAULTS = {
	title: "Feature",
	desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum diam in lacus convallis, et vehicula magna luctus. Donec quis velit nisi. Aenean tristique.",
	icon: "badge",
};

const iconOptions = Object.keys(IconLibrary).map((iconName) => ({
	label: iconName,
	value: iconName,
}));

export const FeatureList = {
	fields: {
		mode: {
			type: "radio",
			options: [
				{ label: "Flat", value: "flat" },
				{ label: "Card", value: "card" },
			],
		},
		title: { type: "text" },
		desc: { type: "textarea", label: "description" },
		icon: {
			type: "select",
			options: iconOptions,
		},
	},

	defaultProps: {
		mode: "flat",
		...DEFAULTS,
	},

	render: ({ icon, title, desc, mode }) => {
		return (
			<FeatureItem
				icon={icon}
				title={title}
				desc={desc}
				cardMode={mode === "card"}
			/>
		);
	},
};

/**
 * Feature Item component
 * @param {object} props
 * @param {string} props.icon - Icon name
 * @param {string} props.title - Title
 * @param {string} props.desc - Description
 * @param {boolean} props.cardMode - Card mode
 */
const FeatureItem = ({ icon, title, desc, cardMode = false }) => {
	return (
		<Flex
			direction="column"
			align={cardMode ? "flex-start" : "center"}
			w={cardMode ? "auto" : "full"}
			maxW={cardMode ? "full" : "300px"}
			mx={cardMode ? "unset" : "auto"}
			p={cardMode ? "24px" : "0"}
			gap="16px"
			bg={cardMode ? "white" : "transparent"}
			shadow={cardMode ? "base" : "none"}
			borderRadius={cardMode ? "md" : "none"}
		>
			<Flex
				align="center"
				justify="center"
				w="64px"
				h="64px"
				borderRadius="full"
				bg="accent.light"
				color="white"
			>
				<Icon name={icon} size="md" />
			</Flex>
			<Text fontSize="22px" textAlign={cardMode ? "left" : "center"}>
				{title}
			</Text>
			<Text
				fontSize="16px"
				lineHeight="1.5"
				color="#4B5563"
				fontWeight="300"
				textAlign={cardMode ? "left" : "center"}
			>
				{desc}
			</Text>
		</Flex>
	);
};
