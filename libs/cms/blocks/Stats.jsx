import { Box, Flex, Text } from "@chakra-ui/react";
import { Icon } from "components";
import { useEffect, useState } from "react";
import {
	extendedSizeOptions,
	fontWeightOptions,
	iconField,
	paddingSizeMap,
} from "../options";
import { Section } from "../Section";

const sizes = {
	sm: {
		radius: "16px",
		pad: { base: "32px", md: "48px" },
		gap: "32px",
		itemGap: "8px",
		iconSize: "24px",
		titleSize: "14px",
		descSize: "36px",
	},
	md: {
		radius: "20px",
		pad: { base: "48px", md: "64px" },
		gap: "48px",
		itemGap: "8px",
		iconSize: "32px",
		titleSize: "18px",
		descSize: "48px",
	},
	lg: {
		radius: "24px",
		pad: { base: "64px", md: "96px" },
		gap: "72px",
		itemGap: "8px",
		iconSize: "42px",
		titleSize: "22px",
		descSize: "72px",
	},
};

export const Stats = {
	fields: {
		items: {
			type: "array",
			getItemSummary: (item, i) => item.title || `Feature #${i}`,
			defaultItemProps: {
				title: "Feature",
				stat: "100%",
			},
			arrayFields: {
				title: { type: "text" },
				stat: { type: "text" },
				ico: iconField,
			},
		},
		t: {
			type: "select",
			label: "Type",
			options: [
				{ label: "Section", value: "" },
				{ label: "Box", value: "box" },
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
		s: {
			type: "select",
			label: "Size",
			options: [
				{ label: "Small", value: "sm" },
				{ label: "Medium", value: "md" },
				{ label: "Large", value: "lg" },
			],
		},
		wt: {
			type: "select",
			label: "Font Weight",
			options: fontWeightOptions,
		},
		p: {
			type: "select",
			label: "Vertical Padding",
			options: extendedSizeOptions,
		},
	},
	defaultProps: {
		items: [
			{
				title: "Users Reached",
				stat: "20K+",
			},
			{
				title: "Avg. Earning",
				stat: "15K",
			},
		],
		s: "md",
		wt: "700",
		p: "md",
	},
	render: ({ items, t, s, wt = "700", p = "md", head, desc }) => {
		/* eslint-disable react-hooks/rules-of-hooks */

		const [paddingX, setPaddingX] = useState("");

		useEffect(() => {
			const padding = p && p in paddingSizeMap ? paddingSizeMap[p] : p;
			setPaddingX(padding);
		}, [p]);

		const bg = "linear-gradient(120deg,primary.dark 0%,primary.light 100%)";
		const isBox = t === "box";
		const sz = sizes[s] || sizes.md;

		return (
			<Section
				padding={paddingX}
				sectionBg={isBox ? undefined : bg}
				title={head}
				desc={desc}
				titleDivider
				titleBottomPadding="0"
			>
				<Box
					bgGradient={isBox ? bg : undefined}
					borderRadius={sz.radius}
					padding={sz.pad}
					display="grid"
					gridTemplateColumns={{
						base: "1fr",
						// md: "1fr 1fr",
						md: "repeat(auto-fit, minmax(200px, 1fr) )",
					}} // md: "1fr 1fr"
					gridGap={sz.gap}
					alignItems="center"
					justifyContent="space-between"
					m={isBox ? "0 auto" : 0}
					w={isBox ? undefined : "100%"}
					overflow="hidden"
				>
					{items.map((item, i) => (
						<Flex
							key={i}
							position="relative"
							direction="column"
							alignItems="center"
							color="white"
							gap={sz.itemGap}
							// w="100%"
						>
							{item.ico ? (
								<Icon
									name={item.ico}
									color="white"
									size={sz.iconSize}
								/>
							) : null}
							<Text
								fontSize={sz.titleSize}
								textAlign="center"
								fontWeight="600"
								opacity="0.8"
							>
								{item.title}
							</Text>
							<Text
								fontSize={sz.descSize}
								lineHeight="1"
								fontWeight={wt || "700"}
							>
								{item.stat}
							</Text>
							{/* Add a vertical divider at the center of all grid item gaps  */}
							{/* {i > 0 ? (
								<Box
									position="absolute"
									t="0"
									b="0"
									left={`-${sz.itemGap}`}
									// transform="translate(-50%, -50%)"
									w="2px"
									bg="white"
									opacity="0.3"
									h="100%"
								/>
							) : null} */}
						</Flex>
					))}
				</Box>
			</Section>
		);
	},
};
