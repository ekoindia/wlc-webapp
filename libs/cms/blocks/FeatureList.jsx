import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { IconLibrary } from "constants/IconLibrary";
import { Section } from "../Section";

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
		items: {
			type: "array",
			getItemSummary: (item, i) => item.title || `Feature #${i}`,
			defaultItemProps: DEFAULTS,
			arrayFields: {
				title: { type: "text" },
				desc: { type: "textarea", label: "description" },
				icon: {
					type: "select",
					options: iconOptions,
				},
			},
		},
		mode: {
			type: "radio",
			options: [
				{ label: "flat", value: "flat" },
				{ label: "card", value: "card" },
			],
		},
	},
	defaultProps: {
		items: [DEFAULTS],
		mode: "flat",
	},
	render: ({ items, mode }) => {
		return (
			<Section>
				{mode === "card" ? (
					// columns={{ base: 1, md: 3 }}
					<SimpleGrid minChildWidth="280px" gap="24px">
						{items.map((item, i) => (
							<FeatureItem
								key={i}
								icon={item.icon}
								title={item.title}
								desc={item.desc}
								cardMode={true}
							/>
						))}
					</SimpleGrid>
				) : (
					<Flex
						direction="row"
						align="center"
						justify="space-between"
						wrap="wrap"
						gap="24px"
					>
						{items.map((item, i) => (
							<FeatureItem
								key={i}
								icon={item.icon}
								title={item.title}
								desc={item.desc}
							/>
						))}
					</Flex>
				)}
			</Section>
		);
	},
};

/**
 * Feature Item component
 * @param {Object} props
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
