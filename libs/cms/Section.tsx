import { Flex } from "@chakra-ui/react";
import { CSSProperties, ReactNode, useContext } from "react";
import { context } from ".";

export type SectionProps = {
	direction?: "row" | "column" | "row-reverse" | "column-reverse";
	align?: "flex-start" | "center" | "flex-end";
	padding?: string;
	maxWidth?: string;
	bg?: string;
	bgImg?: string;
	style?: CSSProperties;
	children: ReactNode;
	[key: string]: any;
};

/**
 * Section component for wrapping content in a section with padding and max-width.
 * @param {object} props - Component props
 * @param {string} [props.direction] - Flex direction
 * @param {string} [props.align] - Flex alignment
 * @param {string} [props.padding] - Vertical padding
 * @param {string} [props.maxWidth] - Maximum width
 * @param {string} [props.bg] - Background color
 * @param {string} [props.bgImg] - Background image
 * @param {CSSProperties} [props.style] - Additional styles
 * @param {ReactNode} props.children - Child components
 * @param {any} [props.rest] - Additional props
 */
export const Section = ({
	direction = "row",
	align = "center",
	padding = "8px",
	maxWidth = "1024px",
	bg = "transparent",
	sectionBg = "white",
	bgImg = "",
	style = {},
	children,
	...rest
}: SectionProps) => {
	const { paddingX, commonSectionBg } = useContext(context);

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
				direction={direction}
				align={align}
				w="full"
				maxW={maxWidth}
				px={paddingX || 0}
				py={padding}
				bg={commonSectionBg || sectionBg}
				{...rest}
			>
				{children}
			</Flex>
		</Flex>
	);
};
