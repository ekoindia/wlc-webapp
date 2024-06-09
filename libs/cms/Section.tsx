import { Flex } from "@chakra-ui/react";
import { CSSProperties, ReactNode, useContext } from "react";
import { context } from ".";

export type SectionProps = {
	children: ReactNode;
	fullWidth?: boolean;
	padding?: string;
	maxWidth?: string;
	bg?: string;
	style?: CSSProperties;
	[key: string]: any;
};

/**
 * Section component for wrapping content in a section with padding and max-width.
 * @param {object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @param {boolean} [props.fullWidth=false] - Ignore paddingX and show the component as full width
 * @param {string} [props.padding] - Vertical padding
 * @param {string} [props.maxWidth] - Maximum width
 * @param {string} [props.bg] - Background color
 * @param {CSSProperties} [props.style] - Additional styles
 * @param {any} [props.rest] - Additional props
 */
export const Section = ({
	children,
	fullWidth = false,
	padding = "8px",
	maxWidth = "1280px",
	bg = "transparent",
	style = {},
	...rest
}: SectionProps) => {
	const { paddingX } = useContext(context);

	return (
		<Flex
			direction="column"
			align="center"
			boxSizing="border-box"
			w="full"
			px={fullWidth ? "0" : paddingX || "0"}
			py={padding}
			bg={bg}
			style={{
				...style,
			}}
			{...rest}
		>
			<div style={{ width: "100%", maxWidth }}>{children}</div>
		</Flex>
	);
};
