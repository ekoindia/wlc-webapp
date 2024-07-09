import { Flex, Text } from "@chakra-ui/react";
import { CSSProperties, ReactNode, useContext } from "react";
import { getContrastColor } from "utils";
import { context } from ".";

export type SectionProps = {
	title?: string;
	desc?: string;
	titleBottomPadding?: string;
	titleDivider?: boolean;
	direction?: "row" | "column" | "row-reverse" | "column-reverse";
	align?: "flex-start" | "center" | "flex-end";
	padding?: string;
	maxWidth?: string;
	fullWidth?: boolean;
	bg?: string;
	bgImg?: string;
	style?: CSSProperties;
	children: ReactNode;
	[key: string]: any;
};

/**
 * Section component for wrapping content in a section with padding and max-width.
 * @param {object} props - Component props
 * @param {string} [props.title] - Section title
 * @param {string} [props.desc] - Section subtitle or decription
 * @param {boolean} [props.titleDivider] - Show a divider after the title
 * @param {string} [props.titleBottomPadding] - Bottom padding after the title & desc
 * @param {string} [props.direction] - Flex direction
 * @param {string} [props.align] - Flex alignment
 * @param {string} [props.padding] - Vertical padding
 * @param {string} [props.maxWidth] - Maximum width
 * @param {boolean} [props.fullWidth] - Ignore horizontal padding to show the content in full width
 * @param {string} [props.bg] - Background color
 * @param {string} [props.bgImg] - Background image
 * @param {CSSProperties} [props.style] - Additional styles
 * @param {ReactNode} props.children - Child components
 * @param {any} [props.rest] - Additional props
 * @param props.sectionBg
 */
export const Section = ({
	title,
	desc,
	titleDivider = false,
	titleBottomPadding = "10px",
	direction = "row",
	align = "center",
	padding = "8px",
	maxWidth = "1024px",
	fullWidth = false,
	bg = "transparent",
	sectionBg,
	bgImg = "",
	style = {},
	children,
	...rest
}: SectionProps) => {
	const { paddingX, commonSectionBg } = useContext(context);

	const actualSectionBg = sectionBg || commonSectionBg || "#FFF";

	const isGradient = actualSectionBg?.includes("gradient");

	const contrastColor = getContrastColor(actualSectionBg);

	return (
		<Flex
			className="cms-section"
			direction="column"
			align="center"
			boxSizing="border-box"
			w="full"
			maxW="full"
			bg={bg}
			bgImg={bgImg}
			style={{
				...style,
			}}
		>
			<Flex
				direction="column"
				w="full"
				maxW={maxWidth}
				px={fullWidth ? 0 : paddingX || 0}
				py={padding || 0}
				bg={isGradient ? undefined : actualSectionBg}
				bgGradient={isGradient ? actualSectionBg : undefined}
				color={contrastColor}
			>
				{title || desc ? (
					<Flex
						pb={titleBottomPadding}
						direction="column"
						align="center"
						opacity="0.8"
					>
						{title ? (
							<Text as="h2" fontSize="2xl" fontWeight="semibold">
								{title}
							</Text>
						) : null}
						{desc ? (
							<Text as="p" fontSize="md">
								{desc}
							</Text>
						) : null}
						{titleDivider && (title || desc) ? (
							<Flex
								w="60px"
								h="5px"
								borderRadius="full"
								bg={
									actualSectionBg.startsWith("accent")
										? "white"
										: "accent.light"
								}
								mt="1em"
							/>
						) : null}
					</Flex>
				) : null}
				<Flex direction={direction} align={align} w="full" {...rest}>
					{children}
				</Flex>
			</Flex>
		</Flex>
	);
};
