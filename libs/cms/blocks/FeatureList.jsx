import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { Icon } from "components";
import useHslColor from "hooks/useHslColor";
import { useEffect, useState } from "react";
import { extendedSizeOptions, iconField, paddingSizeMap } from "../options";
import { Section } from "../Section";

/**
 * Defaults for new feature items
 */
const DEFAULTS = {
	title: "Feature",
	desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum diam in lacus convallis, et vehicula magna luctus.",
	ico: "badge",
};

export const FeatureList = {
	fields: {
		items: {
			type: "array",
			getItemSummary: (item, i) => item.title || `Feature #${i}`,
			defaultItemProps: DEFAULTS,
			arrayFields: {
				title: { type: "text" },
				desc: { type: "textarea", label: "description" },
				ico: iconField,
			},
		},
		mode: {
			type: "radio",
			options: [
				{ label: "flat", value: "flat" },
				{ label: "card", value: "card" },
			],
		},
		head: {
			type: "text",
			label: "Heading",
		},
		desc: {
			type: "textarea",
			label: "Description",
		},
		clr: {
			type: "select",
			label: "Icon Color",
			options: [
				{ label: "Auto Colors (Dark)", value: "" },
				{ label: "Auto Colors (Light)", value: "light" },
				{ label: "Primary", value: "primary.LIGHT" },
				{ label: "Accent", value: "accent.LIGHT" },
				{ label: "Dark Gray", value: "#4B5563" },
				{ label: "Light Gray", value: "#D1D5DB" },
			],
		},
		p: {
			type: "select",
			label: "Vertical Padding",
			options: extendedSizeOptions,
		},
	},
	defaultProps: {
		items: [DEFAULTS, DEFAULTS, DEFAULTS],
		mode: "flat",
		p: "md",
		clr: "",
	},
	render: ({ items, mode, clr, p, head, desc }) => {
		/* eslint-disable react-hooks/rules-of-hooks */

		const [paddingX, setPaddingX] = useState("");

		useEffect(() => {
			const padding = p && p in paddingSizeMap ? paddingSizeMap[p] : p;
			setPaddingX(padding);
		}, [p]);

		return (
			<Section
				padding={paddingX}
				title={head}
				desc={desc}
				titleBottomPadding="1em"
			>
				{mode === "card" ? (
					// columns={{ base: 1, md: 3 }}
					<SimpleGrid minChildWidth="280px" gap="24px">
						{items.map((item, i) => (
							<FeatureItem
								key={i}
								icon={item.ico}
								title={item.title}
								desc={item.desc}
								cardMode={true}
								color={clr}
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
								icon={item.ico}
								title={item.title}
								desc={item.desc}
								color={clr}
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
 * @param {string} props.color - Icon color
 * @param {boolean} props.cardMode - Card mode
 */
const FeatureItem = ({ icon, title, desc, color, cardMode = false }) => {
	const { h } = useHslColor(title);
	const isLightAutoColor = color === "light";
	const isDarkAutoColor = !color || color === "dark";
	const isAutoColor = isLightAutoColor || isDarkAutoColor;
	const lightness = isLightAutoColor ? "85%" : "60%";
	const icoLightness = isLightAutoColor ? "30%" : "95%";

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
				// bg="accent.light"
				bg={isAutoColor ? `hsl(${h},80%,${lightness})` : color}
				color={isAutoColor ? `hsl(${h},80%,${icoLightness})` : "white"}
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
